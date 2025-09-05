import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  // appearance
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'search'
    | 'date'
    | 'select'
    | 'currency'
    | 'percent' = 'text';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() name?: string;
  @Input() autocomplete?: string;
  @Input() inputId?: string;
  @Input() invalid = false;
  @Input() describedBy?: string;
  @Input() hint?: string; // texto informativo opcional
  @Input() message?: string; // mensaje de error o ayuda prioritaria
  @Input() options?: any[]; // para selects
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() placeholderOption: boolean = true; // si muestra opción placeholder en selects
  @Input() min?: string | number;
  @Input() max?: string | number;
  @Input() step?: string | number;
  @Input() inputClass: string = '';
  // currency specific
  @Input() currencySymbol: string = '$';
  @Input() currencyLocale: string = 'es-MX';
  @Input() currencyDecimals: number = 2; // fixed decimals
  // percent specific (value stored as fraction 0..1, displayed as 0..100%)
  @Input() percentDecimals: number = 0;

  @Output() enter = new EventEmitter<void>();

  value: any = '';
  focused = false;
  showPassword = false;
  private currencyFocused = false; // track focus state for currency inputs
  private percentFocused = false;

  // ControlValueAccessor
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(obj: any): void {
    this.value = obj ?? '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Clases base compartidas para todos los tipos (input/select/date) para unificar estilo
  get baseClass() {
    return 'w-full rounded-xl bg-white text-gray-900 placeholder:text-gray-500 ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none [color-scheme:light] dark:bg-dark-800 dark:text-white dark:placeholder-white/60 dark:ring-gray-700 dark:focus:ring-blue-500 dark:[color-scheme:dark] disabled:opacity-60 disabled:cursor-not-allowed';
  }

  // Altura / padding consistente según size
  get sizeClass() {
    switch (this.size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-4 py-3 text-lg';
      default:
        return 'px-3 py-2';
    }
  }

  get effectiveClass() {
    const extra = this.isPasswordToggle ? ' pr-10' : '';
    return (
      this.baseClass +
      ' ' +
      this.sizeClass +
      extra +
      (this.inputClass ? ' ' + this.inputClass : '')
    );
  }

  get isPasswordToggle() {
    return this.type === 'password';
  }

  get displayType() {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    if (this.type === 'currency' || this.type === 'percent') return 'text';
    return this.type;
  }

  togglePassword = () => {
    this.showPassword = !this.showPassword;
  };

  getLabel = (option: any) => {
    if (option == null) return '';
    if (typeof option === 'string' || typeof option === 'number')
      return String(option);
    return option[this.optionLabel];
  };

  getValue = (option: any) => {
    if (option == null) return '';
    if (typeof option === 'string' || typeof option === 'number') return option;
    return option[this.optionValue];
  };

  parseCurrency = (raw: string): number | null => {
    if (!raw) return null;
    const cleaned = raw.replace(/[^0-9.,-]/g, '');

    if (!cleaned) return null;

    let normalized = cleaned;
    const hasComma = cleaned.includes(',');
    const hasDot = cleaned.includes('.');

    if (hasComma && hasDot) {
      normalized = cleaned.replace(/,/g, '');
    } else if (hasComma && !hasDot) {
      normalized = cleaned.replace(',', '.');
    } else {
      normalized = cleaned.replace(/,/g, '');
    }

    const num = parseFloat(normalized);
    return isNaN(num) ? null : num;
  };

  getCurrency = (): string => {
    if (this.type !== 'currency') return '';
    if (this.currencyFocused) {
      const n =
        typeof this.value === 'number'
          ? this.value
          : this.parseCurrency(String(this.value));
      return n != null ? n.toFixed(this.currencyDecimals) : '';
    }
    const n =
      typeof this.value === 'number'
        ? this.value
        : this.parseCurrency(String(this.value));
    if (n == null || isNaN(n)) return '';
    return `${this.currencySymbol} ${n.toLocaleString(this.currencyLocale, {
      minimumFractionDigits: this.currencyDecimals,
      maximumFractionDigits: this.currencyDecimals,
    })}`;
  };

  currencyInput = (input: string) => {
    this.value = this.parseCurrency(input) ?? '';
    this.onChange(this.value);
  };

  currencyFocus = (event: FocusEvent) => {
    this.currencyFocused = true;
  };

  currencyBlur = () => {
    this.currencyFocused = false;
    this.onTouched();
  };

  // ===== Percent helpers (fraction storage) =====
  getPercent = (): string => {
    if (this.type !== 'percent') return '';
    const n =
      typeof this.value === 'number' ? this.value : parseFloat(this.value);
    if (isNaN(n)) return '';
    const pct = n * 100;
    if (this.percentFocused) {
      return pct.toFixed(this.percentDecimals);
    }
    return pct.toFixed(this.percentDecimals) + ' %';
  };

  percentInput(raw: string) {
    const cleaned = raw.replace(/[^0-9.,-]/g, '').replace(',', '.');

    if (!cleaned) {
      this.value = '';
      this.onChange(this.value);
      return;
    }

    let num = parseFloat(cleaned);

    if (isNaN(num)) {
      return;
    }

    if (num > 1) num = num / 100;
    if (num < 0) num = 0;
    if (num > 1) num = 1;

    const factor = Math.pow(10, this.percentDecimals + 2);
    num = Math.round(num * factor) / factor;

    this.value = num;
    this.onChange(this.value);
  }

  percentFocus() {
    this.percentFocused = true;
  }
  percentBlur() {
    this.percentFocused = false;
    this.onTouched();
  }
}

import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

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
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'search' = 'text';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() name?: string;
  @Input() autocomplete?: string;
  @Input() inputId?: string;
  @Input() invalid = false;
  @Input() describedBy?: string;
  @Input() hint?: string; // texto informativo opcional
  @Input() message?: string; // mensaje de error o ayuda prioritaria

  @Output() enter = new EventEmitter<void>();

  value: any = '';
  focused = false;
  showPassword = false;

  // ControlValueAccessor
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(obj: any): void { this.value = obj ?? ''; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  get paddingClass() {
    let base = '';
    switch (this.size) {
      case 'sm': base = 'px-3 py-1.5 text-sm'; break;
      case 'lg': base = 'px-4 py-3 text-lg'; break;
      default: base = 'px-3 py-2';
    }
    if (this.isPasswordToggle) base += ' pr-10'; // espacio para el icono
    return base;
  }

  get isPasswordToggle() {
    return this.type === 'password';
  }

  get displayType() {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}

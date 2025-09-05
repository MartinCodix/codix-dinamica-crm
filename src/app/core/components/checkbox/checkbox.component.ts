import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkbox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() inputId?: string;
  @Input() name?: string;
  @Input() disabled = false;

  @Output() change = new EventEmitter<boolean>();

  value = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void { this.value = !!value; }
  registerOnChange(onChange: any): void { this.onChange = onChange; }
  registerOnTouched(onTouched: any): void { this.onTouched = onTouched; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }
}

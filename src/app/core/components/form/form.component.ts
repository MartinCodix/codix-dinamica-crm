import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-form',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './form.component.html',
})
export class FormComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = 'pi-briefcase';
  @Input() iconColor: string = 'blue';
  @Input() editing: boolean = false;
  @Input() entityName: string = 'elemento';
}

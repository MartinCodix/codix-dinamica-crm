import { Component, Input } from '@angular/core';
@Component({
  standalone: true,
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() title = '';
  @Input() description = '';
}

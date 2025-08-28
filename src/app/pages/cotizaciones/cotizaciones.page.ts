import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';

@Component({
  standalone: true,
  selector: 'app-cotizaciones',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './cotizaciones.page.html',
})
export class CotizacionesPage {
  

}

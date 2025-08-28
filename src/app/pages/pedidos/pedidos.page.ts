import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';

@Component({
  standalone: true,
  selector: 'app-pedidos',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './pedidos.page.html',
})
export class PedidosPage {


}

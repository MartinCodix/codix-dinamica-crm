import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';

@Component({
  standalone: true,
  selector: 'app-perfil',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './perfil.page.html',
})
export class PerfilPage {


}

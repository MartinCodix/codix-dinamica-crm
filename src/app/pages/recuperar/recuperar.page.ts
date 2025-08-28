import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'app-recuperar',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './recuperar.page.html',
})
export class RecuperarPage {

}
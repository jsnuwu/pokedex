import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { BackButtonComponent } from '../mainPage/back-button/back-button.component';

@Component({
  selector: 'app-api-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BackButtonComponent],
  templateUrl: './api-page.component.html',
  styleUrl: './api-page.component.css'
})
export class ApiPageComponent {

}

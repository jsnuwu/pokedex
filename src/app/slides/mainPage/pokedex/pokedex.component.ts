import { Component } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import { BackButtonComponent } from "../back-button/back-button.component";

@Component({
  selector: 'app-pokedex',
  imports: [HeaderComponent, BackButtonComponent],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.css'
})
export class PokedexComponent {

}

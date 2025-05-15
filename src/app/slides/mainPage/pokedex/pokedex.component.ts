import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/header.component';
import { BackButtonComponent } from "../back-button/back-button.component";

@Component({
  selector: 'app-pokedex',
   standalone: true,
  imports: [CommonModule, HeaderComponent, BackButtonComponent],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent {
  placeholderPokemon = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ,12];

}

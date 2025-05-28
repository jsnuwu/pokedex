import { Component } from '@angular/core';
import { HeaderComponent } from "../../../header/header.component";
import { BackButtonComponent } from "../../mainPage/back-button/back-button.component";

@Component({
  selector: 'app-pokemon',
  imports: [HeaderComponent, BackButtonComponent],
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.css'
})
export class PokemonComponent {

}

import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() pokemonClicked = new EventEmitter<string>();

  openPokemon(name: string) {
    this.pokemonClicked.emit(name);
  }
}


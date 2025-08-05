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
  placeholderPokemon = Array.from({ length: 151 }, (_, i) => i + 1);
    animationClasses: string[] = [];

  private directions = ['slide-in-left', 'slide-in-right', 'slide-in-top', 'slide-in-bottom'];

  ngOnInit() {
    this.animationClasses = this.placeholderPokemon.map(() => {
      const randomIndex = Math.floor(Math.random() * this.directions.length);
      return this.directions[randomIndex];
    });
  }

  getAnimationClass(index: number): string {
    return this.animationClasses[index];
  }

}

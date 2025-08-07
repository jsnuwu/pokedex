import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/header.component';
import { BackButtonComponent } from "../back-button/back-button.component";
import {HttpClient} from '@angular/common/http';

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  spriteUrl: string;
}

@Component({
  selector: 'app-pokedex',
   standalone: true,
  imports: [CommonModule, HeaderComponent, BackButtonComponent],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {
  fullDex: { id: number; name: string; spriteUrl: string | null }[] = [];
  pokedex: { [id: number]: Pokemon } = {};
  backendUrl: string = 'http://localhost:5258';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchPokemon();
  }

  fetchPokemon(): void {
    this.fullDex = Array.from({ length: 151 }, (_, index) => ({
      id: index + 1,
      name: '???',
      spriteUrl: null
    }));

    this.http.get<Pokemon[]>(`${this.backendUrl}/Pokemon`).subscribe({
      next: (data) => {
        const list = (data as any).$values ?? data;

        list.forEach((p: Pokemon) => {
          const index = p.id - 1;
          if (index >= 0 && index < this.fullDex.length) {
            this.fullDex[index] = p;
          }
        });
      },
      error: (error) => {
        console.error("Fehler beim Abrufen der Pokémon:", error);
      }
    });
  }

  getAnimationClass(index: number): string {
    const directions = ['slide-in-left', 'slide-in-right', 'slide-in-top', 'slide-in-bottom'];
    return directions[index % directions.length];
  }

  get pokedexList(): Pokemon[] {
    return Object.values(this.pokedex);
  }
}

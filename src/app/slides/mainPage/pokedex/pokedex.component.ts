import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/header.component';
import { BackButtonComponent } from "../back-button/back-button.component";
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, BackButtonComponent],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {
  backendUrl: string = 'http://localhost:5258';
  searchTerm: string = '';

  typeColors: { [key: string]: string } = {
    normal: '#bbbbaa',
    fire: '#f44d2a',
    water: '#4a99e2',
    electric: '#f9dd1d',
    grass: '#6bbb5a',
    flying: '#9fc9fe',
    bug: '#94c12e',
    poison: '#9453cc',
    rock: '#b8ab68',
    ground: '#a1763c',
    fighting: '#b45947',
    ice: '#80cebf',
    psychic: '#f56982',
    ghost: '#6c4470',
    dragon: '#5d6fbd',
    steel: '#abaabb',
    dark: '#4d4545',
    fairy: '#e791e6'
  };

  fullDex: {
    id: number;
    name: string;
    spriteUrl: string | null;
    height?: number;
    weight?: number;
    types: string[];
  }[] = [];

  selectedPokemon: {
    id: number;
    name: string;
    spriteUrl: string | null;
    height?: number;
    weight?: number;
    types: string[];
  } | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPokemon();
  }

  fetchPokemon(): void {
    this.fullDex = Array.from({ length: 151 }, (_, index) => ({
      id: index + 1,
      name: '???',
      spriteUrl: null,
      types: []
    }));

    this.http.get<any>(`${this.backendUrl}/Pokemon`).subscribe({
      next: (data) => {
        const list: any[] = Array.isArray(data) ? data : (data?.$values ?? []);

        const normalizeTypes = (t: any): string[] => {
          if (!t) return [];
          if (Array.isArray(t)) return t;
          const arr = t.$values ?? [];
          return arr.map((x: any) => x.typeName ?? x);
        };

        list.forEach((p: any) => {
          const idx = p.id - 1;
          if (idx >= 0 && idx < this.fullDex.length) {
            this.fullDex[idx] = {
              id: p.id,
              name: p.name,
              spriteUrl: p.spriteUrl,
              height: p.height,
              weight: p.weight,
              types: normalizeTypes(p.types)
            };
          }
        });
      },
      error: (error) => {
        console.error('Fehler beim Abrufen der Pokémon:', error);
      }
    });
  }

  filteredDex() {
    const term = this.searchTerm.toLowerCase().trim();
    return this.fullDex.filter(p => (p.name || '').toLowerCase().includes(term));
  }

  getAnimationClass(index: number): string {
    const directions = ['slide-in-left', 'slide-in-right', 'slide-in-top', 'slide-in-bottom'];
    return directions[index % directions.length];
  }

  getCardBackground(types: string[]) {
    if (!types || types.length === 0) {
      return { 'background': '#ffffff' };
    }
    if (types.length === 1) {
      const c1 = this.typeColors[types[0].toLowerCase()] || '#ffffff';
      return { 'background': c1 };
    }
    const c1 = this.typeColors[types[0].toLowerCase()] || '#ffffff';
    const c2 = this.typeColors[types[1].toLowerCase()] || '#ffffff';
    return { 'background': `linear-gradient(135deg, ${c1}, ${c2})` };
  }

  openDetails(pokemon: any) {
    this.selectedPokemon = pokemon;
  }
  closeDetails() {
    this.selectedPokemon = null;
  }
}

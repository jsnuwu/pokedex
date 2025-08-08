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

  openDetails(pokemon: any) {
    this.selectedPokemon = pokemon;
  }
  closeDetails() {
    this.selectedPokemon = null;
  }
}

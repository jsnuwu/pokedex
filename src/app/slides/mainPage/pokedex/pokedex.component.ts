import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/header.component';
import { BackButtonComponent } from '../back-button/back-button.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, BackButtonComponent],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css'],
})
export class PokedexComponent implements OnInit {
  backendUrl: string = 'http://localhost:5258';
  searchTerm: string = '';
  selectedType: string = '';
  isShiny: boolean = false;
  editingNickname: boolean = false;
  nicknameInput: string = '';

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
    fairy: '#e791e6',
  };

  fullDex: {
    id: number;
    name: string;
    spriteUrl: string | null;
    showdownSpriteUrl?: string | null;
    shinySpriteUrl?: string | null;
    height?: number;
    weight?: number;
    types: string[];
    nickname?: string | null;
  }[] = [];

  selectedPokemon: {
    id: number;
    name: string;
    spriteUrl: string | null;
    showdownSpriteUrl?: string | null;
    shinySpriteUrl?: string | null;
    height?: number;
    weight?: number;
    types: string[];
    nickname?: string | null;
  } | null = null;
  entry: any;

  constructor(private http: HttpClient) {}

  hoveredBg: string = '';

  onCardHover(types: string[]) {
    const bg = this.getCardBackground(types).background;
    this.hoveredBg = this.addOpacity(bg, 0.3);
  }

  private addOpacity(color: string, alpha: number): string {
    if (color.startsWith('rgba')) return color;
    if (color.startsWith('rgb'))
      return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
    if (color.startsWith('#')) {
      const c = color.replace('#', '');
      const bigint = parseInt(c, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r},${g},${b},${alpha})`;
    }
    return color;
  }

  onCardLeave() {
    this.hoveredBg = '';
  }

  ngOnInit(): void {
    this.fetchPokemon();

    window.addEventListener('keydown', this.onKeyDown);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (!this.selectedPokemon) return;
    if (e.key === 'ArrowRight') this.nextPokemon();
    if (e.key === 'ArrowLeft') this.prevPokemon();
  };

  fetchPokemon(): void {
    this.fullDex = Array.from({ length: 151 }, (_, index) => ({
      id: index + 1,
      name: '???',
      spriteUrl: null,
      types: [],
    }));

    this.http.get<any>(`${this.backendUrl}/Pokemon`).subscribe({
      next: (data) => {
        const list: any[] = Array.isArray(data) ? data : data?.$values ?? [];

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
              showdownSpriteUrl: p.showdownSpriteUrl,
              shinySpriteUrl: p.shinySpriteUrl,
              height: p.height,
              weight: p.weight,
              types: normalizeTypes(p.types),
              nickname: p.nickname ?? null,
            };
          }
        });
      },
      error: (error) => {
        console.error('Fehler beim Abrufen der Pokémon:', error);
      },
    });
  }

  getAllTypes(): string[] {
    const allTypes = new Set<string>();
    this.fullDex.forEach((p) => {
      p.types.forEach((t) => allTypes.add(t));
    });
    return Array.from(allTypes).sort();
  }

  filteredDex() {
    const term = this.searchTerm.toLowerCase().trim();
    return this.fullDex.filter((p) => {
      const nameMatches = (p.name || '').toLowerCase().includes(term);
      const typeMatches = this.selectedType
        ? p.types
            .map((t) => t.toLowerCase())
            .includes(this.selectedType.toLowerCase())
        : true;
      return nameMatches && typeMatches;
    });
  }

  getAnimationClass(index: number): string {
    const directions = [
      'slide-in-left',
      'slide-in-right',
      'slide-in-top',
      'slide-in-bottom',
    ];
    return directions[index % directions.length];
  }

  getCardBackground(types: string[]) {
    if (!types || types.length === 0) {
      return { background: '#ffffff' };
    }
    if (types.length === 1) {
      const c1 = this.typeColors[types[0].toLowerCase()] || '#ffffff';
      return { background: c1 };
    }
    const c1 = this.typeColors[types[0].toLowerCase()] || '#ffffff';
    const c2 = this.typeColors[types[1].toLowerCase()] || '#ffffff';
    return { background: `linear-gradient(135deg, ${c1}, ${c2})` };
  }

  openDetails(pokemon: any) {
    this.selectedPokemon = pokemon;
    this.isShiny = false;
    this.editingNickname = false;
    this.nicknameInput = pokemon.nickname || '';

    if (pokemon.name !== '???' && pokemon.spriteUrl !== null) {
      const cryPath = `assets/audio/cries/cries_pokemon_legacy_${pokemon.id}.ogg`;
      const audio = new Audio(cryPath);
      audio.volume = 0.1;
      audio.play().catch((err) => {
        console.warn(`Konnte Schrei für #${pokemon.id} nicht abspielen:`, err);
      });
    }
  }

  toggleShiny() {
    this.isShiny = !this.isShiny;
  }

  closeDetails() {
    this.selectedPokemon = null;
  }

  private getSelectedIndex(): number {
    if (!this.selectedPokemon) return -1;
    return this.fullDex.findIndex((p) => p.id === this.selectedPokemon!.id);
  }

  nextPokemon(evt?: MouseEvent) {
    evt?.stopPropagation();
    const i = this.getSelectedIndex();
    if (i === -1) return;
    const next = (i + 1) % this.fullDex.length;
    this.openDetails(this.fullDex[next]);
  }

  prevPokemon(evt?: MouseEvent) {
    evt?.stopPropagation();
    const i = this.getSelectedIndex();
    if (i === -1) return;
    const prev = (i - 1 + this.fullDex.length) % this.fullDex.length;
    this.openDetails(this.fullDex[prev]);
  }

  saveNickname() {
    if (!this.selectedPokemon) return;
    const id = this.selectedPokemon.id;

    this.http
      .put<{ id: number; nickname: string | null }>(
        `${this.backendUrl}/Pokemon/${id}/nickname`,
        { nickname: this.nicknameInput || null }
      )
      .subscribe({
        next: (res) => {
          if (this.selectedPokemon) {
            this.selectedPokemon.nickname = res.nickname;
          }
          const idx = this.fullDex.findIndex((p) => p.id === id);
          if (idx >= 0) this.fullDex[idx].nickname = res.nickname;

          this.editingNickname = false;
        },
        error: (err) =>
          console.error('Nickname speichern fehlgeschlagen:', err),
      });
  }
}

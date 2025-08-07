import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClient} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { BackButtonComponent } from '../mainPage/back-button/back-button.component';

@Component({
  selector: 'app-api-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, BackButtonComponent],
  templateUrl: './api-page.component.html',
  styleUrl: './api-page.component.css'
})
export class ApiPageComponent {
  pokemonToAdd: string = '';
  pokemonToDelete: string = '';
  generationToAdd: number = 1;
  generationToDelete: number = 1;
  backendUrl: string = 'http://localhost:5258';

  constructor(private http: HttpClient) { }

  addPokemonByName() {
    this.http.post(`${this.backendUrl}/Pokemon/${this.pokemonToAdd}`, null)
      .subscribe({
        next: res => alert(`Erfolgreich gespeichert: ${this.pokemonToAdd}`),
        error: err => alert(err.error || 'Fehler beim Speichern')
      });
  }

  addGeneration() {
    this.http.post(`${this.backendUrl}/Pokemon/gen/${this.generationToAdd}`, null)
      .subscribe({
        next: res => alert(`Generation ${this.generationToAdd} hinzugefügt`),
        error: err => alert(err.error || 'Fehler bei Generation')
      });
  }

  deletePokemonByName() {
    this.http.delete(`${this.backendUrl}/Pokemon/${this.pokemonToDelete}`)
      .subscribe({
        next: res => alert(`Gelöscht: ${this.pokemonToDelete}`),
        error: err => alert(err.error || 'Fehler beim Löschen')
      });
  }

  deleteGeneration() {
    this.http.delete(`${this.backendUrl}/Pokemon/gen/${this.generationToDelete}`)
      .subscribe({
        next: res => alert(`Generation ${this.generationToDelete} gelöscht`),
        error: err => alert(err.error || 'Fehler beim Löschen')
      });
  }

  deleteAll() {
    this.http.delete(`${this.backendUrl}/Pokemon/all`)
      .subscribe({
        next: res => alert('Alle Pokémon gelöscht'),
        error: err => alert(err.error || 'Fehler beim Löschen')
      });
  }
}

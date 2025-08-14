import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pokemon } from '../../../shared/models/pokemon.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokedexService {
  private backendUrl = 'http://localhost:5258/Pokemon';

  constructor(private http: HttpClient) {}

  getAllPokemon(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.backendUrl);
  }

}

import { Routes } from '@angular/router';
import { StartPageComponent } from './slides/start-page/start-page.component';
import { PokedexComponent } from './slides/mainPage/pokedex/pokedex.component';
import { PokemonComponent } from './slides/services/pokemon/pokemon.component';

export const routes: Routes = [
  { path: '', component: StartPageComponent },
  { path: 'pokedex', component: PokedexComponent },
  { path: 'pokemon', component: PokemonComponent}
  
];
import { Routes } from '@angular/router';
import { StartPageComponent } from './slides/start-page/start-page.component';
import { PokedexComponent } from './slides/mainPage/pokedex/pokedex.component';
import { ApiPageComponent } from './slides/api-page/api-page.component';
import { ArenaComponent } from './slides/arena/arena.component';
import { OpenWorldComponent } from './slides/open-world/open-world.component';
import { BackButtonComponent } from './slides/mainPage/back-button/back-button.component';
import { InfosComponent } from './slides/open-world/infos/infos.component';

export const routes: Routes = [
  { path: '', component: StartPageComponent },
  { path: 'pokedex', component: PokedexComponent },
  { path: 'api-page', component: ApiPageComponent }, 
  { path: 'arena', component: ArenaComponent },
  { path: 'openWorld', component: OpenWorldComponent },
  { path: 'backbutton', component: BackButtonComponent },
  { path: 'infoPage', component: InfosComponent }
];

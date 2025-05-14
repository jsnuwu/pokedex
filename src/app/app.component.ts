import { Component } from '@angular/core';
import { StartPageComponent } from "./slides/start-page/start-page.component";

@Component({
  selector: 'app-root',
  imports: [StartPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pokedex';
}

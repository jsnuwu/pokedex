import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RadioPlayerComponent } from './radio-player/radio-player.component';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, RadioPlayerComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pokedex';
}

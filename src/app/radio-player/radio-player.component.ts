import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-radio-player',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './radio-player.component.html',
  styleUrls: ['./radio-player.component.css']
})
export class RadioPlayerComponent {
  tracks = [
    { name: 'Opening Theme', url: 'assets/audio/OpeningTheme.mp3' },
    { name: 'Pallet Town', url: 'assets/audio/PalletTown.mp3' },
    { name: 'Route 1', url: 'assets/audio/Route1.mp3' },
    { name: 'Guidepost', url: 'assets/audio/Guidepost.mp3' },
    { name: 'Lavender Town', url: 'assets/audio/LavenderTown.mp3' },
    { name: 'Driftveil City', url: 'assets/audio/DriftveilCity.mp3' },
    { name: 'Gym Leader', url: 'assets/audio/GymLeader.mp3' },
    { name: 'Ending', url: 'assets/audio/Ending.mp3' },
  ];

  selectedTrack = this.tracks[0].url;
}

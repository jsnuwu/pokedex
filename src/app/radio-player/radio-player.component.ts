import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Track = { name: string; url: string };

@Component({
  selector: 'app-radio-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './radio-player.component.html',
  styleUrls: ['./radio-player.component.css']
})
export class RadioPlayerComponent {
  @ViewChild('player', { static: true }) player!: ElementRef<HTMLAudioElement>;

  tracks: Track[] = [
    { name: 'Opening Theme',  url: 'assets/audio/OpeningTheme.mp3' },
    { name: 'Pallet Town',    url: 'assets/audio/PalletTown.mp3' },
    { name: 'Route 1',        url: 'assets/audio/Route1.mp3' },
    { name: 'Guidepost',      url: 'assets/audio/Guidepost.mp3' },
    { name: 'Lavender Town',  url: 'assets/audio/LavenderTown.mp3' },
    { name: 'Driftveil City', url: 'assets/audio/DriftveilCity.mp3' },
    { name: 'Gym Leader',     url: 'assets/audio/GymLeader.mp3' },
    { name: 'Ending',         url: 'assets/audio/Ending.mp3' },
  ];

  currentIndex = 0;
  hasUserInteracted = false;

  ngAfterViewInit() {
    if (this.player?.nativeElement) {
      this.player.nativeElement.volume = 0.1;
    }
  }

  get selectedTrack(): string {
    return this.tracks[this.currentIndex]?.url ?? '';
  }

  onSelect(url: string) {
    const idx = this.tracks.findIndex(t => t.url === url);
    if (idx !== -1) {
      this.currentIndex = idx;
      this.playCurrent();
    }
  }

  onEnded() {
    if (!this.tracks.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
    this.playCurrent();
  }

  prev() {
    if (!this.tracks.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
    this.playCurrent();
  }

  next() {
    if (!this.tracks.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
    this.playCurrent();
  }

  onPlay() {
    this.hasUserInteracted = true;
  }

  private playCurrent() {
    const el = this.player?.nativeElement;
    if (!el) return;

    el.src = this.selectedTrack;
    el.load();

    if (this.hasUserInteracted) {
      const tryPlay = () => el.play().catch(() => {});
      if (el.readyState >= 2) {
        tryPlay();
      } else {
        const onCanPlay = () => { el.removeEventListener('canplay', onCanPlay); tryPlay(); };
        el.addEventListener('canplay', onCanPlay);
      }
    }
  }
}

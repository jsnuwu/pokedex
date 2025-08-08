import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
export class RadioPlayerComponent implements AfterViewInit {
  @ViewChild('player') player!: ElementRef<HTMLAudioElement>;

  tracks: Track[] = [
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
  currentTrackIndex = 0;

  isPlaying = false;
  volume = 0.1;
  hasUserInteracted = false;

  ngAfterViewInit() {
    if (this.player?.nativeElement) {
      this.player.nativeElement.volume = this.volume;
      this.player.nativeElement.autoplay = false;
    }
  }

  togglePlay() {
    const el = this.player?.nativeElement;
    if (!el) return;

    if (el.paused) {
      this.hasUserInteracted = true;
      el.play().then(() => this.isPlaying = true).catch(() => {});
    } else {
      el.pause();
      this.isPlaying = false;
    }
  }

  next() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.selectedTrack = this.tracks[this.currentTrackIndex].url;
    if (this.hasUserInteracted) this.playCurrent();
  }

  prev() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.selectedTrack = this.tracks[this.currentTrackIndex].url;
    if (this.hasUserInteracted) this.playCurrent();
  }

  onSelect(trackUrl: string) {
    this.currentTrackIndex = this.tracks.findIndex(t => t.url === trackUrl);
    this.selectedTrack = trackUrl;
    if (this.hasUserInteracted) this.playCurrent();
  }

  onEnded() {
    this.next();
  }

  setVolume(v: number) {
    this.volume = v;
    const el = this.player?.nativeElement;
    if (el) el.volume = v;
  }

  onPlay()     { this.hasUserInteracted = true; this.isPlaying = true; }
  onPlaying()  { this.isPlaying = true; }
  onPause()    { this.isPlaying = false; }

  private playCurrent() {
    const el = this.player?.nativeElement;
    if (!el) return;

    el.src = this.selectedTrack;
    el.load();

    if (!this.hasUserInteracted) return;

    const tryPlay = () => el.play().then(() => this.isPlaying = true).catch(() => {});
    if (el.readyState >= 2) {
      tryPlay();
    } else {
      const onCanPlay = () => { el.removeEventListener('canplay', onCanPlay); tryPlay(); };
      el.addEventListener('canplay', onCanPlay);
    }
  }
}

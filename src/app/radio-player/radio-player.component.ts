import { Component, ElementRef, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
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
  @ViewChild('driftveilImg') driftveilImg?: ElementRef<HTMLImageElement>;
  @ViewChildren('pokerImage') pokerImageRefs!: QueryList<ElementRef<HTMLImageElement>>;

pokerImages = [
  'assets/images/private/pic1.png',
  'assets/images/private/pic2.png',
  'assets/images/private/pic3.jpg',
  'assets/images/private/pic4.jpg'

];

  tracks: Track[] = [
    { name: 'Opening Theme', url: 'assets/audio/OpeningTheme.mp3' },
    { name: 'Pallet Town', url: 'assets/audio/PalletTown.mp3' },
    { name: 'Route 1', url: 'assets/audio/Route1.mp3' },
    { name: 'Guidepost', url: 'assets/audio/Guidepost.mp3' },
    { name: 'Lavender Town', url: 'assets/audio/LavenderTown.mp3' },
    { name: 'Driftveil City', url: 'assets/audio/DriftveilCity.mp3' },
    { name: 'Gym Leader', url: 'assets/audio/GymLeader.mp3' },
    { name: 'Ending', url: 'assets/audio/Ending.mp3' },
    { name: 'Poker Face', url: 'assets/audio/PokerFace.mp3' }
  ];

  selectedTrack = this.tracks[0].url;
  currentTrackIndex = 0;
  isPlaying = false;
  volume = 0.1;
  hasUserInteracted = false;
  showDriftveilGif = false;
  showBaldMan = false;
  showPokerFace = false;

  private x = 100;
  private y = 100;
  private dx = 2;
  private dy = 2;
  private dvdAnimationId?: number;

private pokerFaces: {
  el: ElementRef<HTMLImageElement>;
  x: number;
  y: number;
  dx: number;
  dy: number;
}[] = [];
  private pokerAnimationId?: number;

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
      this.stopDvdAnimation();
      this.showDriftveilGif = false;
      this.stopPokerAnimation();
      this.showPokerFace = false;
      this.showBaldMan = false;
    }
  }

  next() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.selectedTrack = this.tracks[this.currentTrackIndex].url;
    this.updateGifVisibility();
    this.updateBaldManVisibility();
    this.updatePokerFaceVisibility();

    if (this.hasUserInteracted) this.playCurrent();
  }

  prev() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.selectedTrack = this.tracks[this.currentTrackIndex].url;
    this.updateGifVisibility();
    this.updateBaldManVisibility();
    this.updatePokerFaceVisibility();
    if (this.hasUserInteracted) this.playCurrent();
  }

  onSelect(trackUrl: string) {
    this.currentTrackIndex = this.tracks.findIndex(t => t.url === trackUrl);
    this.selectedTrack = trackUrl;
    this.updateGifVisibility();
    this.updateBaldManVisibility();
    this.updatePokerFaceVisibility();
    if (this.hasUserInteracted) this.playCurrent();
  }

  onPlay() {
    this.hasUserInteracted = true;
    this.isPlaying = true;
    this.updateGifVisibility();
    this.updateBaldManVisibility();
    this.updatePokerFaceVisibility();
  }

  onPlaying() { this.isPlaying = true; this.updateGifVisibility(); }

  onPause() {
    this.isPlaying = false;
    this.stopDvdAnimation();
    this.stopPokerAnimation();
    this.showDriftveilGif = false;
    this.showBaldMan = false;
    this.showPokerFace = false;
  }

  onEnded() {
    this.stopDvdAnimation();
    this.stopPokerAnimation();
    this.showDriftveilGif = false;
    this.showBaldMan = false;
    this.showPokerFace = false;
    this.next();
  }

  setVolume(v: number) {
    this.volume = v;
    const el = this.player?.nativeElement;
    if (el) el.volume = v;
  }

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

  private updateGifVisibility() {
    this.showDriftveilGif = this.tracks[this.currentTrackIndex].name === 'Driftveil City' && this.isPlaying;
    if (this.showDriftveilGif) this.startDvdAnimation();
    else this.stopDvdAnimation();
  }

  private updateBaldManVisibility() {
    this.showBaldMan = this.tracks[this.currentTrackIndex].name === 'Lavender Town' && this.isPlaying;
  }

  private updatePokerFaceVisibility() {
    this.showPokerFace = this.tracks[this.currentTrackIndex].name === 'Poker Face' && this.isPlaying;
    if (this.showPokerFace) {
      setTimeout(() => this.startPokerAnimation(), 0);
    } else {
      this.stopPokerAnimation();
    }
  }

  private startDvdAnimation() {
    if (!this.driftveilImg?.nativeElement) return;
    cancelAnimationFrame(this.dvdAnimationId!);
    const img = this.driftveilImg.nativeElement;

    const animate = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      this.x += this.dx;
      this.y += this.dy;

      if (this.x <= 0 || this.x + img.clientWidth >= screenWidth) this.dx = -this.dx;
      if (this.y <= 0 || this.y + img.clientHeight >= screenHeight) this.dy = -this.dy;

      img.style.left = this.x + 'px';
      img.style.top = this.y + 'px';

      this.dvdAnimationId = requestAnimationFrame(animate);
    };
    animate();
  }

  private stopDvdAnimation() { cancelAnimationFrame(this.dvdAnimationId!); }

private startPokerAnimation() {
  if (!this.pokerImageRefs) return;

  this.pokerFaces = this.pokerImageRefs.toArray().map(el => {
    const nativeEl = el.nativeElement;
    nativeEl.classList.add('show'); // Fade-In starten
    return {
      el,
      x: Math.random() * (window.innerWidth - nativeEl.clientWidth),
      y: Math.random() * (window.innerHeight - nativeEl.clientHeight),
      dx: (Math.random() * 4 + 1) * (Math.random() < 0.5 ? 1 : -1),
      dy: (Math.random() * 4 + 1) * (Math.random() < 0.5 ? 1 : -1)
    };
  });

  const animate = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    this.pokerFaces.forEach(face => {
      face.x += face.dx;
      face.y += face.dy;

      const el = face.el.nativeElement;
      const width = el.clientWidth;
      const height = el.clientHeight;

      if (face.x <= 0) { face.x = 0; face.dx = -face.dx; }
      if (face.x + width >= screenWidth) { face.x = screenWidth - width; face.dx = -face.dx; }
      if (face.y <= 0) { face.y = 0; face.dy = -face.dy; }
      if (face.y + height >= screenHeight) { face.y = screenHeight - height; face.dy = -face.dy; }

      el.style.left = face.x + 'px';
      el.style.top = face.y + 'px';
    });

    this.pokerAnimationId = requestAnimationFrame(animate);
  };

  animate();
}


  private stopPokerAnimation() {
    cancelAnimationFrame(this.pokerAnimationId!);
  }
}

import { Component, HostListener, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../mainPage/back-button/back-button.component';

@Component({
  selector: 'app-open-world',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template: `
  <div class="map">
    <app-back-button></app-back-button>
    <div class="player"
         [ngClass]="direction"
         [style.top.px]="playerY"
         [style.left.px]="playerX">
    </div>
  </div>
  `,
  styleUrls: ['./open-world.component.css']
})
export class OpenWorldComponent {
  playerX = 1090;
  playerY = 0;
  step = 10;
  direction: 'up' | 'down' | 'left' | 'right' = 'down';

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.playerY = Math.max(0, this.playerY - this.step);
        this.direction = 'up';
        break;
      case 'ArrowDown':
        this.playerY = Math.min(1000 - 32, this.playerY + this.step);
        this.direction = 'down';
        break;
      case 'ArrowLeft':
        this.playerX = Math.max(0, this.playerX - this.step);
        this.direction = 'left';
        break;
      case 'ArrowRight':
        this.playerX = Math.min(1920 - 32, this.playerX + this.step);
        this.direction = 'right';
        break;
    }
  }
}

@NgModule({
  imports: [CommonModule, OpenWorldComponent],
  exports: [OpenWorldComponent]
})
export class OpenWorldModule {}

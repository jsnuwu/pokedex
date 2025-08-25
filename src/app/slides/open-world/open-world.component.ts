import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../mainPage/back-button/back-button.component';
import { RouterModule, Router } from '@angular/router'; 

@Component({
  selector: 'app-open-world',
  standalone: true,
  imports: [CommonModule, BackButtonComponent, RouterModule],
  template: `
  <div class="map">
    <app-back-button></app-back-button>

    <div class="player"
         [ngClass]="direction"
         [style.top.px]="playerY"
         [style.left.px]="playerX">
    </div>

    <div *ngFor="let zone of triggerZones"
         class="trigger-zone"
         [style.top.px]="zone.y"
         [style.left.px]="zone.x"
         [style.width.px]="zone.width"
         [style.height.px]="zone.height">
    </div>

    <div class="center-window" *ngIf="showWindow">
      <div class="window-content">
        <p>{{ windowText }}</p>
        <button>
          <a (click)="goToRoute(windowRoute)">{{ buttonLabel }}</a>
        </button>
        <button>
          <a (click)="closeWindow()">No</a>
        </button>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./open-world.component.css']
})
export class OpenWorldComponent {
  playerX = 1090;
  playerY = 10;
  step = 15;
  direction: 'up' | 'down' | 'left' | 'right' = 'down';

  showWindow = false;
  windowText = '';
  windowRoute = '';
  buttonLabel = '';

  triggerZones = [
    { x: 400, y: 240, width: 250, height: 130, triggered: false, 
      windowText: 'Do you want to open the Pokédex?', 
      buttonLabel: 'Yes', 
      targetRoute: '/pokedex' 
    },
    { x: 1060, y: -40, width: 100, height: 45, triggered: false, 
      windowText: 'Do you want to go back to menu?', 
      buttonLabel: 'Yes', 
      targetRoute: '/' 
    },
    { x: 800, y: 10, width: 100, height: 100, triggered: false, 
      windowText: 'Do you want to fight?', 
      buttonLabel: 'Yes', 
      targetRoute: '/arena' 
    },
    { x: 1755, y: 0, width: 290, height: 290, triggered: false, 
      windowText: 'Do you want to fight?', 
      buttonLabel: 'Yes', 
      targetRoute: '/arena' 
    },
    { x: 0, y: 957, width: 2040, height: 100, triggered: false, 
      windowText: 'Do you want to fight?', 
      buttonLabel: 'Yes', 
      targetRoute: '/arena' 
    }
  ];

  constructor(private router: Router) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.playerY = Math.max(0, this.playerY - this.step);
        this.direction = 'up';
        break;
      case 'ArrowDown':
        this.playerY = Math.min(1060 - 62, this.playerY + this.step);
        this.direction = 'down';
        break;
      case 'ArrowLeft':
        this.playerX = Math.max(0, this.playerX - this.step);
        this.direction = 'left';
        break;
      case 'ArrowRight':
        this.playerX = Math.min(2100 - 62, this.playerX + this.step);
        this.direction = 'right';
        break;
    }

    this.checkTrigger();
  }

  checkTrigger() {
    for (const zone of this.triggerZones) {
      const inZone =
        this.playerX + 62 > zone.x &&
        this.playerX < zone.x + zone.width &&
        this.playerY + 62 > zone.y &&
        this.playerY < zone.y + zone.height;

      if (inZone && !zone.triggered) {
        zone.triggered = true;
        this.openWindow(zone);
      } else if (!inZone && zone.triggered) {
        zone.triggered = false;
      }
    }
  }

  openWindow(zone: any) {
    this.showWindow = true;
    this.windowText = zone.windowText;
    this.buttonLabel = zone.buttonLabel;
    this.windowRoute = zone.targetRoute;
  }

  closeWindow() {
    this.showWindow = false;
  }

  goToRoute(route: string) {
    this.router.navigate([route]);
    this.closeWindow();
  }
}

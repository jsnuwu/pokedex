import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../mainPage/back-button/back-button.component';
import { RouterModule } from '@angular/router';
import { PokedexComponent } from '../mainPage/pokedex/pokedex.component';
import { ArenaComponent } from '../arena/arena.component';

@Component({
  selector: 'app-open-world',
  standalone: true,
  imports: [CommonModule, BackButtonComponent, RouterModule],
  template: `
    <div class="map">
      <app-back-button></app-back-button>

      <div class="coin-display">💰 {{ coins }} Coins</div>

      <div
        class="player"
        [ngClass]="direction"
        [style.top.px]="playerY"
        [style.left.px]="playerX"
      ></div>

        /* src="../../../assets/ow/map/betterAngler.png" */ 
      <img
        src="../../../assets/ow/map/grandma.png"
        class="gradnmaNpc"
        [style.top.px]="290"
        [style.left.px]="1195"
      />
      <img
        src="../../../assets/ow/map/angler.png" 
        class="anglerNpc"
        [style.top.px]="810"
        [style.left.px]="1480"
      />
      <div
        *ngFor="let zone of triggerZones"
        class="trigger-zone"
        [style.top.px]="zone.y"
        [style.left.px]="zone.x"
        [style.width.px]="zone.width"
        [style.height.px]="zone.height"
      ></div>

      <div class="center-window" *ngIf="showWindow && !showPopup && !showShop">
        <div class="window-content">
          <p>{{ windowText }}</p>
          <button *ngIf="buttonLabel" (click)="handleYes()">
            {{ buttonLabel }}
          </button>
          <button (click)="closeWindow()">No</button>
        </div>
      </div>
      <img src="../../../assets/ow/map/shopThisWay.png" class="thisway-sign" />

      <div class="inventory-display">
        <h3>Inventar</h3>
        <div *ngFor="let key of inventoryKeys()" class="inventory-item">
          <p>{{ key }}: {{ inventory[key] }}</p>
        </div>
      </div>
      <div class="center-window" *ngIf="showPopup">
        <ng-container *ngIf="currentPopupComponent === PokedexComponent">
          <img
            src="../../../assets/ow/map/pokedex.png"
            class="popup-pokedex-img"
          />
        </ng-container>
        <div class="popup-content">
          <button class="close-btn" (click)="closePopup()">❌</button>

          <ng-container
            *ngComponentOutlet="currentPopupComponent"
          ></ng-container>
        </div>
      </div>

      <div class="center-window" *ngIf="showShop">
        <div class="popup-content shop">
          <h2>Shop</h2>
          <div class="shop-items">
            <div *ngFor="let item of shopItems" class="shop-item">
              <img [src]="item.img" alt="{{ item.name }}" class="item-img" />
              <p>{{ item.name }} - {{ item.price }} Coins</p>
              <button (click)="buyItem(item)">Buy</button>
            </div>
          </div>

          <button class="back-btn" (click)="closeShop()">⬅️ Zurück</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./open-world.component.css'],
})
export class OpenWorldComponent {
  PokedexComponent = PokedexComponent;
  ArenaComponent = ArenaComponent;
  playerX = 1090;
  playerY = 10;
  step = 15;
  direction: 'up' | 'down' | 'left' | 'right' = 'down';

  coins = 0;
  fish = 0;
  inventory: { [item: string]: number } = {};
  shopItems = [
    {
      name: 'Pokéball',
      price: 5,
      img: '../../../assets/ow/items/pokeball.png',
    },
      {
    name: 'Fishing Pole',
    price: 10,
    img: '../../../assets/ow/items/fishingrod.png', 
  },
    { name: 'Potion', price: 10, img: '../../../assets/ow/items/potion.png' },
    {
      name: 'Super Potion',
      price: 20,
      img: '../../../assets/ow/items/superpotion.png',
    },

  ];

  showShop = false;
  showWindow = false;
  showPopup = false;
  windowText = '';
  buttonLabel = '';
  currentZone: any = null;
  currentPopupComponent: any = null;

  triggerZones = [
    {
      x: 400,
      y: 240,
      width: 250,
      height: 130,
      triggered: false,
      windowText: 'Do you want to open the Pokédex?',
      buttonLabel: 'Yes',
      targetRoute: '/pokedex',
    },
    {
      x: 1060,
      y: -40,
      width: 100,
      height: 45,
      triggered: false,
      windowText: 'Do you want to go back to menu?',
      buttonLabel: 'Yes',
      targetRoute: '/',
    },
    {
      x: 800,
      y: 10,
      width: 100,
      height: 100,
      triggered: false,
      windowText: 'Do you want to fight?',
      buttonLabel: 'Yes',
      targetRoute: '/arena',
    },
    {
      x: 1755,
      y: 0,
      width: 290,
      height: 290,
      triggered: false,
      windowText: 'Do you want to fight?',
      buttonLabel: 'Yes',
      targetRoute: '/arena',
    },
    {
      x: 0,
      y: 957,
      width: 2040,
      height: 100,
      triggered: false,
      windowText: 'Do you want to fight?',
      buttonLabel: 'Yes',
      targetRoute: '/arena',
    },

    {
      x: 1193,
      y: 300,
      width: 50,
      height: 50,
      triggered: false,
      windowText: 'Hello child, here are 10 coins for you, buy a fishing pole and get me some fishes🐟',
      buttonLabel: 'Thanks',
      giveCoins: 10,
    },

    {
      x: 880,
      y: 370,
      width: 100,
      height: 100,
      triggered: false,
      windowText: 'Do you want to enter the shop?',
      buttonLabel: 'Yes',
      isShop: true,
    },{
      x: 1480,
      y: 435,
      width: 320,
      height: 300,
      triggered: false,
      windowText: 'fish?',
      buttonLabel: 'Yes',
      isFishingZone: true,
    },
    {
      x: 1473,
      y: 820,
      width: 50,
      height: 60,
      triggered: false,
      windowText: 'Do you sell me some fishes?',
      buttonLabel: 'Yes',
      isAnglerZone: true,
    }
  ];

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
    this.currentZone = zone;
  }

  closeWindow() {
    this.showWindow = false;
    this.currentZone = null;
  }

handleYes() {
  if (this.currentZone?.giveCoins) {
    this.coins += this.currentZone.giveCoins;
    this.currentZone.giveCoins = 0;
    this.currentZone.windowText = 'You already got your Coins';
    this.currentZone.buttonLabel = '';
  }

  if (this.currentZone?.isShop) {
    this.showShop = true;
  } else if (this.currentZone?.isFishingZone) {
    if (this.inventory['Fishing Pole'] > 0) {
      if (Math.random() < 0.4) {
        this.inventory['Fish'] = (this.inventory['Fish'] || 0) + 1;
        alert('You caught a fish! 🐟');
      } else {
        alert('Unfortunately, you didn\'t catch a fish. Try again!');
      }
    } else {
      alert('You need a Fishing Pole to fish here!');
    }
  } else if (this.currentZone?.isAnglerZone) {
    const fishCount = this.inventory['Fish'] || 0;
    if (fishCount > 0) {
      const earnedCoins = fishCount * 5;
      this.coins += earnedCoins;
      this.inventory['Fish'] = 0;
      alert(`You sold ${fishCount} fish for ${earnedCoins} Coins!`);
    } else {
      alert('You have no fish to sell!');
    }
  } else if (this.currentZone?.targetRoute) {
    this.showPopup = true;
    switch (this.currentZone.targetRoute) {
      case '/pokedex':
        this.currentPopupComponent = PokedexComponent;
        break;
      case '/arena':
        this.currentPopupComponent = ArenaComponent;
        break;
      default:
        this.currentPopupComponent = null;
    }
  }

  this.closeWindow();
}




  closePopup() {
    this.showPopup = false;
    this.currentPopupComponent = null;
  }
  closeShop() {
    this.showShop = false;
  }

  buyItem(item: any) {
    if (this.coins >= item.price) {
      this.coins -= item.price;
      this.inventory[item.name] = (this.inventory[item.name] || 0) + 1;
    } else {
      alert('Nicht genug Coins!');
    }
  }

  useItem(itemName: string) {
    if (this.inventory[itemName] > 0) {
      this.inventory[itemName]--;
      alert(`Du hast ${itemName} benutzt!`);
    }
  }

  inventoryKeys() {
    return Object.keys(this.inventory);
  }
}

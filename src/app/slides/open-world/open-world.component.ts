import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../mainPage/back-button/back-button.component';
import { RouterModule } from '@angular/router';
import { PokedexComponent } from '../mainPage/pokedex/pokedex.component';
import { ArenaComponent } from '../arena/arena.component';
import { InfosComponent } from './infos/infos.component';

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
      <img
        src="../../../assets/ow/map/womenNpc.gif"
        class="womenNpc"
        [style.top.px]="620"
        [style.left.px]="280"
      />
      <img
        src="../../../assets/ow/map/oldmanNpc.gif"
        class="oldmanNpc"
        [style.top.px]="280"
        [style.left.px]="1620"
      />
      <img
        src="../../../assets/ow/map/infoSign.png"
        class="infoSign"
        [style.top.px]="50"
        [style.left.px]="1150"
      />
      <img
        src="../../../assets/ow/map/Händler.png"
        class="händlerNpc"
        [style.top.px]="455"
        [style.left.px]="845"
      />
      <img
        src="../../../assets/ow/map/snorlax.gif"
        class="snorlaxNpc"
        [style.top.px]="80"
        [style.left.px]="1475"
      />
            <img
        src="../../../assets/ow/map/slot.png"
        class="slotNpc"
        [style.top.px]="810"
        [style.left.px]="595"
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
          <button (click)="closeWindow()">Back</button>
        </div>
      </div>
      <img src="../../../assets/ow/map/shopThisWay.png" class="thisway-sign" />

      <div class="inventory-display">
        <h3>Inventory</h3>
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

<div class="center-window" *ngIf="showSlotMachine">
  <div class="window-content">
    <h3>🎰 Slot Machine 🎰</h3>
    <div class="slots">
      <span *ngFor="let reel of slotReels" class="reel">{{ reel }}</span>
    </div>
    <p>{{ slotResult }}</p>
    <button (click)="playSlot()">Spin (10 Coins)</button>
    <button (click)="showSlotMachine = false">Back</button>
  </div>
</div>


      <div class="center-window" *ngIf="showRPSGame">
        <div class="window-content">
          <h3>Rock Paper Scissors</h3>
          <p>Choose your move:</p>
          <div class="rps-buttons">
            <button *ngFor="let option of rpsOptions" (click)="playRPS(option)">
              {{ option }}
            </button>
          </div>
          <button (click)="closeRPS()">Back</button>
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
      name: 'Rollator',
      price: 999,
      img: '../../../assets/ow/items/Rollator.png',
    },
  ];

  showShop = false;
  showWindow = false;
  showPopup = false;
  findTheRollator = false;
  windowText = '';
  buttonLabel = '';
  currentZone: any = null;
  currentPopupComponent: any = null;
  rpsOptions = ['🪨', '📃', '✂️'];
  showRPSGame = false;
showSlotMachine = false;
slotReels: string[] = ["", "", ""];
slotSymbols = ["🍒", "🍋", "🍇", "⭐", "💎"]; 
slotResult = "";

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
      buttonLabel: 'yes',
      targetRoute: '/backbutton',
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
      windowText:
        'Hello child, here are 10 coins for you, buy a fishing pole and get me some fishes🐟',
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
    },
    {
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
    },
    {
      x: 1655,
      y: 320,
      width: 50,
      height: 60,
      triggered: false,
      windowText:
        'Fabi: H-h-hey li- little ki- kiddo... c-c-could you help me find my rollator?',
      buttonLabel: 'Sure',
      findTheRollator: true,
    },
    {
      x: 300,
      y: 650,
      width: 50,
      height: 60,
      triggered: false,
      windowText: 'Wanna play Rock-Paper-Scissors for 10 Coins?',
      buttonLabel: 'Play',
      isRPSGame: true,
    },
    {
      x: 1170,
      y: 70,
      width: 60,
      height: 60,
      triggered: false,
      windowText: '👇Infos here',
      buttonLabel: 'Show me',
      targetRoute: '/infoPage',
    },
    {
      x: 835,
      y: 475,
      width: 50,
      height: 50,
      triggered: false,
      windowText: ' huh ',
    },
    {
      x: 1478,
      y: 90,
      width: 60,
      height: 60,
      triggered: false,
      windowText: ' zzzzZZZZZZzzzzzz ',
    },
        {
      x: 624,
      y: 842,
      width: 60,
      height: 60,
      triggered: false,
      windowText: ' Slot-Machine ',
      buttonLabel: 'Lessgo',
    },
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
    if (!this.currentZone) return;

    if (this.currentZone.giveCoins) {
      this.coins += this.currentZone.giveCoins;
      this.currentZone.giveCoins = 0;
      this.currentZone.windowText = 'You already got your Coins';
      this.currentZone.buttonLabel = '';
    }

    if (this.currentZone.isShop) {
      this.showShop = true;
    } else if (this.currentZone.isFishingZone) {
      if (this.inventory['Fishing Pole'] > 0) {
        if (Math.random() < 0.4) {
          this.inventory['Fish'] = (this.inventory['Fish'] || 0) + 1;
          alert('You caught a fish! 🐟');
        } else {
          alert("Unfortunately, you didn't catch a fish. Try again!");
        }
      } else {
        alert('You need a Fishing Pole to fish here!');
      }
    } else if (this.currentZone.isAnglerZone) {
      const fishCount = this.inventory['Fish'] || 0;
      if (fishCount > 0) {
        const earnedCoins = fishCount * 5;
        this.coins += earnedCoins;
        this.inventory['Fish'] = 0;
        alert(`You sold ${fishCount} fish for ${earnedCoins} Coins!`);
      } else {
        alert('You have no fish to sell!');
      }
    } else if (this.currentZone.isRPSGame) {
      this.showRPSGame = true;
    } else if (this.currentZone.windowText === ' Slot-Machine ') {
      this.showSlotMachine = true;
    } else if (this.currentZone.targetRoute) {
      this.showPopup = true;
      switch (this.currentZone.targetRoute) {
        case '/pokedex':
          this.currentPopupComponent = PokedexComponent;
          break;
        case '/arena':
          this.currentPopupComponent = ArenaComponent;
          break;
        case '/backbutton':
          this.currentPopupComponent = BackButtonComponent;
          break;
        case '/infoPage':
          this.currentPopupComponent = InfosComponent;
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
      alert('Not enough coins!');
    }
  }

  playRPS(playerChoice: string) {
    if (this.coins < 10) {
      alert('You need at least 10 Coins to play!');
      return;
    }
    this.coins -= 10;

    const npcChoice = this.rpsOptions[Math.floor(Math.random() * 3)];
    let resultText = `You chose ${playerChoice}, NPC chose ${npcChoice}. `;

    const winsAgainst: { [key: string]: string } = {
      '🪨': '✂️',
      '📃': '🪨',
      '✂️': '📃',
    };

    if (playerChoice === npcChoice) {
      resultText += "It's a draw! You get your 10 Coins back.";
      this.coins += 10;
    } else if (winsAgainst[playerChoice] === npcChoice) {
      resultText += 'You win! +10 Coins';
      this.coins += 20;
    } else {
      resultText += 'You lose! -10 Coins';
    }

    alert(resultText);
    this.showRPSGame = false;
  }

  closeRPS() {
    this.showRPSGame = false;
  }

  inventoryKeys() {
    return Object.keys(this.inventory);
  }

  playSlot() {
  if (this.coins < 10) {
    alert("You need at least 10 Coins to play!");
    return;
  }

  this.coins -= 10;

  this.slotReels = [
    this.slotSymbols[Math.floor(Math.random() * this.slotSymbols.length)],
    this.slotSymbols[Math.floor(Math.random() * this.slotSymbols.length)],
    this.slotSymbols[Math.floor(Math.random() * this.slotSymbols.length)]
  ];

  if (this.slotReels[0] === this.slotReels[1] && this.slotReels[1] === this.slotReels[2]) {
    this.coins += 100; 
    this.slotResult = `JACKPOT! 🎉 You won 100 Coins with ${this.slotReels[0]} ${this.slotReels[1]} ${this.slotReels[2]}`;
  } else if (
    this.slotReels[0] === this.slotReels[1] ||
    this.slotReels[1] === this.slotReels[2] ||
    this.slotReels[0] === this.slotReels[2]
  ) {
    this.coins += 20; 
    this.slotResult = `Nice! You got two of a kind! +20 Coins`;
  } else {
    this.slotResult = `No luck this time `;
  }
}


}


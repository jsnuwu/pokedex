import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../mainPage/back-button/back-button.component';

interface Pokemon {
  name: string;
  hp: number;
  maxHp: number;
  img: string;
  attacks: Attack[];
}

interface Attack {
  name: string;
  damageMin: number;
  damageMax: number;
  type: 'damage' | 'heal';
  cooldown: number;
  currentCooldown?: number;
}

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css'],
  imports: [CommonModule, BackButtonComponent],
})
export class ArenaComponent {
  playerSelected = false;

  starters: Pokemon[] = [
    {
      name: 'Bulbasaur',
      hp: 100,
      maxHp: 100,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',

      attacks: [
        {
          name: 'Vine Whip',
          damageMin: 5,
          damageMax: 12,
          type: 'damage',
          cooldown: 0,
        },
        {
          name: 'Razor Leaf',
          damageMin: 8,
          damageMax: 20,
          type: 'damage',
          cooldown: 2,
        },
        {
          name: 'Heal',
          damageMin: -12,
          damageMax: -8,
          type: 'heal',
          cooldown: 3,
        },
      ],
    },
    {
      name: 'Charmander',
      hp: 100,
      maxHp: 100,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',

      attacks: [
        {
          name: 'Ember',
          damageMin: 6,
          damageMax: 12,
          type: 'damage',
          cooldown: 0,
        },
        {
          name: 'Flamethrower',
          damageMin: 10,
          damageMax: 25,
          type: 'damage',
          cooldown: 3,
        },
        {
          name: 'Scratch',
          damageMin: 3,
          damageMax: 9,
          type: 'damage',
          cooldown: 0,
        },
      ],
    },
    {
      name: 'Squirtle',
      hp: 100,
      maxHp: 100,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',

      attacks: [
        {
          name: 'Water Gun',
          damageMin: 5,
          damageMax: 12,
          type: 'damage',
          cooldown: 0,
        },
        {
          name: 'Bubble',
          damageMin: 4,
          damageMax: 14,
          type: 'damage',
          cooldown: 1,
        },
        {
          name: 'Heal',
          damageMin: -10,
          damageMax: -6,
          type: 'heal',
          cooldown: 3,
        },
      ],
    },
  ];

  player!: Pokemon;
  enemy!: Pokemon;

  log: string[] = [];
  gameOver = false;
  playerWon = false;
  playerShaking = false;
  enemyShaking = false;

  chooseStarter(starter: Pokemon) {
    this.player = {
      ...starter,
      attacks: starter.attacks.map((a) => ({ ...a, currentCooldown: 0 })),
    };
    this.playerSelected = true;
    this.log.push(
      `${starter.name} IS THE CHOSEN ONE! Enemy: It was said that you would *destroy* the Sith, not join them! Bring balance to the Force, not leave it in darkness! ${starter.name}: I HATE YOU!`
    );

    this.enemy = {
      name: 'Random Enemy',
      hp: 100,
      maxHp: 100,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      attacks: [
        {
          name: 'Quick Attack',
          damageMin: 4,
          damageMax: 10,
          type: 'damage',
          cooldown: 0,
          currentCooldown: 0,
        },
        {
          name: 'Thunder Shock',
          damageMin: 6,
          damageMax: 15,
          type: 'damage',
          cooldown: 2,
          currentCooldown: 0,
        },
        {
          name: 'Heal',
          damageMin: -8,
          damageMax: -5,
          type: 'heal',
          cooldown: 3,
          currentCooldown: 0,
        },
      ],
    };
  }

  attack(attacker: Pokemon, defender: Pokemon, atk: Attack, isPlayer = true) {
    if (this.gameOver || (atk.currentCooldown && atk.currentCooldown > 0))
      return;

    let damage =
      Math.floor(Math.random() * (atk.damageMax - atk.damageMin + 1)) +
      atk.damageMin;

    if (atk.type === 'damage' && Math.random() < 0.15) {
      damage *= 2;
      this.log.push(`💥 Critical Hit!`);
    }

    if (atk.type === 'heal') {
      attacker.hp += Math.abs(damage);
      if (attacker.hp > attacker.maxHp) attacker.hp = attacker.maxHp;
      this.log.push(`${attacker.name} heals for ${Math.abs(damage)} HP!`);
    } else {
      defender.hp -= damage;
      if (defender.hp < 0) defender.hp = 0;
      this.log.push(
        `${attacker.name} uses ${atk.name} and deals ${damage} damage!`
      );
    }

    if (atk.type === 'damage') {
      if (defender === this.player) {
        this.playerShaking = true;
        setTimeout(() => (this.playerShaking = false), 300);
      } else {
        this.enemyShaking = true;
        setTimeout(() => (this.enemyShaking = false), 300);
      }
    }

    atk.currentCooldown = atk.cooldown;

    this.checkGameOver();

    if (isPlayer && !this.gameOver && defender.hp > 0) {
      setTimeout(() => {
        const availableAttacks = this.enemy.attacks.filter(
          (a) => !a.currentCooldown || a.currentCooldown <= 0
        );
        const enemyAtk = {
          ...availableAttacks[
            Math.floor(Math.random() * availableAttacks.length)
          ],
        };
        this.attack(defender, attacker, enemyAtk, false);
        this.reduceCooldowns(false);
      }, 700);
    }

    if (isPlayer) this.reduceCooldowns(true);
  }

  reduceCooldowns(forPlayer: boolean) {
    const array = forPlayer ? this.player.attacks : this.enemy.attacks;
    array.forEach((a) => {
      if (a.currentCooldown && a.currentCooldown > 0) {
        a.currentCooldown--;
      }
    });
  }

  checkGameOver() {
    if (this.player.hp <= 0 || this.enemy.hp <= 0) {
      this.gameOver = true;
      this.playerWon = this.player.hp > 0;
    }
  }

  reset() {
    if (this.player) this.player.hp = this.player.maxHp;
    if (this.enemy) this.enemy.hp = this.enemy.maxHp;

    this.log = [];
    this.gameOver = false;
    this.playerWon = false;
    this.playerSelected = false;

    this.player.attacks.forEach((a) => (a.currentCooldown = 0));
    this.enemy.attacks.forEach((a) => (a.currentCooldown = 0));
  }
}

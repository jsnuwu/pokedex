import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../mainPage/back-button/back-button.component';

interface Pokemon {
  name: string;
  hp: number;
  maxHp: number;
  img: string;
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
  player: Pokemon = {
    name: 'Pikachu',
    hp: 100,
    maxHp: 100,
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  };

  enemy: Pokemon = {
    name: 'Charmander',
    hp: 100,
    maxHp: 100,
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
  };

  attacks: Attack[] = [
    { name: 'Tackle', damageMin: 5, damageMax: 12, type: 'damage', cooldown: 0 },
    { name: 'Thunderbolt', damageMin: 10, damageMax: 25, type: 'damage', cooldown: 2 },
    { name: 'Quick Attack', damageMin: 3, damageMax: 8, type: 'damage', cooldown: 0 },
    { name: 'Heal', damageMin: -15, damageMax: -8, type: 'heal', cooldown: 3 }
  ];

  log: string[] = [];
  gameOver = false;
  playerWon = false;
  playerShaking = false;
  enemyShaking = false;

  attack(attacker: Pokemon, defender: Pokemon, atk: Attack, isPlayer = true) {
    if (this.gameOver || (atk.currentCooldown && atk.currentCooldown > 0)) return;

    let damage = Math.floor(Math.random() * (atk.damageMax - atk.damageMin + 1)) + atk.damageMin;

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
      this.log.push(`${attacker.name} uses ${atk.name} and deals ${damage} damage!`);
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
        const enemyAtk = { ...this.attacks[Math.floor(Math.random() * this.attacks.length)] };
        this.attack(defender, attacker, enemyAtk, false);
      }, 700);
    }

    if (isPlayer) this.reduceCooldowns();
  }

  reduceCooldowns() {
    this.attacks.forEach(a => {
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
    this.player.hp = this.player.maxHp;
    this.enemy.hp = this.enemy.maxHp;
    this.log = [];
    this.gameOver = false;
    this.playerWon = false;
    this.attacks.forEach(a => a.currentCooldown = 0);
  }
}

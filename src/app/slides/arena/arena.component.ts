import { Component } from '@angular/core';
import { BackButtonComponent } from "../mainPage/back-button/back-button.component";

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css'],
  imports: [BackButtonComponent]
})
export class ArenaComponent {

  player = {
    name: 'Pikachu',
    hp: 100,
    maxHp: 100,
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
  };

  enemy = {
    name: 'Charmander',
    hp: 100,
    maxHp: 100,
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'
  };

  log: string[] = [];
  gameOver = false;
  playerWon = false;

  attack(attacker: any, defender: any, isPlayer: boolean = true) {
    if (this.gameOver) return;

    const damage = Math.floor(Math.random() * 20) + 5;
    defender.hp -= damage;
    if (defender.hp < 0) defender.hp = 0;
    this.log.push(`${attacker.name} greift ${defender.name} an und verursacht ${damage} Schaden!`);

    this.checkGameOver();

    if (isPlayer && !this.gameOver && defender.hp > 0) {
      setTimeout(() => {
        const enemyDamage = Math.floor(Math.random() * 20) + 5;
        attacker.hp -= enemyDamage;
        if (attacker.hp < 0) attacker.hp = 0;
        this.log.push(`${defender.name} greift ${attacker.name} zurück und verursacht ${enemyDamage} Schaden!`);
        this.checkGameOver();
      }, 500); 
    }
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
  }
}

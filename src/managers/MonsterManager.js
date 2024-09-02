import Phaser from 'phaser';

class Monster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, type) {
    super(scene, x, y, texture);
    this.type = type;
    this.health = this.getInitialHealth();
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  getInitialHealth() {
    switch (this.type) {
      case 'small': return 1;
      case 'medium': return 3;
      case 'large': return 5;
      case 'boss': return 20;
      default: return 1;
    }
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
      return true; // Indicates the monster was destroyed
    }
    return false; // Indicates the monster survived
  }
}

export class MonsterManager {
  constructor(scene) {
    this.scene = scene;
    this.monsters = scene.physics.add.group();
  }

  createMonster(x, y, type) {
    const texture = `monster_${type}`;
    const monster = new Monster(this.scene, x, y, texture, type);
    this.monsters.add(monster);
    return monster;
  }

  setupCollisions(player, bulletGroup) {
    this.scene.physics.add.overlap(player, this.monsters, this.playerMonsterCollision, null, this);
    this.scene.physics.add.overlap(bulletGroup, this.monsters, this.bulletMonsterCollision, null, this);
  }

  playerMonsterCollision(player, monster) {
    if (!this.scene.gameState.isImmune) {
      const killed = this.scene.gameState.hit(monster.type);
      if (!killed) {
        if (monster.type === 'small') {
          monster.destroy();
        } else {
          monster.takeDamage(1);
        }
      }
    }
  }

  bulletMonsterCollision(bullet, monster) {
    bullet.destroy();
    const monsterDestroyed = monster.takeDamage(1);
    if (monsterDestroyed) {
      this.scene.gameState.addScore(this.getMonsterScore(monster.type));
      if (Phaser.Math.Between(1, 100) <= 5) { // 5% chance to drop power-up
        this.scene.powerUpManager.spawnRandomPowerUp(monster.x, monster.y);
      }
    }
  }

  getMonsterScore(type) {
    switch (type) {
      case 'small': return 10;
      case 'medium': return 20;
      case 'large': return 30;
      case 'boss': return 100;
      default: return 0;
    }
  }
}
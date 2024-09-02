import Phaser from 'phaser';

export class PowerUpManager {
  constructor(scene) {
    this.scene = scene;
    this.powerUps = this.scene.physics.add.group();
  }

  createPowerUp(x, y, type) {
    const powerUp = this.powerUps.create(x, y, `powerup_${type}`);
    powerUp.type = type;
    powerUp.setCollideWorldBounds(true);
    powerUp.setBounce(1);
    powerUp.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));

    this.scene.time.delayedCall(10000, () => {
      powerUp.destroy();
    });
  }

  setupCollision(player) {
    this.scene.physics.add.overlap(player, this.powerUps, this.collectPowerUp, null, this);
  }

  collectPowerUp(player, powerUp) {
    powerUp.destroy();
    switch (powerUp.type) {
      case 'shield':
        this.scene.gameState.setShield(true);
        break;
      case 'speed':
        this.scene.gameState.increaseSpeed();
        break;
      case 'screenClear':
        this.clearScreen();
        break;
      case 'extraLife':
        this.scene.gameState.gainLife();
        break;
    }
  }

  clearScreen() {
    if (this.scene.monsterManager && this.scene.monsterManager.monsters) {
      this.scene.monsterManager.monsters.getChildren().forEach((monster) => {
        if (monster.type === 'small' || monster.type === 'medium') {
          monster.destroy();
        } else if (monster.type === 'large') {
          monster.takeDamage(monster.health);
        } else if (monster.type === 'boss') {
          monster.takeDamage(monster.health * 0.25); // 25% damage to bosses
        }
      });
    } else {
      console.warn('MonsterManager or monsters group not found. Unable to clear screen.');
    }
  }

  spawnRandomPowerUp() {
    const x = Phaser.Math.Between(0, this.scene.game.config.width);
    const y = Phaser.Math.Between(0, this.scene.game.config.height);
    const types = ['shield', 'speed', 'screenClear'];
    const type = Phaser.Math.RND.pick(types);
    this.createPowerUp(x, y, type);
  }

  spawnExtraLife() {
    const x = Phaser.Math.Between(0, this.scene.game.config.width);
    const y = Phaser.Math.Between(0, this.scene.game.config.height);
    this.createPowerUp(x, y, 'extraLife');
  }
}
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
    // Logic to clear all visible monsters
    // This would involve getting all monsters from your monster group(s) and applying damage or destroying them
    // For example:
    this.scene.monsters.getChildren().forEach((monster) => {
      if (monster.monsterType === 'small' || monster.monsterType === 'medium') {
        monster.destroy();
      } else if (monster.monsterType === 'large') {
        monster.takeDamage(monster.health); // Assuming takeDamage method exists
      } else if (monster.monsterType === 'boss') {
        monster.takeDamage(monster.health * 0.25); // 25% damage to bosses
      }
    });
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
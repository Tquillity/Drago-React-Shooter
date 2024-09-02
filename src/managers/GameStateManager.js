import Phaser from 'phaser';

export class GameStateManager {
  constructor(scene) {
    this.scene = scene;
    this.lives = 3;
    this.score = 0;
    this.hasShield = false;
    this.speedLevel = 1;
    this.livesText = null;
    this.scoreText = null;
    this.shieldText = null;
    this.speedText = null;
    this.isImmune = false;
    this.immunityTimer = null;
  }

  create() {
    this.livesText = this.scene.add.bitmapText(10, 10, 'shmupfont', `Lives: ${this.lives}`, 12);
    this.scoreText = this.scene.add.bitmapText(10, 30, 'shmupfont', `Score: ${this.score}`, 12);
    this.shieldText = this.scene.add.bitmapText(10, 50, 'shmupfont', `Shield: ${this.hasShield ? 'Active' : 'Inactive'}`, 12);
    this.speedText = this.scene.add.bitmapText(10, 70, 'shmupfont', `Speed: ${this.speedLevel}`, 12);
  }

  hit(monsterSize) {
    if (this.isImmune) {
      return false; // Player is immune, no damage taken
    }

    if (this.hasShield) {
      this.hasShield = false;
      this.updateShieldDisplay();
      return false; // Player wasn't killed
    } else {
      this.lives--;
      this.updateLivesDisplay();
      if (this.lives <= 0) {
        this.gameOver();
        return true; // Player was killed
      } else {
        this.respawn();
        return false; // Player wasn't killed but needs to respawn
      }
    }
  }

  gainLife() {
    if (this.lives < 3) {
      this.lives++;
      this.updateLivesDisplay();
    }
  }

  addScore(points) {
    this.score += points;
    this.updateScoreDisplay();
  }

  setShield(hasShield) {
    this.hasShield = hasShield;
    this.updateShieldDisplay();
  }

  increaseSpeed() {
    if (this.speedLevel < 10) {
      this.speedLevel++;
      this.updateSpeedDisplay();
    }
  }

  updateLivesDisplay() {
    this.livesText.setText(`Lives: ${this.lives}`);
  }

  updateScoreDisplay() {
    this.scoreText.setText(`Score: ${this.score}`);
  }

  updateShieldDisplay() {
    this.shieldText.setText(`Shield: ${this.hasShield ? 'Active' : 'Inactive'}`);
  }

  updateSpeedDisplay() {
    this.speedText.setText(`Speed: ${this.speedLevel}`);
  }

  gameOver() {
    this.scene.scene.pause();
    const gameOverText = this.scene.add.bitmapText(
      this.scene.game.config.width / 2,
      this.scene.game.config.height / 2,
      'shmupfont',
      'GAME OVER',
      64
    ).setOrigin(0.5);

    this.scene.time.delayedCall(3000, () => {
      gameOverText.destroy();
      this.scene.scene.restart();
    });
  }

  respawn() {
    this.scene.scene.pause();
    let countdown = 3;
    const countdownText = this.scene.add.bitmapText(
      this.scene.game.config.width / 2,
      this.scene.game.config.height / 2,
      'shmupfont',
      countdown.toString(),
      64
    ).setOrigin(0.5);

    const countdownInterval = this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        countdown--;
        if (countdown > 0) {
          countdownText.setText(countdown.toString());
        } else {
          countdownText.destroy();
          this.scene.scene.resume();
          this.setImmunity();
        }
      },
      repeat: 2
    });
  }

  setImmunity() {
    this.isImmune = true;
    this.scene.player.setAlpha(0.5);
    this.immunityTimer = this.scene.time.delayedCall(3000, () => {
      this.isImmune = false;
      this.scene.player.setAlpha(1);
    });
  }
}
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
    this.isGameOver = false;
    this.onGameOver = null; // Callback function to be set from App.jsx
  }

  create() {
    this.livesText = this.scene.add.bitmapText(10, 10, 'shmupfont', `Lives: ${this.lives}`, 12);
    this.scoreText = this.scene.add.bitmapText(10, 30, 'shmupfont', `Score: ${this.score}`, 12);
    this.shieldText = this.scene.add.bitmapText(10, 50, 'shmupfont', `Shield: ${this.hasShield ? 'ON' : 'OFF'}`, 12);
    this.speedText = this.scene.add.bitmapText(10, 70, 'shmupfont', `Speed: ${this.speedLevel}`, 12);
  }

  hit(monsterSize) {
    if (this.isImmune || this.isGameOver) {
      return false; // Player is immune or game is over
    }

    if (this.hasShield) {
      this.hasShield = false;
      this.updateShieldDisplay();
      return false; // Shield absorbed the hit
    } else {
      this.lives--;
      this.updateLivesDisplay();
      if (this.lives <= 0) {
        this.gameOver();
        return true; // Player was killed
      } else {
        this.respawn();
        return false; // Player was hit but not killed
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
    if (this.hasShield !== hasShield) {
      this.hasShield = hasShield;
      this.updateShieldDisplay();
    }
  }

  increaseSpeed() {
    if (this.speedLevel < 10) {
      this.speedLevel++;
      this.updateSpeedDisplay();
    }
  }

  updateLivesDisplay() {
    console.log('Updating lives display', this.lives);
    if (this.livesText) {
      this.livesText.setText(`Lives: ${this.lives}`);
    } else {
      console.error('Lives text object is not defined');
    }
  }
  
  updateScoreDisplay() {
    console.log('Updating score display', this.score);
    if (this.scoreText) {
      this.scoreText.setText(`Score: ${this.score}`);
    } else {
      console.error('Score text object is not defined');
    }
  }

  updateShieldDisplay() {
    if (this.shieldText) {
      this.shieldText.setText(`Shield: ${this.hasShield ? 'ON' : 'OFF'}`);
    }
  }

  updateSpeedDisplay() {
    if (this.speedText) {
      this.speedText.setText(`Speed: ${this.speedLevel}`);
    }
  }

  gameOver() {
    if (this.isGameOver) return;
    
    this.isGameOver = true;
    this.scene.player.setActive(false).setVisible(false);
    
    const gameOverText = this.scene.add.bitmapText(
      this.scene.game.config.width / 2,
      this.scene.game.config.height / 2,
      'shmupfont',
      'GAME OVER',
      64
    ).setOrigin(0.5);

    this.scene.time.delayedCall(2000, () => {
      gameOverText.destroy();
      if (this.onGameOver) {
        this.onGameOver(this.score);
      }
    });
  }

  respawn() {
    this.scene.player.setActive(false).setVisible(false);
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
          this.scene.player.setActive(true).setVisible(true);
          this.scene.player.x = 64;
          this.scene.player.y = 200;
          this.setImmunity();
        }
      },
      repeat: 2
    });
  }

  setImmunity() {
    this.isImmune = true;
    this.scene.player.setAlpha(0.5);
    if (this.immunityTimer) {
      this.immunityTimer.remove();
    }
    this.immunityTimer = this.scene.time.delayedCall(3000, () => {
      this.isImmune = false;
      this.scene.player.setAlpha(1);
    });
  }

  setGameOverCallback(callback) {
    this.onGameOver = callback;
  }
}
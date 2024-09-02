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
  }

  create() {
    this.livesText = this.scene.add.bitmapText(10, 10, 'shmupfont', `Lives: ${this.lives}`, 24);
    this.scoreText = this.scene.add.bitmapText(10, 40, 'shmupfont', `Score: ${this.score}`, 24);
    this.shieldText = this.scene.add.bitmapText(10, 70, 'shmupfont', `Shield: ${this.hasShield ? 'Active' : 'Inactive'}`, 24);
    this.speedText = this.scene.add.bitmapText(10, 100, 'shmupfont', `Speed: ${this.speedLevel}`, 24);
  }

  hit(monsterSize) {
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
      }
      return false; // Player wasn't killed
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
    // ! I can add game over logic here if I want
  }
}
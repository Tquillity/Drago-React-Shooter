// filename: bullets.js

export class Bullet extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.setTexture(texture);
    this.setPosition(x, y);
    this.speed = Phaser.Math.GetSpeed(400, 1);
  }

  fire(x, y, angle) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.setRotation(angle);
    
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);
  }

  update(time, delta) {
    this.x += this.dx * (this.speed * delta);
    this.y += this.dy * (this.speed * delta);

    if (this.x < -50 || this.x > this.scene.game.config.width + 50 ||
        this.y < -50 || this.y > this.scene.game.config.height + 50) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
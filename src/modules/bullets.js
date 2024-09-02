export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 1000;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        
        // Only set size if body exists
        if (this.body) {
        this.setSize(12, 12);
        }
    }

    fire(x, y, angle) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.direction = angle;
        this.xSpeed = this.speed * Math.cos(this.direction);
        this.ySpeed = this.speed * Math.sin(this.direction);
        this.born = 0;
    }

    update(time, delta) {
        this.x += this.xSpeed * delta / 1000;
        this.y += this.ySpeed * delta / 1000;
        this.born += delta;
        if (this.born > 1500) {
        this.setActive(false);
        this.setVisible(false);
        }
    }
  } 
// filename: weapons.js

import { Bullet } from './bullets.js';

export const Weapon = {};

class BaseWeapon {
  constructor(scene, name) {
    this.scene = scene;
    this.name = name;
    this.bullets = scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true
    });
    this.nextFire = 0;
  }

  fire(source) {
    // Override in subclasses
  }
}

Weapon.SingleBullet = class extends BaseWeapon {
  constructor(scene) {
    super(scene, 'Single Bullet');
    this.bulletSpeed = 600;
    this.fireRate = 100;
  }

  fire(source) {
    if (this.scene.time.now > this.nextFire) {
      const bullet = this.bullets.get(source.x, source.y, 'bullet5');
      if (bullet) {
        bullet.fire(source.x + 10, source.y + 10, 0);
        this.nextFire = this.scene.time.now + this.fireRate;
      }
    }
  }
};

Weapon.FrontAndBack = class extends BaseWeapon {
  constructor(scene) {
    super(scene, 'Front And Back');
    this.bulletSpeed = 600;
    this.fireRate = 100;
  }

  fire(source) {
    if (this.scene.time.now > this.nextFire) {
      let bullet = this.bullets.get(source.x, source.y, 'bullet5');
      if (bullet) {
        bullet.fire(source.x + 10, source.y + 10, 0);
      }
      bullet = this.bullets.get(source.x, source.y, 'bullet5');
      if (bullet) {
        bullet.fire(source.x + 10, source.y + 10, Math.PI);
      }
      this.nextFire = this.scene.time.now + this.fireRate;
    }
  }
};

Weapon.ThreeWay = class extends BaseWeapon {
  constructor(scene) {
    super(scene, 'Three Way');
    this.bulletSpeed = 600;
    this.fireRate = 100;
  }

  fire(source) {
    if (this.scene.time.now > this.nextFire) {
      for (let angle of [-Math.PI/2, 0, Math.PI/2]) {
        const bullet = this.bullets.get(source.x, source.y, 'bullet7');
        if (bullet) {
          bullet.fire(source.x + 10, source.y + 10, angle);
        }
      }
      this.nextFire = this.scene.time.now + this.fireRate;
    }
  }
};

Weapon.EightWay = class extends BaseWeapon {
  constructor(scene) {
    super(scene, 'Eight Way');
    this.bulletSpeed = 600;
    this.fireRate = 100;
  }

  fire(source) {
    if (this.scene.time.now > this.nextFire) {
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const bullet = this.bullets.get(source.x, source.y, 'bullet5');
        if (bullet) {
          bullet.fire(source.x + 16, source.y + 10, angle);
        }
      }
      this.nextFire = this.scene.time.now + this.fireRate;
    }
  }
};

Weapon.ScatterShot = class extends BaseWeapon {
  constructor(scene) {
    super(scene, 'Scatter Shot');
    this.bulletSpeed = 600;
    this.fireRate = 40;
  }

  fire(source) {
    if (this.scene.time.now > this.nextFire) {
      const y = source.y + source.height / 2 + Phaser.Math.Between(-10, 10);
      const bullet = this.bullets.get(source.x, source.y, 'bullet5');
      if (bullet) {
        bullet.fire(source.x + 16, y, 0);
      }
      this.nextFire = this.scene.time.now + this.fireRate;
    }
  }
};

Weapon.Beam = class extends BaseWeapon {
  constructor(scene) {
    super(scene, 'Beam');
    this.bulletSpeed = 1000;
    this.fireRate = 45;
  }

  fire(source) {
    if (this.scene.time.now > this.nextFire) {
      const bullet = this.bullets.get(source.x, source.y, 'bullet11');
      if (bullet) {
        bullet.fire(source.x + 40, source.y + 10, 0);
      }
      this.nextFire = this.scene.time.now + this.fireRate;
    }
  }
};

Weapon.SplitShot = class extends BaseWeapon {
  constructor(scene) {
    super(scene, 'Split Shot');
    this.bulletSpeed = 700;
    this.fireRate = 40;
  }

  fire(source) {
    if (this.scene.time.now > this.nextFire) {
      for (let gy of [-500, 0, 500]) {
        const bullet = this.bullets.get(source.x, source.y, 'bullet8');
        if (bullet) {
          bullet.fire(source.x + 20, source.y + 10, 0);
          bullet.setGravityY(gy);
        }
      }
      this.nextFire = this.scene.time.now + this.fireRate;
    }
  }
};

Weapon.Pattern = class extends BaseWeapon {
  constructor(scene) {
    super(scene, 'Pattern');
    this.bulletSpeed = 600;
    this.fireRate = 40;
    this.pattern = [-800, -600, -400, -200, 0, 200, 400, 600, 800, 600, 400, 200, 0, -200, -400, -600];
    this.patternIndex = 0;
  }

  fire(source) {
    if (this.scene.time.now > this.nextFire) {
      const bullet = this.bullets.get(source.x, source.y, 'bullet4');
      if (bullet) {
        bullet.fire(source.x + 20, source.y + 10, 0);
        bullet.setGravityY(this.pattern[this.patternIndex]);
      }
      this.patternIndex = (this.patternIndex + 1) % this.pattern.length;
      this.nextFire = this.scene.time.now + this.fireRate;
    }
  }
};

Weapon.Rockets = class extends BaseWeapon {
  constructor(scene) {
    super(scene, 'Rockets');
    this.bulletSpeed = 400;
    this.fireRate = 250;
  }

  fire(source) {
    if (this.scene.time.now > this.nextFire) {
      for (let gy of [-700, 700]) {
        const bullet = this.bullets.get(source.x, source.y, 'bullet10');
        if (bullet) {
          bullet.fire(source.x + 10, source.y + 10, 0);
          bullet.setGravityY(gy);
        }
      }
      this.nextFire = this.scene.time.now + this.fireRate;
    }
  }
};

Weapon.ScaleBullet = class extends BaseWeapon {
  constructor(scene) {
    super(scene, 'Scale Bullet');
    this.bulletSpeed = 800;
    this.fireRate = 100;
  }

  fire(source) {
    if (this.scene.time.now > this.nextFire) {
      const bullet = this.bullets.get(source.x, source.y, 'bullet9');
      if (bullet) {
        bullet.fire(source.x + 10, source.y + 10, 0);
        bullet.setScale(0.1);
        this.scene.tweens.add({
          targets: bullet,
          scale: 2,
          duration: 1000,
          ease: 'Linear'
        });
      }
      this.nextFire = this.scene.time.now + this.fireRate;
    }
  }
};

Weapon.Combo1 = class extends BaseWeapon {
  constructor(scene) {
    super(scene, 'Combo One');
    this.weapon1 = new Weapon.SingleBullet(scene);
    this.weapon2 = new Weapon.Rockets(scene);
  }

  fire(source) {
    this.weapon1.fire(source);
    this.weapon2.fire(source);
  }
};

Weapon.Combo2 = class extends BaseWeapon {
  constructor(scene) {
    super(scene, 'Combo Two');
    this.weapon1 = new Weapon.Pattern(scene);
    this.weapon2 = new Weapon.ThreeWay(scene);
    this.weapon3 = new Weapon.Rockets(scene);
  }

  fire(source) {
    this.weapon1.fire(source);
    this.weapon2.fire(source);
    this.weapon3.fire(source);
  }
};
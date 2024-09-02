// filename: weapons.js

import { Bullet } from './bullets.js';

export var Weapon = {};

// Single Bullet
Weapon.SingleBullet = function (game) {
    Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, 'bullet5'), true);
    }

    return this;
};

Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;

Weapon.SingleBullet.prototype.fire = function (source) {
    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.nextFire = this.game.time.time + this.fireRate;
};

// Front And Back
Weapon.FrontAndBack = function (game) {
    Phaser.Group.call(this, game, game.world, 'Front And Back', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, 'bullet5'), true);
    }

    return this;
};

Weapon.FrontAndBack.prototype = Object.create(Phaser.Group.prototype);
Weapon.FrontAndBack.prototype.constructor = Weapon.FrontAndBack;

Weapon.FrontAndBack.prototype.fire = function (source) {
    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);
    this.nextFire = this.game.time.time + this.fireRate;
};

// Three Way
Weapon.ThreeWay = function (game) {
    Phaser.Group.call(this, game, game.world, 'Three Way', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 96; i++) {
        this.add(new Bullet(game, 'bullet7'), true);
    }

    return this;
};

Weapon.ThreeWay.prototype = Object.create(Phaser.Group.prototype);
Weapon.ThreeWay.prototype.constructor = Weapon.ThreeWay;

Weapon.ThreeWay.prototype.fire = function (source) {
    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0);
    this.nextFire = this.game.time.time + this.fireRate;
};

// Eight Way
Weapon.EightWay = function (game) {
    Phaser.Group.call(this, game, game.world, 'Eight Way', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 96; i++) {
        this.add(new Bullet(game, 'bullet5'), true);
    }

    return this;
};

Weapon.EightWay.prototype = Object.create(Phaser.Group.prototype);
Weapon.EightWay.prototype.constructor = Weapon.EightWay;

Weapon.EightWay.prototype.fire = function (source) {
    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 16;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 45, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 135, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 225, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 315, this.bulletSpeed, 0, 0);
    this.nextFire = this.game.time.time + this.fireRate;
};

// Scatter Shot
Weapon.ScatterShot = function (game) {
    Phaser.Group.call(this, game, game.world, 'Scatter Shot', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 40;

    for (var i = 0; i < 32; i++) {
        this.add(new Bullet(game, 'bullet5'), true);
    }

    return this;
};

Weapon.ScatterShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScatterShot.prototype.constructor = Weapon.ScatterShot;

Weapon.ScatterShot.prototype.fire = function (source) {
    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 16;
    var y = (source.y + source.height / 2) + this.game.rnd.between(-10, 10);

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.nextFire = this.game.time.time + this.fireRate;
};

// Beam
Weapon.Beam = function (game) {
    Phaser.Group.call(this, game, game.world, 'Beam', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 1000;
    this.fireRate = 45;

    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, 'bullet11'), true);
    }

    return this;
};

Weapon.Beam.prototype = Object.create(Phaser.Group.prototype);
Weapon.Beam.prototype.constructor = Weapon.Beam;

Weapon.Beam.prototype.fire = function (source) {
    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 40;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.nextFire = this.game.time.time + this.fireRate;
};

// Split Shot
Weapon.SplitShot = function (game) {
    Phaser.Group.call(this, game, game.world, 'Split Shot', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 700;
    this.fireRate = 40;

    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, 'bullet8'), true);
    }

    return this;
};

Weapon.SplitShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.SplitShot.prototype.constructor = Weapon.SplitShot;

Weapon.SplitShot.prototype.fire = function (source) {
    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 20;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -500);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 500);
    this.nextFire = this.game.time.time + this.fireRate;
};

// Pattern
Weapon.Pattern = function (game) {
    Phaser.Group.call(this, game, game.world, 'Pattern', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 40;

    this.pattern = Phaser.ArrayUtils.numberArrayStep(-800, 800, 200);
    this.pattern = this.pattern.concat(Phaser.ArrayUtils.numberArrayStep(800, -800, -200));

    this.patternIndex = 0;

    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, 'bullet4'), true);
    }

    return this;
};

Weapon.Pattern.prototype = Object.create(Phaser.Group.prototype);
Weapon.Pattern.prototype.constructor = Weapon.Pattern;

Weapon.Pattern.prototype.fire = function (source) {
  if (this.game.time.time < this.nextFire) { return; }

  var x = source.x + 20;
  var y = source.y + 10;

  this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, this.pattern[this.patternIndex]);

  this.patternIndex++;

  if (this.patternIndex === this.pattern.length) {
      this.patternIndex = 0;
  }

  this.nextFire = this.game.time.time + this.fireRate;
};

// Rockets
Weapon.Rockets = function (game) {
  Phaser.Group.call(this, game, game.world, 'Rockets', false, true, Phaser.Physics.ARCADE);

  this.nextFire = 0;
  this.bulletSpeed = 400;
  this.fireRate = 250;

  for (var i = 0; i < 32; i++) {
      this.add(new Bullet(game, 'bullet10'), true);
  }

  this.setAll('tracking', true);

  return this;
};

Weapon.Rockets.prototype = Object.create(Phaser.Group.prototype);
Weapon.Rockets.prototype.constructor = Weapon.Rockets;

Weapon.Rockets.prototype.fire = function (source) {
  if (this.game.time.time < this.nextFire) { return; }

  var x = source.x + 10;
  var y = source.y + 10;

  this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -700);
  this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 700);

  this.nextFire = this.game.time.time + this.fireRate;
};

// Scale Bullet
Weapon.ScaleBullet = function (game) {
  Phaser.Group.call(this, game, game.world, 'Scale Bullet', false, true, Phaser.Physics.ARCADE);

  this.nextFire = 0;
  this.bulletSpeed = 800;
  this.fireRate = 100;

  for (var i = 0; i < 32; i++) {
      this.add(new Bullet(game, 'bullet9'), true);
  }

  this.setAll('scaleSpeed', 0.05);

  return this;
};

Weapon.ScaleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScaleBullet.prototype.constructor = Weapon.ScaleBullet;

Weapon.ScaleBullet.prototype.fire = function (source) {
  if (this.game.time.time < this.nextFire) { return; }

  var x = source.x + 10;
  var y = source.y + 10;

  this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
  this.nextFire = this.game.time.time + this.fireRate;
};

// Combo1
Weapon.Combo1 = function (game) {
  this.name = "Combo One";
  this.weapon1 = new Weapon.SingleBullet(game);
  this.weapon2 = new Weapon.Rockets(game);
};

Weapon.Combo1.prototype.reset = function () {
  this.weapon1.visible = false;
  this.weapon1.callAll('reset', null, 0, 0);
  this.weapon1.setAll('exists', false);

  this.weapon2.visible = false;
  this.weapon2.callAll('reset', null, 0, 0);
  this.weapon2.setAll('exists', false);
};

Weapon.Combo1.prototype.fire = function (source) {
  this.weapon1.fire(source);
  this.weapon2.fire(source);
};

// Combo2
Weapon.Combo2 = function (game) {
  this.name = "Combo Two";
  this.weapon1 = new Weapon.Pattern(game);
  this.weapon2 = new Weapon.ThreeWay(game);
  this.weapon3 = new Weapon.Rockets(game);
};

Weapon.Combo2.prototype.reset = function () {
  this.weapon1.visible = false;
  this.weapon1.callAll('reset', null, 0, 0);
  this.weapon1.setAll('exists', false);

  this.weapon2.visible = false;
  this.weapon2.callAll('reset', null, 0, 0);
  this.weapon2.setAll('exists', false);

  this.weapon3.visible = false;
  this.weapon3.callAll('reset', null, 0, 0);
  this.weapon3.setAll('exists', false);
};

Weapon.Combo2.prototype.fire = function (source) {
  this.weapon1.fire(source);
  this.weapon2.fire(source);
  this.weapon3.fire(source);
};

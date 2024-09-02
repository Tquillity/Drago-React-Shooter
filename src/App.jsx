import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { Weapon } from './modules/weapons';
import { Bullet } from './modules/bullets';

const App = () => {
  const gameRef = useRef(null);
  const game = useRef(null);

  useEffect(() => {
    if (gameRef.current && !game.current) {
      const config = {
        type: Phaser.AUTO,
        width: 640,
        height: 400,
        parent: gameRef.current,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 }
          }
        },
        scene: {
          preload: preload,
          create: create,
          update: update
        }
      };

      game.current = new Phaser.Game(config);
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        game.current = null;
      }
    };
  }, []);

  const preload = function() {
    this.load.crossOrigin = 'anonymous';
    this.load.image('background', 'assets/back.png');
    this.load.image('foreground', 'assets/fore.png');
    this.load.image('player', 'assets/ship.png');
    this.load.bitmapFont('shmupfont', 'assets/shmupfont.png', 'assets/shmupfont.xml');

    for (let i = 1; i <= 11; i++) {
      this.load.image('bullet' + i, 'assets/bullet' + i + '.png');
    }

    this.load.audio('backgroundMusic', 'assets/sounds/track1.mp3');
  };

  const create = function() {
    this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
    this.background.setOrigin(0, 0);
    this.background.setScrollFactor(0);

    this.weapons = [];
    this.weapons.push(new Weapon.SingleBullet(this));
    this.weapons.push(new Weapon.FrontAndBack(this));
    this.weapons.push(new Weapon.ThreeWay(this));
    this.weapons.push(new Weapon.EightWay(this));
    this.weapons.push(new Weapon.ScatterShot(this));
    this.weapons.push(new Weapon.Beam(this));
    this.weapons.push(new Weapon.SplitShot(this));
    this.weapons.push(new Weapon.Pattern(this));
    this.weapons.push(new Weapon.Rockets(this));
    this.weapons.push(new Weapon.ScaleBullet(this));
    this.weapons.push(new Weapon.Combo1(this));
    this.weapons.push(new Weapon.Combo2(this));

    this.currentWeapon = 0;

    for (let i = 1; i < this.weapons.length; i++) {
      this.weapons[i].visible = false;
    }

    this.player = this.physics.add.sprite(64, 200, 'player');
    this.player.setCollideWorldBounds(true);

    this.foreground = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'foreground');
    this.foreground.setOrigin(0, 0);
    this.foreground.setScrollFactor(0);

    this.weaponName = this.add.bitmapText(8, 364, 'shmupfont', "ENTER = Next Weapon", 24);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addCapture([Phaser.Input.Keyboard.KeyCodes.SPACE]);

    const changeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    changeKey.on('down', this.nextWeapon, this);

    this.music = this.sound.add('backgroundMusic', { loop: true });
  };

  const update = function() {
    this.background.tilePositionX += 0.5;
    this.foreground.tilePositionX += 1;

    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-300);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(300);
    }

    if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE))) {
      this.weapons[this.currentWeapon].fire(this.player);
    }
  };

  const nextWeapon = function() {
    if (this.currentWeapon > 9) {
      this.weapons[this.currentWeapon].reset();
    } else {
      this.weapons[this.currentWeapon].visible = false;
      this.weapons[this.currentWeapon].callAll('reset', null, 0, 0);
      this.weapons[this.currentWeapon].setAll('exists', false);
    }

    this.currentWeapon++;

    if (this.currentWeapon === this.weapons.length) {
      this.currentWeapon = 0;
    }

    this.weapons[this.currentWeapon].visible = true;
    this.weaponName.text = this.weapons[this.currentWeapon].name;
  };

  const toggleMusic = (event) => {
    if (game.current) {
      const scene = game.current.scene.scenes[0];
      if (event.target.checked) {
        scene.music.play();
      } else {
        scene.music.stop();
      }
    }
  };

  return (
    <div>
      <h1>Phaser Game in React</h1>
      <div ref={gameRef} id="game"></div>
      <div id="musicToggle">
        <input type="checkbox" onChange={toggleMusic} />
        <span className="slider round">Music On/Off</span>
      </div>
    </div>
  );
};

export default App;
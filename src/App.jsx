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
            gravity: { y: 0 },
            debug: false
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
    this.load.setBaseURL('/src/assets/');
    this.load.image('background', 'back.png');
    this.load.image('foreground', 'fore.png');
    this.load.image('player', 'ship.png');
    this.load.bitmapFont('shmupfont', 'shmupfont.png', 'shmupfont.xml');

    for (let i = 1; i <= 11; i++) {
      this.load.image(`bullet${i}`, `bullet${i}.png`);
    }

    this.load.audio('backgroundMusic', 'sounds/track1.mp3');
  };

  const create = function() {
    this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
    this.background.setOrigin(0, 0);
    this.background.setScrollFactor(0);

    this.weapons = [
      new Weapon.SingleBullet(this),
      new Weapon.FrontAndBack(this),
      new Weapon.ThreeWay(this),
      new Weapon.EightWay(this),
      new Weapon.ScatterShot(this),
      new Weapon.Beam(this),
      new Weapon.SplitShot(this),
      new Weapon.Pattern(this),
      new Weapon.Rockets(this),
      new Weapon.ScaleBullet(this),
      new Weapon.Combo1(this),
      new Weapon.Combo2(this)
    ];

    this.currentWeapon = 0;

    this.player = this.physics.add.sprite(64, 200, 'player');
    this.player.setCollideWorldBounds(true);

    this.foreground = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'foreground');
    this.foreground.setOrigin(0, 0);
    this.foreground.setScrollFactor(0);

    this.weaponName = this.add.bitmapText(8, 364, 'shmupfont', "ENTER = Next Weapon", 24);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    const changeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    changeKey.on('down', () => this.nextWeapon());

    this.sound.pauseOnBlur = false;
    this.music = this.sound.add('backgroundMusic', { loop: true });

    // Start audio on first input
    this.input.once('pointerdown', () => {
      if (this.sound.context.state === 'suspended') {
        this.sound.context.resume();
      }
      if (!this.music.isPlaying) {
        this.music.play();
      }
    });

    // Initialize music toggle
    this.musicPlaying = false;
    this.toggleMusicCheckbox = document.getElementById('toggleMusic');
    if (this.toggleMusicCheckbox) {
      this.toggleMusicCheckbox.addEventListener('change', (event) => {
        if (event.target.checked) {
          if (this.sound.context.state === 'suspended') {
            this.sound.context.resume();
          }
          if (!this.music.isPlaying) {
            this.music.play();
          }
          this.musicPlaying = true;
        } else {
          this.music.stop();
          this.musicPlaying = false;
        }
      });
    }

    this.nextWeapon = function() {
      this.currentWeapon = (this.currentWeapon + 1) % this.weapons.length;
      this.weaponName.setText(this.weapons[this.currentWeapon].name);
    };
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

    if (this.spaceKey.isDown) {
      this.weapons[this.currentWeapon].fire(this.player);
    }

    // Update weapon name display
    this.weaponName.setText(this.weapons[this.currentWeapon].name);
  };

  return (
    <div>
      <h1>Phaser Game in React</h1>
      <div ref={gameRef} id="game"></div>
      <div id="musicToggle">
        <input type="checkbox" id="toggleMusic" />
        <span className="slider round">Music On/Off</span>
      </div>
    </div>
  );
};

export default App;
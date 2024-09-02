// filename: game.js

import { Weapon } from './weapons.js';

var game = new Phaser.Game(640, 400, Phaser.AUTO, 'game');

var PhaserGame = function () {
    this.background = null;
    this.foreground = null;
    this.player = null;
    this.cursors = null;
    this.speed = 300;
    this.weapons = [];
    this.currentWeapon = 0;
    this.weaponName = null;
};

PhaserGame.prototype = {
    init: function () {
        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function () {
      this.load.crossOrigin = 'anonymous';
      this.load.image('background', 'assets/back.png');
      this.load.image('foreground', 'assets/fore.png');
      this.load.image('player', 'assets/ship.png');
      this.load.bitmapFont('shmupfont', 'assets/shmupfont.png', 'assets/shmupfont.xml');

      for (var i = 1; i <= 11; i++) {
          this.load.image('bullet' + i, 'assets/bullet' + i + '.png');
      }

      //Load audio file
      this.load.audio('backgroundMusic', 'assets/sounds/track1.mp3');
    },

    create: function () {
      this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
      this.background.autoScroll(-40, 0);

      this.weapons.push(new Weapon.SingleBullet(this.game));
      this.weapons.push(new Weapon.FrontAndBack(this.game));
      this.weapons.push(new Weapon.ThreeWay(this.game));
      this.weapons.push(new Weapon.EightWay(this.game));
      this.weapons.push(new Weapon.ScatterShot(this.game));
      this.weapons.push(new Weapon.Beam(this.game));
      this.weapons.push(new Weapon.SplitShot(this.game));
      this.weapons.push(new Weapon.Pattern(this.game));
      this.weapons.push(new Weapon.Rockets(this.game));
      this.weapons.push(new Weapon.ScaleBullet(this.game));
      this.weapons.push(new Weapon.Combo1(this.game));
      this.weapons.push(new Weapon.Combo2(this.game));

      this.currentWeapon = 0;

      for (var i = 1; i < this.weapons.length; i++) {
          this.weapons[i].visible = false;
      }

      this.player = this.add.sprite(64, 200, 'player');
      this.physics.arcade.enable(this.player);
      this.player.body.collideWorldBounds = true;

      this.foreground = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'foreground');
      this.foreground.autoScroll(-60, 0);

      this.weaponName = this.add.bitmapText(8, 364, 'shmupfont', "ENTER = Next Weapon", 24);
      this.cursors = this.input.keyboard.createCursorKeys();
      this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

      var changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
      changeKey.onDown.add(this.nextWeapon, this);

      // Play the soundtrack
      this.music = this.add.audio('backgroundMusic');
      this.music.loop = true; // Loop the music

      // Add an event listener for user interaction to resume audio context
      const resumeAudioContext = () => {
        if (this.sound.context.state === 'suspended') {
          this.sound.context.resume();
        }
        this.music.play(); // Play the music
        // Remove the event listener after the user has interacted with the game
        this.game.input.onDown.remove(resumeAudioContext, this);
      };
      
      this.game.input.onDown.add(resumeAudioContext, this);

      // Add event listener for the music toggle checkbox
      document.addEventListener('DOMContentLoaded', () => {
        const toggleMusicCheckbox = document.getElementById('toggleMusic');
        if (toggleMusicCheckbox) {
          toggleMusicCheckbox.addEventListener('change', (event) => {
            if (event.target.checked) {
              if (!this.music.isPlaying) {
                this.music.play();
              }
              this.musicPlaying = true;
            } else {
              if (this.music.isPlaying) {
                this.music.stop();
              }
              this.musicPlaying = false;
            }
          });
        }
      });
    },

    nextWeapon: function () {
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
    },

    update: function () {
        this.player.body.velocity.set(0);

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -this.speed;
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = this.speed;
        }

        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -this.speed;
        } else if (this.cursors.down.isDown) {
            this.player.body.velocity.y = this.speed;
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.weapons[this.currentWeapon].fire(this.player);
        }
    }
};

game.state.add('Game', PhaserGame, true);
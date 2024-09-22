import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { Weapon } from '../modules/weapons';
import { GameStateManager } from '../managers/GameStateManager';
import { MonsterManager } from '../managers/MonsterManager';
import { WaveManager } from '../managers/WaveManager';
import { DropManager } from '../managers/DropManager';

// Main game component
const GameScreen = ({ onGameOver, gameMode }) => {
  // Refs to hold the game container and Phaser game instance
  const gameRef = useRef(null);
  const game = useRef(null);

  useEffect(() => {
    // Phaser game configuration
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

    // Initialize Phaser game
    game.current = new Phaser.Game(config);

    // Preload game assets
    function preload() {
      this.load.setBaseURL('/src/assets/');
      // Load images and fonts
      this.load.image('background', 'back.png');
      this.load.image('foreground', 'fore.png');
      this.load.image('player', 'ship.png');
      this.load.bitmapFont('shmupfont', 'shmupfont.png', 'shmupfont.xml');

      // Load bullet images
      for (let i = 1; i <= 11; i++) {
        this.load.image(`bullet${i}`, `bullet${i}.png`);
      }

      // Load power-up images
      this.load.image('powerup_shield', 'powerup_shield.png');
      this.load.image('powerup_speed', 'powerup_speed.png');
      this.load.image('powerup_extraLife', 'powerup_extraLife.png');

      // Load weapon upgrade images
      const weaponTypes = [
        'Single Bullet', 'Front And Back', 'Three Way', 'Eight Way',
        'Scatter Shot', 'Beam', 'Split Shot', 'Pattern', 'Rockets', 'Scale Bullet',
        'Combo One', 'Combo Two'
      ];
      weaponTypes.forEach(weaponType => {
        const fileName = `powerup_${weaponType.replace(/ /g, '_')}.png`;
        this.load.image(`powerup_${weaponType}`, fileName);
      });

      // Load monster images
      this.load.image('monster_small', 'monster_small.png');
      this.load.image('monster_medium', 'monster_medium.png');
      this.load.image('monster_large', 'monster_large.png');
      this.load.image('monster_boss', 'monster_boss.png');

      // Load background music
      this.load.audio('backgroundMusic', 'sounds/track1.mp3');
    }

    // Set up game objects and systems
    function create() {
      console.log('New game started. Game mode:', gameMode);
      
      // Set up scrolling background
      this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
      this.background.setOrigin(0, 0);
      this.background.setScrollFactor(0);
    
      // Initialize weapons
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
    
      // Set up player
      this.player = this.physics.add.sprite(64, 200, 'player');
      this.player.setCollideWorldBounds(true);
    
      // Set up foreground
      this.foreground = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'foreground');
      this.foreground.setOrigin(0, 0);
      this.foreground.setScrollFactor(0);
    
      // Add weapon name text
      this.weaponName = this.add.bitmapText(8, 364, 'shmupfont', "ENTER = Next Weapon", 24);
    
      // Set up input
      this.cursors = this.input.keyboard.createCursorKeys();
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      
      const changeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      changeKey.on('down', () => this.nextWeapon());
    
      // Set up music
      this.sound.pauseOnBlur = false;
      this.music = this.sound.add('backgroundMusic', { loop: true });
    
      // Initialize game systems
      this.gameState = new GameStateManager(this);
      this.gameState.create();
    
      this.dropManager = new DropManager(this);
      this.dropManager.setupCollision(this.player);
    
      this.monsterManager = new MonsterManager(this);
      this.waveManager = new WaveManager(this, this.monsterManager);
    
      this.monsterManager.setupCollisions(this.player, this.weapons);
    
      this.waveManager.startWaves();
    
      // Start music on first input
      this.input.once('pointerdown', () => {
        if (this.sound.context.state === 'suspended') {
          this.sound.context.resume();
        }
        if (!this.music.isPlaying) {
          this.music.play();
        }
      });
    
      // Set up music toggle
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
    
      // Function to change weapon
      this.nextWeapon = function() {
        this.currentWeapon = (this.currentWeapon + 1) % this.weapons.length;
        this.weaponName.setText(this.weapons[this.currentWeapon].name);
      };
    
      // Set up game over event
      this.events.on('gameover', (score) => {
        console.log('Game Over triggered. Score:', score);
        onGameOver(score);
      });
    }

    // Game update loop
    function update() {
      // Scroll background
      this.background.tilePositionX += 0.5;
      this.foreground.tilePositionX += 1;
    
      // Reset player velocity
      this.player.setVelocity(0);
    
      // Calculate player speed based on speed level
      const speed = 300 * this.gameState.speedLevel / 5;
    
      // Handle player movement
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-speed);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(speed);
      }
    
      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-speed);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(speed);
      }
    
      // Handle weapon firing
      if (this.spaceKey.isDown && !this.gameState.isRespawning) {
        this.weapons[this.currentWeapon].fire(this.player);
      }
    
      // Remove off-screen monsters
      this.monsterManager.monsters.getChildren().forEach((monster) => {
        if (monster.x < -monster.width) {
          monster.destroy();
        }
      });
    
      // Update weapon name display
      this.weaponName.setText(this.weapons[this.currentWeapon].name);
    }

    // Cleanup function
    return () => {
      if (game.current) {
        game.current.destroy(true);
        game.current = null;
      }
    };
  }, [onGameOver, gameMode]);

  // Render game container
  return (
    <div className="game-screen">
      <h1>Space Shooter</h1>
      <div className="game-container">
        <div ref={gameRef} id="game"></div>
      </div>
      <div id="musicToggle">
        <input type="checkbox" id="toggleMusic" />
        <span className="slider round">Music On/Off</span>
      </div>
    </div>
  );
};

export default GameScreen;
import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';
import { Weapon } from './modules/weapons';
import { GameStateManager } from './managers/GameStateManager';
import { PowerUpManager } from './managers/PowerUpManager';
import { MonsterManager } from './managers/MonsterManager';
import { WaveManager } from './managers/WaveManager';

const StartScreen = ({ onStartFreeGame, onStartPaidGame }) => {
  return (
    <div className="start-screen">
      <h1>Welcome to Space Shooter</h1>
      <img src="/src/assets/startScreen.jpg" alt="Game Start" />
      <div className="button-container">
        <button onClick={onStartFreeGame}>Free Training Game</button>
        <button onClick={onStartPaidGame}>Paid Competitive Game</button>
      </div>
    </div>
  );
};

const GameOverScreen = ({ lastScore, onStartFreeGame, onStartPaidGame }) => {
  return (
    <div className="game-over-screen">
      <h1>Game Over</h1>
      <h2>Your Score: {lastScore}</h2>
      <img src="/src/assets/GameOverScreen.jpg" alt="Game Over" />
      <div className="button-container">
        <button onClick={onStartFreeGame}>Free Training Game</button>
        <button onClick={onStartPaidGame}>Paid Competitive Game</button>
      </div>
    </div>
  );
};

const App = () => {
  const gameRef = useRef(null);
  const game = useRef(null);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', or 'gameOver'
  const [gameMode, setGameMode] = useState(null);
  const [lastScore, setLastScore] = useState(null);

  useEffect(() => {
    if (gameRef.current && !game.current && gameState === 'playing') {
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
  }, [gameState]);

  const startFreeGame = () => {
    setGameMode('free');
    setGameState('playing');
  };

  const startPaidGame = () => {
    setGameMode('paid');
    setGameState('playing');
  };

  const handleGameOver = (score) => {
    setLastScore(score);
    setGameState('gameOver');
  };

  const preload = function() {
    this.load.setBaseURL('/src/assets/');
    this.load.image('background', 'back.png');
    this.load.image('foreground', 'fore.png');
    this.load.image('player', 'ship.png');
    this.load.bitmapFont('shmupfont', 'shmupfont.png', 'shmupfont.xml');

    for (let i = 1; i <= 11; i++) {
      this.load.image(`bullet${i}`, `bullet${i}.png`);
    }

    // Load power-up sprites
    this.load.image('powerup_shield', 'powerup_shield.png');
    this.load.image('powerup_speed', 'powerup_speed.png');
    this.load.image('powerup_screenClear', 'powerup_screenClear.png');
    this.load.image('powerup_extraLife', 'powerup_extraLife.png');

    // Load monster sprites
    this.load.image('monster_small', 'monster_small.png');
    this.load.image('monster_medium', 'monster_medium.png');
    this.load.image('monster_large', 'monster_large.png');
    this.load.image('monster_boss', 'monster_boss.png');

    this.load.audio('backgroundMusic', 'sounds/track1.mp3');

    this.load.start();

    this.load.on('complete', () => {
      console.log('All assets loaded');
    });
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

   // Initialize GameStateManager
    this.gameState = new GameStateManager(this);
    this.gameState.create();
    this.gameState.setGameOverCallback(handleGameOver);
    this.gameState.scene.player = this.player;

    // Initialize PowerUpManager
    this.powerUpManager = new PowerUpManager(this);
    this.powerUpManager.setupCollision(this.player);

    // Initialize Monster and Wave Managers
    this.monsterManager = new MonsterManager(this);
    this.waveManager = new WaveManager(this, this.monsterManager);

    // Setup collisions
    this.monsterManager.setupCollisions(this.player, this.weapons[this.currentWeapon].bullets);

    // Start the wave system
    this.waveManager.startWaves();

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

    // Set up timer for spawning power-ups
    this.time.addEvent({
      delay: 10000, // 10 seconds
      callback: () => this.powerUpManager.spawnRandomPowerUp(),
      loop: true
    });

    // Set up timer for potentially spawning extra life (once per minute)
    this.time.addEvent({
      delay: 60000, // 1 minute
      callback: () => {
        if (Phaser.Math.Between(1, 100) <= 20) { // 20% chance
          this.powerUpManager.spawnExtraLife();
        }
      },
      loop: true
    });

    // ! Add game mode specific logic, placeholder consol.log for now
    if (gameMode === 'paid') {
      console.log('Paid game mode activated');
    }
  };

  const update = function() {
    this.background.tilePositionX += 0.5;
    this.foreground.tilePositionX += 1;
  
    this.player.setVelocity(0);
  
    const speed = 300 * this.gameState.speedLevel / 5; // Adjust speed based on speedLevel
  
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
  
    if (this.spaceKey.isDown) {
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
  };
  

  if (gameState === 'start') {
    return <StartScreen onStartFreeGame={startFreeGame} onStartPaidGame={startPaidGame} />;
  }

  if (gameState === 'gameOver') {
    return <GameOverScreen lastScore={lastScore} onStartFreeGame={startFreeGame} onStartPaidGame={startPaidGame} />;
  }

  return (
    <div>
      <h1>Space Shooter</h1>
      <div ref={gameRef} id="game"></div>
      <div id="musicToggle">
        <input type="checkbox" id="toggleMusic" />
        <span className="slider round">Music On/Off</span>
      </div>
    </div>
  );
};
export default App;
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { ethers } from 'ethers';
import { Weapon } from '../modules/weapons';
import { GameStateManager } from '../managers/GameStateManager';
import { PowerUpManager } from '../managers/PowerUpManager';
import { MonsterManager } from '../managers/MonsterManager';
import { WaveManager } from '../managers/WaveManager';
import PaidGameStats from './PaidGameStats';
import { DRAGO_GAME_ABI, DRAGO_GAME_ADDRESS } from '../contracts/dragoGameContract';

const GameScreen = ({ onGameOver, gameMode }) => {
  const gameRef = useRef(null);
  const game = useRef(null);
  const [showStats, setShowStats] = useState(false);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isEventActive, setIsEventActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canStartGame, setCanStartGame] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeEthers = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signerInstance = await provider.getSigner();
          setSigner(signerInstance);
          
          const contractInstance = new ethers.Contract(DRAGO_GAME_ADDRESS, DRAGO_GAME_ABI, signerInstance);
          setContract(contractInstance);

          // Check if an event is already active
          const eventActive = await contractInstance.eventActive();
          setIsEventActive(eventActive);
          setShowStats(eventActive);

          if (gameMode === 'free') {
            setCanStartGame(true);
          } else if (eventActive) {
            setCanStartGame(true);
          }
        } catch (error) {
          console.error("Error initializing ethers:", error);
          setError("Failed to connect to MetaMask. Please make sure it's installed and unlocked.");
        }
      } else {
        setError("MetaMask not detected. Please install MetaMask to play paid games.");
      }
    };

    initializeEthers();
  }, [gameMode]);

  const startPaidGame = async () => {
    if (!contract) {
      setError("Contract not initialized. Please try refreshing the page.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const eventActive = await contract.eventActive();
      let tx;
      if (eventActive) {
        tx = await contract.joinGame({ value: ethers.parseEther("0.01") });
      } else {
        tx = await contract.startGame({ value: ethers.parseEther("0.01") });
      }
      await tx.wait();
      setIsEventActive(true);
      setShowStats(true);
      setCanStartGame(true);
    } catch (error) {
      console.error("Error starting/joining paid game:", error);
      setError("Failed to start/join the game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitScore = async (score) => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }
  
    try {
      console.log(`Submitting score: ${score}`);
      const tx = await contract.submitScore(score);
      await tx.wait();
      console.log(`Score submitted successfully. Transaction hash: ${tx.hash}`);
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  const endEventAndClaimPrize = async () => {
    if (!contract) return;

    try {
      await contract.endEventAndClaimPrize();
      setIsEventActive(false);
      setShowStats(false);
    } catch (error) {
      console.error("Error ending event and claiming prize:", error);
    }
  };

  useEffect(() => {
    if (!canStartGame) return;

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

    function preload() {
      this.load.setBaseURL('/src/assets/');
      this.load.image('background', 'back.png');
      this.load.image('foreground', 'fore.png');
      this.load.image('player', 'ship.png');
      this.load.bitmapFont('shmupfont', 'shmupfont.png', 'shmupfont.xml');

      for (let i = 1; i <= 11; i++) {
        this.load.image(`bullet${i}`, `bullet${i}.png`);
      }

      this.load.image('powerup_shield', 'powerup_shield.png');
      this.load.image('powerup_speed', 'powerup_speed.png');
      this.load.image('powerup_screenClear', 'powerup_screenClear.png');
      this.load.image('powerup_extraLife', 'powerup_extraLife.png');

      this.load.image('monster_small', 'monster_small.png');
      this.load.image('monster_medium', 'monster_medium.png');
      this.load.image('monster_large', 'monster_large.png');
      this.load.image('monster_boss', 'monster_boss.png');

      this.load.audio('backgroundMusic', 'sounds/track1.mp3');
    }

    function create() {
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
    
      this.gameState = new GameStateManager(this);
      this.gameState.create();
    
      this.powerUpManager = new PowerUpManager(this);
      this.powerUpManager.setupCollision(this.player);
    
      this.monsterManager = new MonsterManager(this);
      this.waveManager = new WaveManager(this, this.monsterManager);
    
      this.monsterManager.setupCollisions(this.player, this.weapons[this.currentWeapon].bullets);
    
      this.waveManager.startWaves();
    
      this.input.once('pointerdown', () => {
        if (this.sound.context.state === 'suspended') {
          this.sound.context.resume();
        }
        if (!this.music.isPlaying) {
          this.music.play();
        }
      });
    
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
    
      this.time.addEvent({
        delay: 10000,
        callback: () => this.powerUpManager.spawnRandomPowerUp(),
        loop: true
      });
    
      this.time.addEvent({
        delay: 60000,
        callback: () => {
          if (Phaser.Math.Between(1, 100) <= 20) {
            this.powerUpManager.spawnExtraLife();
          }
        },
        loop: true
      });
    
      this.events.on('gameover', (score) => {
        if (gameMode === 'paid') {
          submitScore(score);
        }
        console.log('Calling onGameOver prop'); // Debugging
        onGameOver(score);
      });
    
      if (gameMode === 'paid' && !isEventActive) {
        startPaidGame();
      }
    
      // Add a button for the winner to end the game
      if (gameMode === 'paid') {
        const endGameButton = this.add.text(this.game.config.width - 10, 10, 'End Game and withdraw prize', {
          font: '16px Arial',
          fill: '#ffffff'
        })
        .setOrigin(1, 0)
        .setInteractive()
        .on('pointerdown', () => {
          endEventAndClaimPrize();
        });
    
        // Only show the button if the player is the current highest scorer
        const updateEndGameButton = async () => {
          if (contract) {
            const eventDetails = await contract.getCurrentEventDetails();
            const playerAddress = await signer.getAddress();
            endGameButton.visible = (eventDetails.highestScorer.toLowerCase() === playerAddress.toLowerCase());
          }
        };
    
        // Update the button visibility every 5 seconds
        this.time.addEvent({
          delay: 5000,
          callback: updateEndGameButton,
          loop: true
        });
      }
    }

    function update() {
      this.background.tilePositionX += 0.5;
      this.foreground.tilePositionX += 1;
    
      this.player.setVelocity(0);
    
      const speed = 300 * this.gameState.speedLevel / 5;
    
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
    
      if (this.spaceKey.isDown && !this.gameState.isRespawning) {
        this.weapons[this.currentWeapon].fire(this.player);
      }
    
      this.monsterManager.monsters.getChildren().forEach((monster) => {
        if (monster.x < -monster.width) {
          monster.destroy();
        }
      });
    
      this.weaponName.setText(this.weapons[this.currentWeapon].name);
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        game.current = null;
      }
    };
  }, [onGameOver, gameMode, contract, isEventActive, signer, canStartGame]);

  useEffect(() => {
    if (gameMode === 'paid' && !isEventActive && !isLoading && !canStartGame) {
      startPaidGame();
    }
  }, [gameMode, isEventActive, isLoading, canStartGame]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <h2>Processing Transaction</h2>
        <p>Please wait while we confirm your entry fee payment...</p>
      </div>
    );
  }

  if (!canStartGame && gameMode === 'paid') {
    return (
      <div className="waiting-screen">
        <h2>Ready to Start Paid Game</h2>
        <p>Click the button below to pay the entry fee and start the game.</p>
        <button onClick={startPaidGame} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Pay Entry Fee and Start Game'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  return (
    <div className="game-screen">
      <h1>Space Shooter</h1>
      <div className="game-container">
        <div ref={gameRef} id="game"></div>
        {(showStats || isEventActive) && (
          <PaidGameStats
            contractAddress={DRAGO_GAME_ADDRESS}
            provider={signer?.provider}
            onEventEnd={endEventAndClaimPrize}
          />
        )}
      </div>
      <div id="musicToggle">
        <input type="checkbox" id="toggleMusic" />
        <span className="slider round">Music On/Off</span>
      </div>
    </div>
  );
};

export default GameScreen;
import Phaser from 'phaser';

export class DropManager {
  constructor(scene) {
    this.scene = scene;
    // Create a physics group for all drops
    this.drops = this.scene.physics.add.group();
  }

  // Create a new drop at the specified coordinates
  createDrop(x, y, type) {
    const drop = this.drops.create(x, y, `powerup_${type}`);
    drop.type = type;
    drop.setCollideWorldBounds(true);
    drop.setBounce(1);
    // Give the drop a random velocity for some movement
    drop.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));

    // Destroy the drop after 10 seconds if not collected
    this.scene.time.delayedCall(10000, () => {
      drop.destroy();
    });
  }

  // Set up collision detection between player and drops
  setupCollision(player) {
    this.scene.physics.add.overlap(player, this.drops, this.collectDrop, null, this);
  }

  // Handle drop collection
  collectDrop(player, drop) {
    drop.destroy();
    switch (drop.type) {
      case 'shield':
        this.scene.gameState.setShield(true);
        break;
      case 'speed':
        this.scene.gameState.increaseSpeed();
        break;
      case 'extraLife':
        this.scene.gameState.gainLife();
        break;
      default:
        // Handle weapon upgrades
        if (this.scene.weapons.find(w => w.name === drop.type)) {
          this.scene.currentWeapon = this.scene.weapons.findIndex(w => w.name === drop.type);
        }
        break;
    }
  }

  // Determine if a monster should drop an item and create the drop
  dropFromMonster(monster) {
    let dropChance;
    // Set drop chance based on monster type
    switch (monster.type) {
      case 'large':
        dropChance = 0.1; // 10% chance
        break;
      case 'medium':
        dropChance = 0.05; // 5% chance
        break;
      case 'small':
        dropChance = 0.01; // 1% chance
        break;
      default:
        return; // No drops for unknown monster types
    }

    // Roll for drop
    if (Math.random() < dropChance) {
      const dropType = this.getRandomDropType();
      this.createDrop(monster.x, monster.y, dropType);
    }
  }

  // Determine the type of drop based on probability distribution
  getRandomDropType() {
    const rand = Math.random();
    if (rand < 0.10) return 'shield';
    if (rand < 0.30) return 'speed';
    if (rand < 0.35) return 'extraLife';
    if (rand < 0.45) {
      // Weapon upgrades
      const weaponTypes = [
        'Single Bullet', 'Front And Back', 'Three Way', 'Eight Way',
        'Scatter Shot', 'Beam', 'Split Shot', 'Pattern', 'Rockets', 'Scale Bullet'
      ];
      const comboWeapons = ['Combo One', 'Combo Two'];
      
      // 90% chance for regular weapons, 10% chance for combo weapons
      if (rand < 0.445) {
        return weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
      } else {
        return comboWeapons[Math.floor(Math.random() * comboWeapons.length)];
      }
    }
    // Fallback to shield if we somehow get here (should never happen)
    return 'shield';
  }
}
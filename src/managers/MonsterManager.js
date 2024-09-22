import Phaser from 'phaser';

// Monster class representing individual enemies
class Monster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, type) {
    super(scene, x, y, texture);
    this.type = type;
    this.health = this.getInitialHealth();
    // Add the monster to the scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  // Set initial health based on monster type
  getInitialHealth() {
    switch (this.type) {
      case 'small': return 1;
      case 'medium': return 3;
      case 'large': return 5;
      case 'boss': return 20;
      default: return 1; // Default to 1 health for unknown types
    }
  }

  // Handle monster taking damage
  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
      return true; // Indicates the monster was destroyed
    }
    return false; // Indicates the monster survived
  }
}

// MonsterManager class to handle all monster-related operations
export class MonsterManager {
  constructor(scene) {
    this.scene = scene;
    // Create a physics group for all monsters
    this.monsters = scene.physics.add.group();
  }

  // Create a new monster and add it to the group
  createMonster(x, y, type) {
    const texture = `monster_${type}`;
    const monster = new Monster(this.scene, x, y, texture, type);
    this.monsters.add(monster);
    return monster;
  }

  // Set up collision detection for monsters
  setupCollisions(player, weapons) {
    this.scene.physics.add.overlap(player, this.monsters, this.playerMonsterCollision, null, this);
    
    weapons.forEach(weapon => {
      if (weapon.bullets) {
        this.scene.physics.add.overlap(weapon.bullets, this.monsters, this.bulletMonsterCollision, null, this);
      }
      // Handle composite weapons
      if (weapon.weapons) {
        weapon.weapons.forEach(subWeapon => {
          if (subWeapon.bullets) {
            this.scene.physics.add.overlap(subWeapon.bullets, this.monsters, this.bulletMonsterCollision, null, this);
          }
        });
      }
    });
  }

  // Handle collision between player and monster
  playerMonsterCollision(player, monster) {
    if (!this.scene.gameState.isImmune) {
      const killed = this.scene.gameState.hit(monster.type);
      if (!killed) {
        // If player wasn't killed, handle monster damage
        if (monster.type === 'small') {
          monster.destroy(); // Small monsters are destroyed on contact
        } else {
          monster.takeDamage(1); // Larger monsters take damage
        }
      }
    }
  }

  // Handle collision between bullet and monster
  bulletMonsterCollision(bullet, monster) {
    bullet.destroy(); // Destroy the bullet on impact
    const monsterDestroyed = monster.takeDamage(1);
    if (monsterDestroyed) {
      // If monster was destroyed, update score and potentially drop an item
      this.scene.gameState.addScore(this.getMonsterScore(monster.type));
      this.scene.dropManager.dropFromMonster(monster);
    }
  }

  // Get score value for destroying a monster
  getMonsterScore(type) {
    switch (type) {
      case 'small': return 10;
      case 'medium': return 20;
      case 'large': return 30;
      case 'boss': return 100;
      default: return 0; // No score for unknown types
    }
  }
}
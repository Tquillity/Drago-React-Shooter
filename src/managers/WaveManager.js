export class WaveManager {
  constructor(scene, monsterManager) {
    this.scene = scene;
    this.monsterManager = monsterManager;
    this.currentWave = 0;
    this.monstersPerWave = 10;
    this.timeBetweenWaves = 10000; // 10 seconds
    this.timeBetweenMonsters = 1000; // 1 second
  }

  startWaves() {
    this.nextWave();
  }

  nextWave() {
    this.currentWave++;
    this.spawnWave();
    this.scene.time.delayedCall(this.timeBetweenWaves, () => this.nextWave());
  }

  spawnWave() {
    for (let i = 0; i < this.monstersPerWave; i++) {
      this.scene.time.delayedCall(i * this.timeBetweenMonsters, () => this.spawnMonster());
    }
  }

  spawnMonster() {
    const x = this.scene.game.config.width;
    const y = Phaser.Math.Between(50, this.scene.game.config.height - 50);
    const types = ['small', 'medium', 'large'];
    const weights = [0.6, 0.3, 0.1];
    const type = this.weightedRandom(types, weights);
    
    const monster = this.monsterManager.createMonster(x, y, type);
    monster.setVelocityX(Phaser.Math.Between(-100, -200));
  }

  weightedRandom(items, weights) {
    let total = weights.reduce((a, b) => a + b);
    let random = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
      if (random < weights[i]) {
        return items[i];
      }
      random -= weights[i];
    }
    return items[items.length - 1];
  }

  spawnBoss() {
    const x = this.scene.game.config.width;
    const y = this.scene.game.config.height / 2;
    const boss = this.monsterManager.createMonster(x, y, 'boss');
    boss.setVelocityX(-50);
    // Add boss-specific behavior here
  }
}
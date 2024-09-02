export class LeaderboardManager {
  constructor() {
    this.leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  }

  addScore(name, score) {
    this.leaderboard.push({ name, score });
    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard = this.leaderboard.slice(0, 10); // Keep only top 10 scores
    localStorage.setItem('leaderboard', JSON.stringify(this.leaderboard));
  }

  getLeaderboard() {
    return this.leaderboard;
  }

  displayLeaderboard(scene) {
    const leaderboardText = ['LEADERBOARD'];
    this.leaderboard.forEach((entry, index) => {
      leaderboardText.push(`${index + 1}. ${entry.name}: ${entry.score}`);
    });
    scene.add.bitmapText(scene.game.config.width / 2, 100, 'shmupfont', leaderboardText, 24)
      .setOrigin(0.5);
  }
}
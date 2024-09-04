import React from 'react';
import gameOverImage from '../assets/GameOverScreen.jpg';

const GameOverScreen = ({ lastScore, onStartFreeGame, onStartPaidGame }) => {
  return (
    <div className="game-over-screen">
      <img src={gameOverImage} alt="Game Over" />
      <div className="content">
        <h2>Game Over</h2>
        <p>Your Score: {lastScore}</p>
        <div className="button-container">
          <button className="free-game" onClick={onStartFreeGame}>
            Free Training Game
          </button>
          <button className="paid-game" onClick={onStartPaidGame}>
            Paid Competitive Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
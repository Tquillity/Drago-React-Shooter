import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import GameScreen from './components/GameScreen';

const App = () => {
  const [gameState, setGameState] = useState('start');
  const [lastScore, setLastScore] = useState(0);
  const [gameMode, setGameMode] = useState(null);

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

  switch (gameState) {
    case 'start':
      return <StartScreen onStartFreeGame={startFreeGame} onStartPaidGame={startPaidGame} />;
    case 'gameOver':
      return <GameOverScreen lastScore={lastScore} onStartFreeGame={startFreeGame} onStartPaidGame={startPaidGame} />;
    case 'playing':
      return <GameScreen onGameOver={handleGameOver} gameMode={gameMode} />;
    default:
      return <div>Error: Unknown game state</div>;
  }
};

export default App;
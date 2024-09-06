import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import GameScreen from './components/GameScreen';
import WithdrawFees from './pages/WithdrawFees';

const App = () => {
  const [gameState, setGameState] = useState('start');
  const [lastScore, setLastScore] = useState(0);
  const [gameMode, setGameMode] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const startFreeGame = () => {
    setGameMode('free');
    setGameState('playing');
    setShowAdminPanel(false);
  };

  const startPaidGame = () => {
    setGameMode('paid');
    setGameState('playing');
    setShowAdminPanel(false);
  };

  const handleGameOver = (score) => {
    setLastScore(score);
    setGameState('gameOver');
  };

  const toggleAdminPanel = () => {
    setShowAdminPanel(!showAdminPanel);
    if (!showAdminPanel) {
      setGameState('admin');
    } else {
      setGameState('start');
    }
  };

  const renderGameContent = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStartFreeGame={startFreeGame} onStartPaidGame={startPaidGame} />;
      case 'gameOver':
        return <GameOverScreen lastScore={lastScore} onStartFreeGame={startFreeGame} onStartPaidGame={startPaidGame} />;
      case 'playing':
        return <GameScreen onGameOver={handleGameOver} gameMode={gameMode} />;
      case 'admin':
        return <WithdrawFees />;
      default:
        return <div>Error: Unknown game state</div>;
    }
  };

  return (
    <div className="App">
      <button 
        onClick={toggleAdminPanel} 
        className="admin-button"
      >
        {showAdminPanel ? 'Back to Game' : 'Admin Panel'}
      </button>
      {renderGameContent()}
    </div>
  );
};

export default App;
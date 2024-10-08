import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import GameScreen from './components/GameScreen';
import WithdrawFees from './pages/WithdrawFees';
import Layout from './components/Layout';
import AllTimeLeaderboard from './pages/AllTimeLeaderboard';
import ActiveTournaments from './pages/ActiveTournaments';

const App = () => {
  const [gameState, setGameState] = useState('start');
  const [lastScore, setLastScore] = useState(0);
  const [gameMode, setGameMode] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [canStartGame, setCanStartGame] = useState(true);

  const startFreeGame = () => {
    setGameMode('free');
    setGameState('playing');
    setShowAdminPanel(false);
  };

  const startPaidGame = () => {
    setGameMode('paid');
    setGameState('playing');
    setShowAdminPanel(false);
    setCanStartGame(false);
  };

  const handleGameOver = (score) => {
    console.log(`App received game over. Score: ${score}`); // Debugging
    setLastScore(score);
    setGameState('gameOver');
    console.log(`Game state set to: ${gameState}`); // Debugging
  };

  const toggleAdminPanel = () => {
    setShowAdminPanel(!showAdminPanel);
    if (!showAdminPanel) {
      setGameState('admin');
    } else {
      setGameState('start');
    }
    console.log(`Admin panel toggled. Show admin: ${!showAdminPanel}`); // Debugging
  };

  console.log(`Current game state: ${gameState}`); // Debugging
  console.log(`Current game mode: ${gameMode}`); // Debugging

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
    <Router>
      <Layout>
        <Routes>
          <Route path="/leaderboard" element={<AllTimeLeaderboard />} />
          <Route path="/active-tournaments" element={<ActiveTournaments />} />
          <Route path="/empty" element={<div>This page is empty for now.</div>} />
          <Route path="/" element={
            <>
              <button
                onClick={toggleAdminPanel}
                className="admin-button"
              >
                {showAdminPanel ? 'Back to Game' : 'Admin Panel'}
              </button>
              {renderGameContent()}
            </>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import GameScreen from './components/GameScreen';
import Layout from './components/Layout';
import AllTimeLeaderboard from './pages/AllTimeLeaderboard';
import ActiveTournaments from './pages/ActiveTournaments';

const App = () => {
  const [gameState, setGameState] = useState('start');
  const [lastScore, setLastScore] = useState(0);
  const [gameMode, setGameMode] = useState(null);

  const startFreeGame = () => {
    setGameMode('free');
    setGameState('playing');
  };

  const startPaidGame = () => {
    // For now, treat paid games the same as free games
    setGameMode('free');
    setGameState('playing');
  };

  const handleGameOver = (score) => {
    console.log(`App received game over. Score: ${score}`);
    setLastScore(score);
    setGameState('gameOver');
  };

  const renderGameContent = () => {
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

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/leaderboard" element={<AllTimeLeaderboard />} />
          <Route path="/active-tournaments" element={<ActiveTournaments />} />
          <Route path="/empty" element={<div>This page is empty for now.</div>} />
          <Route path="/" element={renderGameContent()} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
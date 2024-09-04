import React from 'react';
import startScreenImage from '../assets/startScreen.jpg';

const StartScreen = ({ onStartFreeGame, onStartPaidGame }) => {
  return (
    <div className="start-screen">
      <img src={startScreenImage} alt="Game Start" />
      <div className="button-container">
        <button className="free-game" onClick={onStartFreeGame}>
          Free Training Game
        </button>
        <button className="paid-game" onClick={onStartPaidGame}>
          Paid Competitive Game
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
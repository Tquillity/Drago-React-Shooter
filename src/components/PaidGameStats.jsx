import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { DRAGO_GAME_ABI, DRAGO_GAME_ADDRESS } from '../contracts/dragoGameContract';

const PaidGameStats = ({ provider, onEventEnd }) => {
  const [eventDetails, setEventDetails] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const contract = new ethers.Contract(DRAGO_GAME_ADDRESS, DRAGO_GAME_ABI, provider);

    const fetchEventDetails = async () => {
      try {
        const details = await contract.getCurrentEventDetails();
        setEventDetails(details);

        const endTime = details.startTime + BigInt(15 * 60); // 15 minutes in seconds
        const currentTime = BigInt(Math.floor(Date.now() / 1000));
        setTimeLeft(Number(endTime - currentTime));
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
    const interval = setInterval(fetchEventDetails, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [provider]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft <= 0) {
      onEventEnd();
    }
  }, [timeLeft, onEventEnd]);

  if (!eventDetails) return null;

  const { playerCount, submittedScores, highestScore, highestScorer } = eventDetails;

  return (
    <div className="paid-game-stats">
      <h3>Paid Game Stats</h3>
      <p>Players: {Number(playerCount)} / 3</p>
      <p>Submitted Scores: {Number(submittedScores)}</p>
      <p>Highest Score: {Number(highestScore)}</p>
      <p>Highest Scorer: {highestScorer}</p>
      <p>Time Left: {timeLeft ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : 'N/A'}</p>
      {Number(playerCount) < 3 && (
        <p>Press Paid to enter competition</p>
      )}
    </div>
  );
};

export default PaidGameStats;
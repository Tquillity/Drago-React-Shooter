import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { DRAGO_GAME_ABI, DRAGO_GAME_ADDRESS } from '../contracts/dragoGameContract';

const ActiveTournaments = () => {
  const [activeTournament, setActiveTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveTournament = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(DRAGO_GAME_ADDRESS, DRAGO_GAME_ABI, provider);

          const eventActive = await contract.eventActive();
          if (eventActive) {
            const eventDetails = await contract.getCurrentEventDetails();
            setActiveTournament({
              startTime: new Date(Number(eventDetails.startTime) * 1000),
              highestScore: Number(eventDetails.highestScore),
              highestScorer: eventDetails.highestScorer,
              playerCount: Number(eventDetails.playerCount),
              submittedScores: Number(eventDetails.submittedScores)
            });
          } else {
            setActiveTournament(null);
          }
        } else {
          setError("Please install MetaMask to view tournament details.");
        }
      } catch (err) {
        setError("Error fetching tournament data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTournament();
    const intervalId = setInterval(fetchActiveTournament, 10000); // Refresh every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div>Loading tournament data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!activeTournament) return <div>No active tournament at the moment.</div>;

  return (
    <div className="active-tournaments">
      <h2>Current Active Tournament</h2>
      <p>Start Time: {activeTournament.startTime.toLocaleString()}</p>
      <p>Highest Score: {activeTournament.highestScore}</p>
      <p>Highest Scorer: {activeTournament.highestScorer}</p>
      <p>Total Players: {activeTournament.playerCount}</p>
      <p>Submitted Scores: {activeTournament.submittedScores}</p>
    </div>
  );
};

export default ActiveTournaments;
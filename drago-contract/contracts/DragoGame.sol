// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DragoGame is ReentrancyGuard, Ownable {
    struct Event {
        uint256 startTime;
        uint256 highestScore;
        address highestScorer;
        uint256 playerCount;
        uint256 submittedScores;
        mapping(address => uint256) playerEntries;
        mapping(address => uint256) submittedScoreCount;
    }

    uint256 public constant EVENT_DURATION = 15 minutes;
    uint256 public constant MAX_PLAYERS = 3;
    uint256 public constant ENTRY_FEE = 0.01 ether;
    uint256 public constant PRIZE = 0.02 ether;

    Event public currentEvent;
    bool public eventActive;

    event GameStarted(uint256 startTime);
    event PlayerJoined(address player);
    event NewHighScore(address player, uint256 score);
    event EventEnded(address winner, uint256 winningScore);
    event EventClosedByAdmin(address highestScorer, uint256 highestScore);

    constructor() Ownable(msg.sender) {}

    function startGame() external payable nonReentrant {
        require(!eventActive, "An event is already active");
        require(msg.value == ENTRY_FEE, "Incorrect entry fee");

        eventActive = true;
        currentEvent.startTime = block.timestamp;
        currentEvent.playerCount = 1;
        currentEvent.submittedScores = 0;
        currentEvent.playerEntries[msg.sender] = 1;

        emit GameStarted(currentEvent.startTime);
        emit PlayerJoined(msg.sender);
    }

    function joinGame() external payable nonReentrant {
        require(eventActive, "No active event");
        require(msg.value == ENTRY_FEE, "Incorrect entry fee");
        require(currentEvent.playerCount < MAX_PLAYERS, "Event is full");
        require(block.timestamp < currentEvent.startTime + EVENT_DURATION, "Event has ended");

        currentEvent.playerCount++;
        currentEvent.playerEntries[msg.sender]++;

        emit PlayerJoined(msg.sender);
    }

    function submitScore(uint256 score) external nonReentrant {
        require(eventActive, "No active event");
        require(currentEvent.playerEntries[msg.sender] > currentEvent.submittedScoreCount[msg.sender], "No more scores to submit");
        require(block.timestamp < currentEvent.startTime + EVENT_DURATION, "Event has ended");

        currentEvent.submittedScoreCount[msg.sender]++;
        currentEvent.submittedScores++;

        if (score > currentEvent.highestScore) {
            currentEvent.highestScore = score;
            currentEvent.highestScorer = msg.sender;
            emit NewHighScore(msg.sender, score);
        }
    }

    function endEventAndClaimPrize() external nonReentrant {
        require(eventActive, "No active event");
        require(block.timestamp >= currentEvent.startTime + EVENT_DURATION || 
                currentEvent.submittedScores == currentEvent.playerCount, 
                "Event not ready to end");
        require(msg.sender == currentEvent.highestScorer, "Only highest scorer can end the event");

        eventActive = false;
        address winner = currentEvent.highestScorer;
        uint256 winningScore = currentEvent.highestScore;

        payable(winner).transfer(PRIZE);

        emit EventEnded(winner, winningScore);

        delete currentEvent;
    }

    function adminCloseEvent() external onlyOwner {
        require(eventActive, "No active event to close");

        eventActive = false;
    
        // Emit an event to log that the admin closed the event
        emit EventClosedByAdmin(currentEvent.highestScorer, currentEvent.highestScore);

        // Reset the current event
        delete currentEvent;
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    function getCurrentEventDetails() external view returns (
        uint256 startTime,
        uint256 highestScore,
        address highestScorer,
        uint256 playerCount,
        uint256 submittedScores
    ) {
        return (
            currentEvent.startTime,
            currentEvent.highestScore,
            currentEvent.highestScorer,
            currentEvent.playerCount,
            currentEvent.submittedScores
        );
    }
}
// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol"; // Import for security against reentrancy attacks // ! 1
import "@openzeppelin/contracts/access/Ownable.sol"; // Import for access control
contract DragoGame is ReentrancyGuard, Ownable {
    // Struct to define the structure of an Event - Requirement: Struct
    struct Event {
        uint256 startTime;
        uint256 highestScore;
        address highestScorer;
        uint256 playerCount;
        uint256 submittedScores;
        mapping(address => uint256) playerEntries; // Requirement: Mapping
        mapping(address => uint256) submittedScoreCount;
    }

    uint256 public constant EVENT_DURATION = 15 minutes;
    uint256 public constant MAX_PLAYERS = 5;
    uint256 public constant ENTRY_FEE = 1 ether;
    uint256 public constant PRIZE = 2 ether;

    Event public currentEvent;
    bool public eventActive;

    address[] public registeredPlayers; // New array to store all registered player addresses

    // Custom errors for gas efficiency - Requirement: Custom Error
    error NotRegistered();
    error EventNotActive();
    error GameFull();
    error IncorrectFee();

    // Events for logging important actions - Requirement: Events for logging
    event GameStarted(uint256 startTime);
    event PlayerJoined(address player);
    event NewHighScore(address player, uint256 score);
    event EventEnded(address winner, uint256 winningScore);
    event EventClosedByAdmin(address highestScorer, uint256 highestScore);
    event ScoreSubmitted(address player, uint256 score);
    event FeesWithdrawn(address owner, uint256 amount);
    event EtherReceived(address indexed sender, uint256 value);

    // Constructor initializes the owner - Requirement: Constructor
    constructor() Ownable(msg.sender) {}

    // Custom modifier for checking if the player is registered - Requirement: Custom Modifier
    modifier onlyRegistered() {
        if (currentEvent.playerEntries[msg.sender] == 0) revert NotRegistered();
        _;
    }

    // Function to start a game, fulfilling event management - Partial Requirement for event registration
    function startGame() external payable nonReentrant {
        require(!eventActive, "An event is already active"); // Adding require for clarity and to meet the requirement of one require statement // ! =) 
        if (msg.value != ENTRY_FEE) revert IncorrectFee(); // Gas optimization: using custom error instead of require // ! 2

        eventActive  = false;

        // Reset current event
        delete currentEvent;
        // Clear registered players
        delete registeredPlayers;

        // Start new event
        eventActive = true;
        currentEvent.startTime = block.timestamp; // Gas optimization: using block.timestamp instead of now // ! 3 
        currentEvent.playerCount = 1;
        currentEvent.submittedScores = 0;
        currentEvent.playerEntries[msg.sender] = 1;
        if(currentEvent.playerEntries[msg.sender] == 1) { // Check if this is the first entry for this address
            registeredPlayers.push(msg.sender);
        }

        // ! Score submitting to a consecutive event will not be possible without this
        // ! Somehow still believe it is in the last event and will not be able to submit scores
        // Explicitly initialize mappings for the new event
        currentEvent.playerEntries[msg.sender] = 1;
        currentEvent.submittedScoreCount[msg.sender] = 0;  // Reset submitted scores count for this player

        emit GameStarted(currentEvent.startTime);
        emit PlayerJoined(msg.sender);
    }

    // Function to join an ongoing game - Partial Requirement for event registration
    function joinGame() external payable nonReentrant {
        if (!eventActive) revert EventNotActive(); // Requirement: Revert if event is not active one of maaany revert statements
        if (msg.value != ENTRY_FEE) revert IncorrectFee();
        if (currentEvent.playerCount >= MAX_PLAYERS) revert GameFull();
        if (block.timestamp > currentEvent.startTime + EVENT_DURATION) revert EventNotActive();

        currentEvent.playerCount++;
        currentEvent.playerEntries[msg.sender]++;
        if(currentEvent.playerEntries[msg.sender] == 1) { // If this player wasn't already registered
            registeredPlayers.push(msg.sender);
        }

        emit PlayerJoined(msg.sender);
    }

    // Function to submit a score, uses custom modifier - Requirement: Use of Custom Modifier
function submitScore(uint256 score) external onlyRegistered nonReentrant {
    if (!eventActive) revert EventNotActive();
    if (currentEvent.submittedScoreCount[msg.sender] >= currentEvent.playerEntries[msg.sender]) revert("No more scores to submit for this entry");

    uint256 previousHighestScore = currentEvent.highestScore; // Store the current highest score

    currentEvent.submittedScoreCount[msg.sender]++;
    currentEvent.submittedScores++;

    if (score > currentEvent.highestScore) {
        currentEvent.highestScore = score;
        currentEvent.highestScorer = msg.sender;
        emit NewHighScore(msg.sender, score);
    }

    assert(currentEvent.highestScore >= previousHighestScore); // Requirement: Assert

    emit ScoreSubmitted(msg.sender, score);
}

    function endEventAndClaimPrize() external nonReentrant {
        if (!eventActive) revert EventNotActive();
        if (!(block.timestamp >= currentEvent.startTime + EVENT_DURATION || currentEvent.submittedScores == currentEvent.playerCount)) revert("Event not ready to end");
        if (msg.sender != currentEvent.highestScorer) revert("Only highest scorer can end the event");

        eventActive = false;
        address winner = currentEvent.highestScorer;
        uint256 winningScore = currentEvent.highestScore;

        payable(winner).transfer(PRIZE);

        emit EventEnded(winner, winningScore);

        delete currentEvent;
        delete registeredPlayers; // Clear the registered players array
    }

    function adminCloseEvent() external onlyOwner {
        if (!eventActive) revert("No active event to close");

        eventActive = false;

        emit EventClosedByAdmin(currentEvent.highestScorer, currentEvent.highestScore);

        delete currentEvent;
        delete registeredPlayers; // Clear the registered players array
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) revert("No fees to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) revert("Transfer failed");

        emit FeesWithdrawn(owner(), balance);
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

    // Updated function to get all registered players - Requirement: List of registered participants
    function getRegisteredPlayers() external view returns (address[] memory) {
        return registeredPlayers;
    }

    // Receive function for handling incoming Ether - Requirement: Receive function
    receive() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }

    // Fallback function to prevent accidental Ether sending - Requirement: Fallback function
    fallback() external payable {
        revert("Direct Ether transfer not allowed");
    }
}
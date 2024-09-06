import { expect } from "chai"; 
import { ethers } from "hardhat";
import { DragoGame } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("DragoGame", function () {
  let dragoGame: DragoGame;
  let owner: SignerWithAddress;
  let player1: SignerWithAddress;
  let player2: SignerWithAddress;
  let player3: SignerWithAddress;

  const ENTRY_FEE = ethers.parseEther("1"); // 1 ether
  const EVENT_DURATION = 15 * 60; // 15 minutes in seconds

  beforeEach(async function () {
    [owner, player1, player2, player3] = await ethers.getSigners();

    const DragoGameFactory = await ethers.getContractFactory("DragoGame");
    dragoGame = await DragoGameFactory.deploy();
    await dragoGame.waitForDeployment();
  });

  describe("Game Initialization", function () {
    it("Should start a new game event", async function () {
      await expect(dragoGame.connect(player1).startGame({ value: ENTRY_FEE }))
        .to.emit(dragoGame, "GameStarted")
        .and.to.emit(dragoGame, "PlayerJoined");

      expect(await dragoGame.eventActive()).to.be.true;

      const eventDetails = await dragoGame.getCurrentEventDetails();
      expect(eventDetails.playerCount).to.equal(1);
      expect(eventDetails.submittedScores).to.equal(0);
    });

    it("Should not allow starting a game with incorrect fee", async function () {
      await expect(dragoGame.connect(player1).startGame({ value: ethers.parseEther("0.5") }))
        .to.be.revertedWithCustomError(dragoGame, "IncorrectFee");
    });

    it("Should not allow joining a game that hasn't started", async function () {
      await expect(dragoGame.connect(player1).joinGame({ value: ENTRY_FEE }))
        .to.be.revertedWithCustomError(dragoGame, "EventNotActive");
    });
  });

  describe("Game Participation", function () {
    it("Should allow players to join the game multiple times", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await expect(dragoGame.connect(player1).joinGame({ value: ENTRY_FEE }))
        .to.emit(dragoGame, "PlayerJoined");
      await expect(dragoGame.connect(player1).joinGame({ value: ENTRY_FEE }))
        .to.emit(dragoGame, "PlayerJoined");

      const eventDetails = await dragoGame.getCurrentEventDetails();
      expect(eventDetails.playerCount).to.equal(3);
    });

    it("Should not allow more than MAX_PLAYERS entries", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE }); // 1st slot
      await dragoGame.connect(player2).joinGame({ value: ENTRY_FEE }); // 2nd slot
      await dragoGame.connect(player3).joinGame({ value: ENTRY_FEE }); // 3rd slot
      await dragoGame.connect(player1).joinGame({ value: ENTRY_FEE }); // 4th slot
      await dragoGame.connect(player1).joinGame({ value: ENTRY_FEE }); // 5th slot
      await expect(dragoGame.connect(player2).joinGame({ value: ENTRY_FEE })) // 6th slot non existing revert
        .to.be.revertedWithCustomError(dragoGame, "GameFull");
    });

    it("Should not allow joining a game after EVENT_DURATION has passed", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await time.increase(EVENT_DURATION + 1);
      await expect(dragoGame.connect(player2).joinGame({ value: ENTRY_FEE }))
        .to.be.revertedWithCustomError(dragoGame, "EventNotActive");
    });
  });

  describe("Score Submission", function () {
    it("Should update the highest score", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await expect(dragoGame.connect(player1).submitScore(100))
        .to.emit(dragoGame, "NewHighScore")
        .withArgs(player1.address, 100);
      
      const eventDetails = await dragoGame.getCurrentEventDetails();
      expect(eventDetails.submittedScores).to.equal(1);
      expect(eventDetails.highestScore).to.equal(100);
    });

    it("Should allow a player to submit multiple scores for multiple entries", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await dragoGame.connect(player1).joinGame({ value: ENTRY_FEE });
      
      await dragoGame.connect(player1).submitScore(100);
      await dragoGame.connect(player1).submitScore(200);
      
      await expect(dragoGame.connect(player1).submitScore(300))
        .to.be.revertedWith("No more scores to submit for this entry");
    
      const eventDetails = await dragoGame.getCurrentEventDetails();
      expect(eventDetails.submittedScores).to.equal(2);
      expect(eventDetails.highestScore).to.equal(200);
    });

    it("Should emit ScoreSubmitted event when submitting a score", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      
      await expect(dragoGame.connect(player1).submitScore(100))
        .to.emit(dragoGame, "ScoreSubmitted")
        .withArgs(player1.address, 100);
    });

    it("Should not allow submitting a score for an unregistered player", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await expect(dragoGame.connect(player2).submitScore(100))
        .to.be.revertedWithCustomError(dragoGame, "NotRegistered");
    });

    it("Should correctly track multiple entries per player", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await dragoGame.connect(player1).joinGame({ value: ENTRY_FEE });
      await dragoGame.connect(player2).joinGame({ value: ENTRY_FEE });

      await dragoGame.connect(player1).submitScore(100);
      await dragoGame.connect(player1).submitScore(200);
      await dragoGame.connect(player2).submitScore(150);

      const eventDetails = await dragoGame.getCurrentEventDetails();
      expect(eventDetails.submittedScores).to.equal(3);
      expect(eventDetails.highestScore).to.equal(200);
    });
  });

  describe("Event Ending", function () {
    it("Should end the event after all scores have been submitted", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await dragoGame.connect(player1).joinGame({ value: ENTRY_FEE });
      await dragoGame.connect(player1).joinGame({ value: ENTRY_FEE });

      await dragoGame.connect(player1).submitScore(100);
      await dragoGame.connect(player1).submitScore(200);
      await dragoGame.connect(player1).submitScore(300);

      const player1BalanceBefore = await ethers.provider.getBalance(player1.address);
      
      await expect(dragoGame.connect(player1).endEventAndClaimPrize())
        .to.emit(dragoGame, "EventEnded")
        .withArgs(player1.address, 300);

      const player1BalanceAfter = await ethers.provider.getBalance(player1.address);
      expect(player1BalanceAfter).to.be.gt(player1BalanceBefore);

      expect(await dragoGame.eventActive()).to.be.false;
    });

    it("Should not allow ending the event before all scores are submitted or duration has passed", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await dragoGame.connect(player2).joinGame({ value: ENTRY_FEE });

      await dragoGame.connect(player1).submitScore(100);
      
      await expect(dragoGame.connect(player1).endEventAndClaimPrize())
        .to.be.revertedWith("Event not ready to end");
    });

    it("Should only allow the highest scorer to end the event and claim the prize", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await dragoGame.connect(player2).joinGame({ value: ENTRY_FEE });

      await dragoGame.connect(player1).submitScore(100);
      await dragoGame.connect(player2).submitScore(200);

      await time.increase(EVENT_DURATION + 1);

      await expect(dragoGame.connect(player1).endEventAndClaimPrize())
        .to.be.revertedWith("Only highest scorer can end the event");

      await expect(dragoGame.connect(player2).endEventAndClaimPrize())
        .to.emit(dragoGame, "EventEnded")
        .withArgs(player2.address, 200);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow the owner to withdraw fees", async function () {
      // Start a game and have a player join to add funds to the contract
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await dragoGame.connect(player2).joinGame({ value: ENTRY_FEE });

      const initialContractBalance = await ethers.provider.getBalance(await dragoGame.getAddress());
      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

      // Withdraw fees
      await expect(dragoGame.connect(owner).withdrawFees())
        .to.emit(dragoGame, "FeesWithdrawn")
        .withArgs(owner.address, initialContractBalance);

      // Check contract balance is now 0
      expect(await ethers.provider.getBalance(await dragoGame.getAddress())).to.equal(0);

      // Check owner balance has increased (approximately, accounting for gas costs)
      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      expect(finalOwnerBalance).to.be.gt(initialOwnerBalance);

      // Attempt to withdraw again, should fail
      await expect(dragoGame.connect(owner).withdrawFees()).to.be.revertedWith("No fees to withdraw");
    });

    it("Should not allow non-owners to withdraw fees", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await expect(dragoGame.connect(player1).withdrawFees())
        .to.be.revertedWithCustomError(dragoGame, "OwnableUnauthorizedAccount")
        .withArgs(player1.address);
    });

    it("Should allow the owner to close an active event", async function () {
      // Start a game
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      
      // Submit a score
      await dragoGame.connect(player1).submitScore(100);

      // Check that the event is active
      expect(await dragoGame.eventActive()).to.be.true;

      // Close the event as the owner
      await expect(dragoGame.connect(owner).adminCloseEvent())
        .to.emit(dragoGame, "EventClosedByAdmin")
        .withArgs(player1.address, 100);

      // Check that the event is no longer active
      expect(await dragoGame.eventActive()).to.be.false;

      // Try to start a new game to ensure the event was properly reset
      await expect(dragoGame.connect(player2).startGame({ value: ENTRY_FEE }))
        .to.emit(dragoGame, "GameStarted");
    });

    it("Should not allow non-owners to close the event", async function () {
      // Start a game
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
    
      // Try to close the event as a non-owner
      await expect(dragoGame.connect(player2).adminCloseEvent())
        .to.be.revertedWithCustomError(dragoGame, "OwnableUnauthorizedAccount")
        .withArgs(player2.address);
    });

    it("Should not allow closing an event when no event is active", async function () {
      // Try to close a non-existent event
      await expect(dragoGame.connect(owner).adminCloseEvent())
        .to.be.revertedWith("No active event to close");
    });
  });

  describe("Fallback and Receive Functions", function () {
    it("Should correctly handle the receive function", async function () {
      await expect(player1.sendTransaction({
        to: await dragoGame.getAddress(),
        value: ethers.parseEther("1")
      })).to.emit(dragoGame, "EtherReceived")
        .withArgs(player1.address, ethers.parseEther("1"));
    });

    it("Should revert on direct transfers to the fallback function", async function () {
      await expect(player1.sendTransaction({
        to: await dragoGame.getAddress(),
        value: ethers.parseEther("1"),
        data: "0x1234"  // Non-empty data to trigger fallback
      })).to.be.revertedWith("Direct Ether transfer not allowed");
    });
  });

  describe("Player Registration", function () {
    it("Should correctly return the list of registered players", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await dragoGame.connect(player2).joinGame({ value: ENTRY_FEE });
      await dragoGame.connect(player3).joinGame({ value: ENTRY_FEE });

      const registeredPlayers = await dragoGame.getRegisteredPlayers();
      expect(registeredPlayers).to.have.lengthOf(3);
      expect(registeredPlayers).to.include(player1.address);
      expect(registeredPlayers).to.include(player2.address);
      expect(registeredPlayers).to.include(player3.address);
    });

    it("Should reset registered players after event ends", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await dragoGame.connect(player2).joinGame({ value: ENTRY_FEE });

      await dragoGame.connect(player1).submitScore(100);
      await dragoGame.connect(player2).submitScore(200);

      await dragoGame.connect(player2).endEventAndClaimPrize();

      const registeredPlayers = await dragoGame.getRegisteredPlayers();
      expect(registeredPlayers).to.have.lengthOf(0);
    });
  });

  describe("Trying to get Branch coverage above 90% o.O!", function () {
  
    it("Should revert when trying to join with incorrect fee", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await expect(dragoGame.connect(player2).joinGame({ value: ethers.parseEther("0.5") }))
        .to.be.revertedWithCustomError(dragoGame, "IncorrectFee");
    });
    
    it("Should revert when submitting a score with no entries left", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await dragoGame.connect(player1).submitScore(100);
      await expect(dragoGame.connect(player1).submitScore(200))
        .to.be.revertedWith("No more scores to submit for this entry");
    });
    
    it("Should revert when a non-highest scorer tries to end the event", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await dragoGame.connect(player2).joinGame({ value: ENTRY_FEE });
      await dragoGame.connect(player1).submitScore(100);
      await dragoGame.connect(player2).submitScore(200);
      await expect(dragoGame.connect(player1).endEventAndClaimPrize())
        .to.be.revertedWith("Only highest scorer can end the event");
    });

    it("Should allow joining right before EVENT_DURATION ends", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await time.increase(EVENT_DURATION - 1);
      await expect(dragoGame.connect(player2).joinGame({ value: ENTRY_FEE }))
        .to.not.be.reverted;
    });
    
    it("Should not allow joining exactly when EVENT_DURATION ends", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await time.increase(EVENT_DURATION);
      await expect(dragoGame.connect(player2).joinGame({ value: ENTRY_FEE }))
        .to.be.revertedWithCustomError(dragoGame, "EventNotActive");
    });
    
    it("Should handle multiple entries for one player correctly", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await dragoGame.connect(player1).joinGame({ value: ENTRY_FEE });
      await dragoGame.connect(player1).submitScore(100); // First entry
      await dragoGame.connect(player1).submitScore(200); // Second entry
      await expect(dragoGame.connect(player1).submitScore(300))
        .to.be.revertedWith("No more scores to submit for this entry");
    });

    it("Should not allow starting a new game when one is active", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await expect(dragoGame.connect(player2).startGame({ value: ENTRY_FEE }))
        .to.be.revertedWith("An event is already active");
    });  
  
    it("Should handle the case where the highest score is tied", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      await dragoGame.connect(player2).joinGame({ value: ENTRY_FEE });
      await dragoGame.connect(player1).submitScore(100); 
      await dragoGame.connect(player2).submitScore(100); 

      await time.increase(EVENT_DURATION + 1);

      // In case of a tie, the first to call endEventAndClaimPrize should win
      await expect(dragoGame.connect(player1).endEventAndClaimPrize())
        .to.emit(dragoGame, "EventEnded")
        .withArgs(player1.address, 100);
    });

    it("Should allow admin to close the event even if no scores are submitted", async function () {
      await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
      // No scores submitted
      await expect(dragoGame.connect(owner).adminCloseEvent())
        .to.emit(dragoGame, "EventClosedByAdmin")
        .withArgs(ethers.ZeroAddress, 0); // Expecting 0 address and 0 score
    });
  });
});
import { expect } from "chai";
import { ethers } from "hardhat";
import { DragoGame } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("DragoGame", function () {
  let dragoGame: DragoGame;
  let owner: SignerWithAddress;
  let player1: SignerWithAddress;
  let player2: SignerWithAddress;
  let player3: SignerWithAddress;

  const ENTRY_FEE = ethers.parseEther("0.01");

  beforeEach(async function () {
    [owner, player1, player2, player3] = await ethers.getSigners();

    const DragoGameFactory = await ethers.getContractFactory("DragoGame");
    dragoGame = await DragoGameFactory.deploy();
    await dragoGame.waitForDeployment();
  });

  it("Should start a new game event", async function () {
    await expect(dragoGame.connect(player1).startGame({ value: ENTRY_FEE }))
      .to.emit(dragoGame, "GameStarted")
      .and.to.emit(dragoGame, "PlayerJoined");

    expect(await dragoGame.eventActive()).to.be.true;

    const eventDetails = await dragoGame.getCurrentEventDetails();
    expect(eventDetails.playerCount).to.equal(1);
    expect(eventDetails.submittedScores).to.equal(0);
  });

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
    await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
    await dragoGame.connect(player1).joinGame({ value: ENTRY_FEE });
    await dragoGame.connect(player1).joinGame({ value: ENTRY_FEE });
    await expect(dragoGame.connect(player1).joinGame({ value: ENTRY_FEE }))
      .to.be.revertedWith("Event is full");
  });

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
      .to.be.revertedWith("No more scores to submit");

    const eventDetails = await dragoGame.getCurrentEventDetails();
    expect(eventDetails.submittedScores).to.equal(2);
    expect(eventDetails.highestScore).to.equal(200);
  });

  it("Should end the game after all scores have been submitted", async function () {
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

  it("Should allow the owner to withdraw fees", async function () {
    await dragoGame.connect(player1).startGame({ value: ENTRY_FEE });
    await dragoGame.connect(player2).joinGame({ value: ENTRY_FEE });

    const initialBalance = await ethers.provider.getBalance(owner.address);
    await dragoGame.connect(owner).withdrawFees();
    const finalBalance = await ethers.provider.getBalance(owner.address);

    expect(finalBalance).to.be.gt(initialBalance);
  });
});
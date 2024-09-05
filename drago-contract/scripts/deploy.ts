import { ethers } from "hardhat";

async function main() {
  const DragoGame = await ethers.getContractFactory("DragoGame");
  const dragoGame = await DragoGame.deploy();

  await dragoGame.waitForDeployment();

  console.log("DragoGame deployed to:", await dragoGame.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
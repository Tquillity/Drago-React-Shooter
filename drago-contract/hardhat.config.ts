import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import * as dotenv from "dotenv";
import path from 'path';

// Load .env file from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log("AMOY_RPC_URL:", process.env.AMOY_RPC_URL);
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY ? "Set" : "Not Set");

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  networks: {
    amoy: {
      url: process.env.AMOY_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "./.env.local" });
// eslint-disable-next-line no-undef
task("accounts", "printing accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});
const privateKey = process.env.REACT_APP_PUBLIC_PRIVATE_KEY;
module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.REACT_APP_PUBLIC_RPC_URL,
      accounts: [
        privateKey
      ],
    },
  },
};

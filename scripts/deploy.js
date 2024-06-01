const hre = require("hardhat");
async function main() {
  const campaignFactory = await hre.ethers.getContractFactory(
    "PatientData"
  );
  const CampaignFactory = await campaignFactory.deploy();
  await CampaignFactory.waitForDeployment();
  console.log("address :", await CampaignFactory.getAddress());
}
main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

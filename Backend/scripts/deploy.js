const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const accounts = await ethers.getSigners();

  const networkName = hre.network.name;

  const lifeEstateFactory = await ethers.deployContract("LifeEstateFactory");

  await lifeEstateFactory.waitForDeployment();

  const lusdt = await ethers.deployContract("LoupUSDT");

  const lusdtAddress = lusdt.target;

  console.log(`LifeEstateFactory deployed to:, ${lifeEstateFactory.target}`);

  const lifeEstateMarketPlace = await ethers.deployContract(
    "LifeEstateMarketPlace",
    [lifeEstateFactory.target]
  );

  await lifeEstateMarketPlace.waitForDeployment();

  console.log(
    `LifeEstateMarketPlace deployed to:, ${lifeEstateMarketPlace.target},
      LUSDT address is ${lusdtAddress}`
  );
  //Hardhat :
  console.log(`Deployement Admin Address : ${accounts[0].address}`);
  console.log(`Buyer Address : ${accounts[1].address}`);

  //Testnet Sepolia :
  console.log(
    `Deployement Admin Address : ${accounts[0].address}(METAMASK ACCOUNT 1)`
  );

  console.log(
    `Buyer Address : 0x28588549098DB4ef87A21Dc85DCA159487778f8E (METAMASK ACCOUNT 2)`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

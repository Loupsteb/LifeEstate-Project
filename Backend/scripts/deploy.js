const hre = require("hardhat");

async function main() {
  const accounts = await ethers.getSigners();

  const lifeEstateFactory = await hre.ethers.deployContract(
    "LifeEstateFactory"
  );

  await lifeEstateFactory.waitForDeployment();

  await lifeEstateFactory.connect(accounts[0]);

  // const addressLifeEstateDeploy = await lifeEstateFactory.deployLifeEstate(
  //   "Chez Jojo",
  //   1500000,
  //   650,
  //   10,
  //   4,
  //   "Sete",
  //   true,
  //   true,
  //   true,
  //   "https://www.google.com"
  // );

  const lusdt = await hre.ethers.deployContract("LoupUSDT");
  // const lusdt = await LUSDT.deploy();

  await lusdt.waitForDeployment();

  const lusdtAddress = lusdt.target;

  // const addressArray = await lifeEstateFactory.getAllLifeEstate();

  // const addressArrayLength = addressArray.length;

  // const lastArrayAddress = await addressArray[addressArrayLength - 1];

  // await lifeEstateFactory.initLifeEstateParts(
  //   lastArrayAddress,
  //   [10, 8, 4, 4, 4, 0, 0, 0, 0, 0, 0],
  //   [444, 10, 22, 55, 8, 0, 0, 0, 0, 0, 0]
  // );
  console.log(`LifeEstateFactory deployed to:, ${lifeEstateFactory.target}`);

  const lifeEstateMarketPlace = await hre.ethers.deployContract(
    "LifeEstateMarketPlace",
    [lifeEstateFactory.target]
  );

  await lifeEstateMarketPlace.waitForDeployment();

  console.log(
    `LifeEstateMarketPlace deployed to:, ${lifeEstateMarketPlace.target},
    LUSDT address is ${lusdtAddress}`
  );
  //Hardhat :
  console.log(`Deployement Admin Address : ${accounts[0]}`);

  console.log(`Buyer Address : ${accounts[1]}`);

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

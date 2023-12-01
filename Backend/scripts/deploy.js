const hre = require("hardhat");

async function main() {
  const accounts = await ethers.getSigners();

  const lifeEstateFactory = await hre.ethers.deployContract(
    "LifeEstateFactory"
  );

  await lifeEstateFactory.waitForDeployment();

  await lifeEstateFactory.connect(accounts[0]);

  const addressLifeEstateDeploy = await lifeEstateFactory.deployLifeEstate(
    "Chez Jojo",
    1500000,
    650,
    10,
    4,
    "Sete",
    "France",
    true,
    true,
    true,
    "https://www.google.com"
  );

  const addressArray = await lifeEstateFactory.getAllLifeEstate();

  const addressArrayLength = addressArray.length;

  const lastArrayAddress = await addressArray[addressArrayLength - 1];

  await lifeEstateFactory.initLifeEstateParts(
    lastArrayAddress,
    [10, 8, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [444, 10, 22, 55, 8, 0, 0, 0, 0, 0, 0]
  );
  console.log(`LifeEstateFactory deployed to:, ${lifeEstateFactory.target}`);

  const lifeEstateMarketPlace = await hre.ethers.deployContract(
    "LifeEstateMarketPlace",
    [lifeEstateFactory.target]
  );

  await lifeEstateMarketPlace.waitForDeployment();

  console.log(
    `LifeEstateMarketPlace deployed to:, ${lifeEstateMarketPlace.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

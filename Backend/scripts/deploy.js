const hre = require("hardhat");

async function main() {
  const LifeEstate = await hre.ethers.getContractFactory("LifeEstate");
  const lifeEstate = await LifeEstate.deploy();
  await lifeEstate.deployed();
  // Une fois le contrat déployé, cette ligne imprime dans la console l'adresse du contrat déployé.
  console.log(`LifeEstate deployed to ${lifeEstate.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

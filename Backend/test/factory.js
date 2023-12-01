const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const helpers = require("@nomicfoundation/hardhat-network-helpers");

const { expect } = require("chai");

const { ethers } = require("hardhat");

async function deployLifeEstateFactory() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const lifeEstateFactory = await hre.ethers.deployContract(
    "LifeEstateFactory"
  );

  await lifeEstateFactory.waitForDeployment();

  await lifeEstateFactory.connect(owner);

  await lifeEstateFactory.deployLifeEstate(
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

  await lifeEstateFactory.initLifeEstateParts(
    lifeEstateFactory.address,
    [10, 8, 4, 4, 4, 0, 0, 0, 0, 0],
    [444, 10, 22, 55, 8, 0, 0, 0, 0, 0]
  );

  return lifeEstateFactory;
}

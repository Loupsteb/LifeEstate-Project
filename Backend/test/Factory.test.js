const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const helpers = require("@nomicfoundation/hardhat-network-helpers");

const { expect } = require("chai");
const { ethers } = require("hardhat");

async function deployContract() {
  const [owner] = await ethers.getSigners();

  const LifeEstateFactory = await ethers.getContractFactory(
    "LifeEstateFactory"
  );
  const lifeEstateFactory = await LifeEstateFactory.deploy();

  return {
    owner,
    LifeEstateFactory,
    lifeEstateFactory,
  };
}

describe("LifeEstateFactory", function () {
  it("should set the right owner", async function () {
    const { lifeEstateFactory, owner } = await deployContract();

    expect(await lifeEstateFactory.owner()).to.equal(owner.address);
  });

  describe("deployLifeEstate", function () {
    it("should deploy a LifeEstate contract", async function () {
      const { lifeEstateFactory } = await deployContract();

      const tx = await lifeEstateFactory.deployLifeEstate(
        "Chez Jojo",
        1500000,
        650,
        10,
        4,
        "Sete",
        // "France",
        true,
        true,
        true,
        "https://www.google.com"
      );

      // Attendre que la transaction soit minée
      await tx.wait();

      const addressArray = await lifeEstateFactory.getAllLifeEstate();
      expect(addressArray.length).to.be.greaterThan(0);

      const lastArrayAddress = addressArray[addressArray.length - 1];
      // Vérifie si l'adresse est une adresse Ethereum valide
      expect(lastArrayAddress).to.properAddress;
    });
  });

  //test the function initLifeEstateParts
  describe("initLifeEstateParts", function () {
    it("should set _partTotalSupplies and _partPrices to the right values", async function () {
      const { lifeEstateFactory, LifeEstateNFT } = await deployContract();

      // const LifeEstateNFT = await ethers.getContractFactory("LifeEstateNFT");

      // const lifeEstateNFT = await LifeEstateNFT.deploy();

      const tx = await lifeEstateFactory.deployLifeEstate(
        "Chez Jojo",
        1500000,
        650,
        10,
        4,
        "Sete",
        // "France",
        true,
        true,
        true,
        "https://www.google.com"
      );

      await tx.wait();

      const nftAddress = await lifeEstateFactory.getOneLifeEstate(0);

      console.log(nftAddress);

      const nftDeploy = await ethers.getContractAt("LifeEstateNFT", nftAddress);

      await lifeEstateFactory.initLifeEstateParts(
        nftAddress,
        [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
      );

      const partStruc = await nftDeploy.getEstateShare(0);
      console.log(partStruc);

      expect(parseInt(partStruc.mintSupply.toString(), 10)).to.equal(10);
      expect(parseInt(partStruc.totalSupply.toString(), 10)).to.equal(10);
      expect(parseInt(partStruc.circulatingSupply.toString(), 10)).to.equal(0);
      expect(parseInt(partStruc.price.toString(), 10)).to.equal(100);
    });
  });
  describe("getAllLifeEstate", function () {
    it("should return an array of addresses", async function () {
      const { lifeEstateFactory } = await deployContract();

      const tx = await lifeEstateFactory.deployLifeEstate(
        "Chez Jojo",
        1500000,
        650,
        10,
        4,
        "Sete",
        // "France",
        true,
        true,
        true,
        "https://www.google.com"
      );

      const tx2 = await lifeEstateFactory.deployLifeEstate(
        "Chez Gege",
        1700000,
        700,
        10,
        4,
        "Sete",
        // "France",
        true,
        true,
        false,
        "https://www.google.com"
      );

      // Attendre que la transaction soit minée
      await tx.wait();
      await tx2.wait();

      const addressArray = await lifeEstateFactory.getAllLifeEstate();
      expect(addressArray.length).to.be.equal(2);
    });
  });

  //test the function getOneLifeEstate
  describe("getOneLifeEstate", function () {
    it("should revert if _index is greater or equal to length of LifeEstateAddresses", async function () {
      const { lifeEstateFactory } = await deployContract();

      const tx = await lifeEstateFactory.deployLifeEstate(
        "Chez Jojo",
        1500000,
        650,
        10,
        4,
        "Sete",
        // "France",
        true,
        true,
        true,
        "https://www.google.com"
      );

      // Attendre que la transaction soit minée
      await tx.wait();

      await expect(lifeEstateFactory.getOneLifeEstate(1)).to.be.revertedWith(
        "Index out of bounds"
      );
    });
    it("should return the address of the last deploy NFT", async function () {
      const { lifeEstateFactory } = await deployContract();

      const tx = await lifeEstateFactory.deployLifeEstate(
        "Chez Jojo",
        1500000,
        650,
        10,
        4,
        "Sete",
        // "France",
        true,
        true,
        true,
        "https://www.google.com"
      );

      // Attendre que la transaction soit minée
      await tx.wait();

      const address = await lifeEstateFactory.getOneLifeEstate(0);

      const LifeEstateNFT = await ethers.getContractAt(
        "LifeEstateNFT",
        address
      );

      const estateSpecs = await LifeEstateNFT.getEstateSpecs();

      const propertyName = await estateSpecs.propertyName;

      expect(address).to.properAddress;
      expect(propertyName).to.equal("Chez Jojo");
    });
  });
});

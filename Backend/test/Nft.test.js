const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Fonctions fot the fixture to deploy all contracts necessary for the test
async function deployAllContracts() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  // Deploy LifeEstateFactory
  const LifeEstateFactory = await ethers.getContractFactory(
    "LifeEstateFactory"
  );
  const lifeEstateFactory = await LifeEstateFactory.deploy();

  // Deploy LifeEstateMarketPlace
  const LifeEstateMarketPlace = await ethers.getContractFactory(
    "LifeEstateMarketPlace"
  );
  const lifeEstateMarketPlace = await LifeEstateMarketPlace.deploy(
    lifeEstateFactory.target
  );

  //Set the correct value for an LifeEstate property
  const propertyName = "Chez Maurice";
  const marketPrice = 1000000;
  const propertySurfaceInSquareMeters = 100;
  const rooms = 5;
  const bedRooms = 3;
  const cityLocation = "Saint-Malo";
  // const countryLocation = "France";
  const pool = true;
  const garage = true;
  const garden = true;
  const uri = "https://example.com/nft";

  // Deploy LifeEstateNFT
  const LifeEstateNFT = await ethers.getContractFactory("LifeEstateNFT");
  const lifeEstateNFT = await LifeEstateNFT.deploy(
    propertyName,
    marketPrice,
    propertySurfaceInSquareMeters,
    rooms,
    bedRooms,
    cityLocation,
    // countryLocation,
    pool,
    garage,
    garden,
    uri
  );

  // Deploy LUSDT
  const LUSDT = await ethers.getContractFactory("LoupUSDT");
  const lusdt = await LUSDT.deploy();

  return {
    owner,
    addr1,
    addr2,
    lifeEstateFactory,
    lifeEstateMarketPlace,
    LifeEstateNFT,
    lifeEstateNFT,
    lusdt,
  };
}

async function deployAllContractsWithAlifeEstate() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  // Deploy LifeEstateFactory
  const LifeEstateFactory = await ethers.getContractFactory(
    "LifeEstateFactory"
  );
  const lifeEstateFactory = await LifeEstateFactory.deploy();

  // Deploy LifeEstateMarketPlace
  const LifeEstateMarketPlace = await ethers.getContractFactory(
    "LifeEstateMarketPlace"
  );
  const lifeEstateMarketPlace = await LifeEstateMarketPlace.deploy(
    lifeEstateFactory.target
  );

  //Set the correct value for an LifeEstate property
  const propertyName = "Chez Maurice";
  const marketPrice = 1000000;
  const propertySurfaceInSquareMeters = 100;
  const rooms = 5;
  const bedRooms = 3;
  const cityLocation = "Saint-Malo";
  // const countryLocation = "France";
  const pool = true;
  const garage = true;
  const garden = true;
  const uri = "https://example.com/nft";

  // Deploy LifeEstateNFT
  const LifeEstateNFT = await ethers.getContractFactory("LifeEstateNFT");
  const lifeEstateNFT = await LifeEstateNFT.deploy(
    propertyName,
    marketPrice,
    propertySurfaceInSquareMeters,
    rooms,
    bedRooms,
    cityLocation,
    // countryLocation,
    pool,
    garage,
    garden,
    uri
  );

  // Deploy LUSDT
  const LUSDT = await ethers.getContractFactory("LoupUSDT");
  const lusdt = await LUSDT.deploy();

  const partSupplies = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  const partPrices = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

  await lifeEstateNFT.setPartDetails(partSupplies, partPrices);

  return {
    owner,
    addr1,
    addr2,
    lifeEstateFactory,
    lifeEstateMarketPlace,
    lifeEstateNFT,
    lusdt,
  };
}

describe("deploy NFT constructor", function () {
  it("should set value of estateSpecs with the params as in deployAllContract", async function () {
    const { lifeEstateNFT } = await loadFixture(deployAllContracts);
    const estateSpecs = await lifeEstateNFT.getEstateSpecs();

    expect(estateSpecs.propertyName).to.equal("Chez Maurice");
    expect(estateSpecs.marketPrice).to.equal(1000000);
    expect(estateSpecs.propertySurfaceInSquareMeters).to.equal(100);
    expect(estateSpecs.rooms).to.equal(5);
    expect(estateSpecs.bedRooms).to.equal(3);
    expect(estateSpecs.cityLocation).to.equal("Saint-Malo");
    // expect(estateSpecs.countryLocation).to.equal("France");
    expect(estateSpecs.pool).to.equal(true);
    expect(estateSpecs.garage).to.equal(true);
    expect(estateSpecs.garden).to.equal(true);
    expect(estateSpecs.uri).to.equal("https://example.com/nft");
  });
});

describe("transferOwnership", function () {
  it("should revert if the caller is not the owner", async function () {
    const { LifeEstateNFT, lifeEstateNFT, addr1 } = await loadFixture(
      deployAllContracts
    );

    await expect(
      lifeEstateNFT.connect(addr1).transferOwnership(addr1.address)
    ).to.be.revertedWithCustomError(
      LifeEstateNFT,
      "OwnableUnauthorizedAccount"
    );
  });
  it("should set the new owner at the owner of the nft", async function () {
    const { LifeEstateNFT, lifeEstateNFT, owner, addr1 } = await loadFixture(
      deployAllContracts
    );

    await lifeEstateNFT.connect(owner).transferOwnership(addr1.address);

    expect(await lifeEstateNFT.owner()).to.equal(addr1.address);
  });
});

describe("setPartDetails", function () {
  it("should revert if initialized is already true", async function () {
    const { lifeEstateNFT, owner } = await loadFixture(deployAllContracts);

    await lifeEstateNFT
      .connect(owner)
      .setPartDetails(
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
      );

    await expect(
      lifeEstateNFT
        .connect(owner)
        .setPartDetails(
          [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
        )
    ).to.be.revertedWith("Parts are already initialized");
  });
  it("should revert if the length the _partTotalSypplies array is not equal to the _partPrices length array", async function () {
    const { lifeEstateNFT, owner } = await loadFixture(deployAllContracts);

    await expect(
      lifeEstateNFT.connect(owner).setPartDetails([100], [100, 100])
    );
  });
  it("should revert if the length of the _partPrices array is not equal to 11", async function () {
    const { lifeEstateNFT, owner } = await loadFixture(deployAllContracts);

    await expect(
      lifeEstateNFT.connect(owner).setPartDetails([100, 100], [100, 100])
    );
  });

  it("should set initialized value at true", async function () {
    const { lifeEstateNFT, owner } = await loadFixture(deployAllContracts);

    await lifeEstateNFT
      .connect(owner)
      .setPartDetails(
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
      );

    expect(await lifeEstateNFT.initialized()).to.equal(true);
  });
  it("should set parts[i].mintSupply is equal to _partTotalSupplies[i]", async function () {
    const { lifeEstateNFT, owner } = await loadFixture(deployAllContracts);

    await lifeEstateNFT
      .connect(owner)
      .setPartDetails(
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
      );

    const parts = await lifeEstateNFT.parts(0);
    expect(parts.mintSupply).to.equal(100);
  });
  it("should set parts[i].totalSupply is equal to _partTotalSupplies[i]", async function () {
    const { lifeEstateNFT, owner } = await loadFixture(deployAllContracts);

    await lifeEstateNFT
      .connect(owner)
      .setPartDetails(
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
      );

    const parts = await lifeEstateNFT.parts(0);
    expect(parts.totalSupply).to.equal(100);
  });
  it("should set parts[i].price is equal to _partPrices[i]", async function () {
    const { lifeEstateNFT, owner } = await loadFixture(deployAllContracts);

    await lifeEstateNFT
      .connect(owner)
      .setPartDetails(
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
      );

    const parts = await lifeEstateNFT.parts(0);
    expect(parts.price).to.equal(100);
  });
  it("should emit the PartSet(i, _partTotalSupplies[i], _partPrices[i]) Event", async function () {
    const { lifeEstateNFT, owner } = await loadFixture(deployAllContracts);

    await expect(
      lifeEstateNFT
        .connect(owner)
        .setPartDetails(
          [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
        )
    )
      .to.emit(lifeEstateNFT, "PartSet")
      .withArgs(0, 100, 100);
  });
});

describe("getEstateShare", async function () {
  it("should return parts[0]", async function () {
    const { lifeEstateNFT, owner } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const partId = 0; // Assuming you want to test the part with ID 0
    const parts = await lifeEstateNFT.getEstateShare(partId);

    expect(parts.mintSupply).to.equal(100);
    expect(parts.totalSupply).to.equal(100);
    expect(parts.price).to.equal(100);
  });
});

describe("getEstateSpecs", async function () {
  it("should return estateSpecs", async function () {
    const { lifeEstateNFT, owner } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const partId = 0; // Assuming you want to test the part with ID 0
    const parts = await lifeEstateNFT.getEstateShare(partId);

    expect(parts.mintSupply).to.equal(100);
    expect(parts.totalSupply).to.equal(100);
    expect(parts.price).to.equal(100);
  });
});

describe("setApprovedTokens", async function () {
  it("should revert if the caller is not the owner", async function () {
    const { lifeEstateNFT, lusdt, addr1 } = await loadFixture(
      deployAllContracts
    );

    const lusdtAddress = lusdt.target;

    await expect(
      lifeEstateNFT.connect(addr1).setApprovedTokens([lusdtAddress], true)
    ).to.be.reverted;
  });
  it("should set tokenAddress on the approvedTokens array on the same value than the parameter of the fuction", async function () {
    const { lifeEstateNFT, lusdt, owner } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;

    await lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);

    expect(await lifeEstateNFT.approvedTokens(lusdtAddress)).to.equal(true);
  });
  it("should push token address in approvedTokenArray", async function () {
    const { lifeEstateNFT, lusdt, owner } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;
    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

    await lifeEstateNFT
      .connect(owner)
      .setApprovedTokens([lusdtAddress, daiAddress], true);

    expect(await lifeEstateNFT.approvedTokens(daiAddress)).to.equal(true);
  });
});

describe("mintBuyToken", async function () {
  it("should revert if the tokenAddress is not on the approvedTokens array", async function () {
    const { lifeEstateNFT, lusdt, owner } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;

    await expect(
      lifeEstateNFT.connect(owner).mintBuyToken(0, 1, lusdt.target)
    ).to.be.revertedWith("Token not approved");
  });
  it("should revert if the mintSupply is less than amount", async function () {
    const { lifeEstateNFT, lusdt, owner } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;

    lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);

    await expect(
      lifeEstateNFT.connect(owner).mintBuyToken(0, 101, lusdtAddress)
    ).to.be.revertedWith("Not enough supply");
  });
  it("should revert if the token balance of the caller is less than the totalPrice", async function () {
    const { lifeEstateNFT, lusdt, owner, addr1 } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;

    lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);

    await expect(
      lifeEstateNFT.connect(addr1).mintBuyToken(0, 100, lusdtAddress)
    ).to.be.revertedWith("Not enough token balance");
  });
  it("should transfert the erc20 amount of msg.sender to the address of seller", async function () {
    const { lifeEstateNFT, lusdt, owner, addr1 } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;

    lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);

    await lusdt.connect(owner).transfer(addr1, 1000000);

    await lusdt.connect(addr1).approve(lifeEstateNFT.target, 1000000);

    const NFTBalanceBefore = await lusdt.balanceOf(lifeEstateNFT.target);
    const NFTBalanceBeforeasNumber = parseInt(NFTBalanceBefore.toString(), 10);

    await lifeEstateNFT.connect(addr1).mintBuyToken(0, 100, lusdtAddress);

    const NftBalanceAfter = await lusdt.balanceOf(lifeEstateNFT.target);
    const NFTBalanceAfterasNumber = parseInt(NftBalanceAfter.toString(), 10);

    const differenceBalance =
      NFTBalanceAfterasNumber - NFTBalanceBeforeasNumber;

    const amountTransfert = 100 * 100;

    expect(differenceBalance).to.equal(amountTransfert);
  });
  it("should decrement the mintSupply of the part", async function () {
    const { lifeEstateNFT, lusdt, owner, addr1 } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;

    lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);

    await lusdt.connect(owner).transfer(addr1, 1000000);

    await lusdt.connect(addr1).approve(lifeEstateNFT.target, 1000000);

    await lifeEstateNFT.connect(addr1).mintBuyToken(0, 100, lusdtAddress);

    const part = await lifeEstateNFT.parts(0);

    expect(part.mintSupply).to.equal(0);
  });
  it("should increment the ciruculatingSupply of the part", async function () {
    const { lifeEstateNFT, lusdt, owner, addr1 } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;

    lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);

    await lusdt.connect(owner).transfer(addr1, 1000000);

    await lusdt.connect(addr1).approve(lifeEstateNFT.target, 1000000);

    await lifeEstateNFT.connect(addr1).mintBuyToken(0, 100, lusdtAddress);

    const part = await lifeEstateNFT.parts(0);

    expect(part.circulatingSupply).to.equal(100);
  });
  it("should emit the PartsMinted event", async function () {
    const { lifeEstateNFT, lusdt, owner, addr1 } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;

    lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);

    await lusdt.connect(owner).transfer(addr1, 1000000);

    await lusdt.connect(addr1).approve(lifeEstateNFT.target, 1000000);

    await expect(
      lifeEstateNFT.connect(addr1).mintBuyToken(0, 100, lusdtAddress)
    )
      .to.emit(lifeEstateNFT, "PartMinted")
      .withArgs(addr1.address, 0, 100);
  });
});

describe("buyMultipleMintTokens", async function () {
  it("should revert if the tokenAddress is not on the approvedTokens array", async function () {
    const { lifeEstateNFT, lusdt, owner } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;

    await expect(
      lifeEstateNFT.connect(owner).buyMultipleMintTokens([0], [1], lusdt.target)
    ).to.be.revertedWith("Token not approved");
  });
  it("should revert if the mintSupply is less than amount", async function () {
    const { lifeEstateNFT, lusdt, owner } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;

    lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);

    await expect(
      lifeEstateNFT
        .connect(owner)
        .buyMultipleMintTokens([0], [101], lusdtAddress)
    ).to.be.revertedWith("Not enough supply for a part");
  });
  it("should revert if the token balance of the caller is less than the totalPrice", async function () {
    const { lifeEstateNFT, lusdt, owner, addr1 } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;

    lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);

    await expect(
      lifeEstateNFT
        .connect(addr1)
        .buyMultipleMintTokens([0], [100], lusdtAddress)
    ).to.be.revertedWith("Not enough token balance");
  });
  it("should set correctly the balance of the buyer and the seller after the token transfer", async function () {
    const { lifeEstateNFT, lusdt, owner, addr1 } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;

    lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);
    await lusdt.connect(owner).transfer(addr1, 2000000);
    await lusdt.connect(addr1).approve(lifeEstateNFT.target, 2000000);

    const NFTBalanceBefore = await lusdt.balanceOf(lifeEstateNFT.target);
    const NFTBalanceBeforeasNumber = parseInt(NFTBalanceBefore.toString(), 10);

    await lifeEstateNFT
      .connect(addr1)
      .buyMultipleMintTokens([0, 1], [100, 100], lusdtAddress);

    const NftBalanceAfter = await lusdt.balanceOf(lifeEstateNFT.target);
    const NFTBalanceAfterasNumber = parseInt(NftBalanceAfter.toString(), 10);

    const differenceBalance =
      NFTBalanceAfterasNumber - NFTBalanceBeforeasNumber;

    const amountTransfert = 2 * 100 * 100;

    expect(differenceBalance).to.equal(amountTransfert);
  });
  it("should decrement the mintSupply of the parts", async function () {
    const { lifeEstateNFT, lusdt, owner, addr1 } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );

    const lusdtAddress = lusdt.target;

    lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);
    await lusdt.connect(owner).transfer(addr1, 2000000);
    await lusdt.connect(addr1).approve(lifeEstateNFT.target, 2000000);

    await lifeEstateNFT
      .connect(addr1)
      .buyMultipleMintTokens([0, 1], [100, 100], lusdtAddress);

    const part0 = await lifeEstateNFT.parts(0);
    const part1 = await lifeEstateNFT.parts(1);

    expect(part0.mintSupply).to.equal(0);
    expect(part1.mintSupply).to.equal(0);
  });
  it("should increment the ciruculatingSupply of the parts", async function () {
    const { lifeEstateNFT, lusdt, owner, addr1 } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );
    const lusdtAddress = lusdt.target;

    lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);
    await lusdt.connect(owner).transfer(addr1, 2000000);
    await lusdt.connect(addr1).approve(lifeEstateNFT.target, 2000000);

    await lifeEstateNFT
      .connect(addr1)
      .buyMultipleMintTokens([0, 1], [100, 100], lusdtAddress);

    const part0 = await lifeEstateNFT.parts(0);
    const part1 = await lifeEstateNFT.parts(1);

    expect(part0.circulatingSupply).to.equal(100);
    expect(part1.circulatingSupply).to.equal(100);
  });
  // it("should emit the PartsMinted event", async function () {
  //   const { lifeEstateNFT, lusdt, owner, addr1 } = await loadFixture(
  //     deployAllContractsWithAlifeEstate
  //   );
  //   const lusdtAddress = lusdt.target;

  //   lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);
  //   await lusdt.connect(owner).transfer(addr1, 2000000);
  //   await lusdt.connect(addr1).approve(lifeEstateNFT.target, 2000000);

  //   const encodedTokens = ethers.utils.solidityKeccak256(
  //     ["uint256", "uint256", "uint256", "uint256"],
  //     [0, 100, 1, 100]
  //   );

  //   console.log(encodedTokens);

  //   await expect(
  //     lifeEstateNFT
  //       .connect(addr1)
  //       .buyMultipleMintTokens([0, 1], [100, 100], lusdtAddress)
  //   )
  //     .to.emit(lifeEstateNFT, "PartsMinted")
  //     .withArgs(addr1.address, encodedTokens);
  // });
});

describe("withdrawERC20", async function () {
  it("should revert if the caller is not the owner", async function () {
    const { lifeEstateNFT, lusdt, owner, addr1 } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );
    const lusdtAddress = lusdt.target;

    await expect(
      lifeEstateNFT.connect(addr1).withdrawERC20(lusdtAddress)
    ).to.be.revertedWithCustomError(
      lifeEstateNFT,
      "OwnableUnauthorizedAccount"
    );
  });
  it("should correctly transfer the token balance to the owner", async function () {
    const { lifeEstateNFT, lusdt, owner, addr1 } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );
    const lusdtAddress = lusdt.target;

    const initialOwnerBalance = await lusdt.balanceOf(owner.address);

    await lusdt.connect(owner).transfer(lifeEstateNFT.target, 1000000);

    const initialOwnerBalanceAfterTransfert = await lusdt.balanceOf(
      owner.address
    );

    const lifeEstateNFTBalance = await lusdt.balanceOf(lifeEstateNFT.target);

    const OwnerBeforeWithdraw = await lusdt.balanceOf(owner.address);

    await lifeEstateNFT.connect(owner).withdrawERC20(lusdtAddress);

    const OwnerBalanceAfterWithdraw = await lusdt.balanceOf(owner.address);

    const LifeEstateNftBalanceAfter = await lusdt.balanceOf(
      lifeEstateNFT.target
    );

    const differenceBalance = OwnerBalanceAfterWithdraw - OwnerBeforeWithdraw;

    const amountTransfert = 1000000;

    expect(differenceBalance).to.equal(lifeEstateNFTBalance);
  });
  it("should emit the ERC20Withdrawn event", async function () {
    const { lifeEstateNFT, lusdt, owner, addr1 } = await loadFixture(
      deployAllContractsWithAlifeEstate
    );
    const lusdtAddress = lusdt.target;

    const initialOwnerBalance = await lusdt.balanceOf(owner.address);

    await lusdt.connect(owner).transfer(lifeEstateNFT.target, 1000000);

    const initialOwnerBalanceAfterTransfert = await lusdt.balanceOf(
      owner.address
    );

    const lifeEstateNFTBalance = await lusdt.balanceOf(lifeEstateNFT.target);

    const OwnerBeforeWithdraw = await lusdt.balanceOf(owner.address);

    await expect(
      lifeEstateNFT.connect(owner).withdrawERC20(lusdtAddress)
    ).to.emit(lifeEstateNFT, "ERC20Withdrawn");
  });
});

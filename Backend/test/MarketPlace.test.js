const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Fonctions fot the fixture to deploy all contracts necessary for the test
async function deployAllContracts() {
  const [owner, addr1, addr2, addr3] = await ethers.getSigners();

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

  //set the part details with the appropriate function
  const partSupplies = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  const partPrices = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

  await lifeEstateNFT.setPartDetails(partSupplies, partPrices);

  // Deploy LUSDT
  const LUSDT = await ethers.getContractFactory("LoupUSDT");
  const lusdt = await LUSDT.deploy();

  return {
    owner,
    addr1,
    addr2,
    addr3,
    lifeEstateFactory,
    lifeEstateMarketPlace,
    lifeEstateNFT,
    lusdt,
  };
}

describe("LifeEstateMarketPlace", function () {
  // Utilisation de la fixture dans le test
  it("should set the right owner", async function () {
    const { lifeEstateMarketPlace, owner } = await loadFixture(
      deployAllContracts
    );
    expect(await lifeEstateMarketPlace.owner()).to.equal(owner.address);
  });

  // Autres tests...
});

describe("listToken", function () {
  it("should revert if MarketPlace is not approved", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT } = await loadFixture(
      deployAllContracts
    );

    await expect(
      lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target)
    ).to.be.revertedWith("Marketplace needs approval to manage tokens");
  });

  it("should revert if seller balance is not enough", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, owner } = await loadFixture(
      deployAllContracts
    );
    await lifeEstateNFT.setApprovalForAll(lifeEstateMarketPlace.target, true);

    await expect(
      lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target)
    ).to.be.revertedWith("Not enough tokens owned to list");
  });

  it("should increment listingCounter", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner } =
      await loadFixture(deployAllContracts);

    const listingCounterBefore = await lifeEstateMarketPlace.listingCounter();
    const listingCounterBeforeAsNumber = parseInt(
      listingCounterBefore.toString(),
      10
    );

    const tokenAmount = 500;

    await lusdt.connect(owner).approve(lifeEstateNFT.target, tokenAmount);
    await lifeEstateNFT.setApprovedTokens([lusdt.target], true);
    await lifeEstateNFT.setApprovalForAll(lifeEstateMarketPlace.target, true);
    await lifeEstateNFT.mintBuyToken(0, 2, lusdt.target);

    await lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target);

    const listingCounterAfter = await lifeEstateMarketPlace.listingCounter();
    const listingCounterAfterAsNumber = parseInt(
      listingCounterAfter.toString(),
      10
    );

    //expect the listingCounter to be incremented by 1
    expect(listingCounterAfterAsNumber).to.be.above(
      listingCounterBeforeAsNumber
    );
  });
  it("should add new listing to listings with the right values", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner } =
      await loadFixture(deployAllContracts);

    const tokenAmount = 500;

    await lusdt.connect(owner).approve(lifeEstateNFT.target, tokenAmount);
    await lifeEstateNFT.setApprovedTokens([lusdt.target], true);
    await lifeEstateNFT.setApprovalForAll(lifeEstateMarketPlace.target, true);
    await lifeEstateNFT.mintBuyToken(0, 2, lusdt.target);

    await lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target);

    const listing = await lifeEstateMarketPlace.listings(0);

    const tokenIdAsNumber = parseInt(listing.tokenId.toString(), 10);
    const listingPriceAsNumber = parseInt(listing.price.toString(), 10);
    const listingAmountAsNumber = parseInt(listing.amount.toString(), 10);

    expect(tokenIdAsNumber).to.equal(0);
    expect(listingAmountAsNumber).to.equal(2);
    expect(listingPriceAsNumber).to.equal(100);
    expect(listing.newLifeEstate).to.equal(lifeEstateNFT.target);
  });

  it("emit a TokenListingCreated event", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner } =
      await loadFixture(deployAllContracts);

    const tokenAmount = 500;

    await lusdt.connect(owner).approve(lifeEstateNFT.target, tokenAmount);
    await lifeEstateNFT.setApprovedTokens([lusdt.target], true);
    await lifeEstateNFT.setApprovalForAll(lifeEstateMarketPlace.target, true);
    await lifeEstateNFT.mintBuyToken(0, 2, lusdt.target);

    await expect(
      lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target)
    )
      .to.emit(lifeEstateMarketPlace, "TokenListingCreated")
      .withArgs(0, 2, 100);
  });
});

describe("buyListedToken", function () {
  //listindId its id of listings qui sera affiché dans le front
  //tokemAddress est l'address d'une [approveToken] (ERC20 Token)
  it("should revert if listingId is not valid", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner } =
      await loadFixture(deployAllContracts);

    const tokenAmount = 200;

    await lusdt.connect(owner).approve(lifeEstateNFT.target, tokenAmount);
    await lifeEstateNFT.setApprovedTokens([lusdt.target], true);
    await lifeEstateNFT.setApprovalForAll(lifeEstateMarketPlace.target, true);
    await lifeEstateNFT.mintBuyToken(0, 2, lusdt.target);

    lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target);

    expect(
      lifeEstateMarketPlace.buyListedToken(2, lusdt.target)
    ).to.be.revertedWith("Token not listed for sale");
  });
  it("should revert if the buyer balance is not enough", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner, addr1 } =
      await loadFixture(deployAllContracts);

    const tokenAmount = 200;

    await lusdt.connect(owner).approve(lifeEstateNFT.target, tokenAmount);
    await lifeEstateNFT.setApprovedTokens([lusdt.target], true);
    await lifeEstateNFT.setApprovalForAll(lifeEstateMarketPlace.target, true);
    await lifeEstateNFT.mintBuyToken(0, 2, lusdt.target);

    await lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target);

    await expect(
      lifeEstateMarketPlace.connect(addr1).buyListedToken(0, lusdt.target)
    ).to.be.revertedWith("Not enough token balance");
  });
  it("should revert if The seller do not have the same amount of token", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner, addr1, addr2 } =
      await loadFixture(deployAllContracts);

    const tokenAmount = 200;

    await lusdt.connect(owner).approve(lifeEstateNFT.target, tokenAmount);
    await lifeEstateNFT.setApprovedTokens([lusdt.target], true);
    await lifeEstateNFT.setApprovalForAll(lifeEstateMarketPlace.target, true);
    await lifeEstateNFT.mintBuyToken(0, 2, lusdt.target);

    await lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target);

    await lifeEstateNFT.safeTransferFrom(
      owner.address,
      addr2.address,
      0,
      2,
      "0x"
    );

    await expect(
      lifeEstateMarketPlace.connect(addr1).buyListedToken(0, lusdt.target)
    ).to.be.revertedWith("Not enough token balance");
  });

  it("should transfert from seller to msg.sender nft", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner, addr1 } =
      await loadFixture(deployAllContracts);

    const tokenAmount = 500;

    await lusdt.connect(owner).transfer(addr1.address, tokenAmount);

    await lusdt.connect(owner).approve(lifeEstateNFT.target, tokenAmount);
    await lifeEstateNFT.setApprovedTokens([lusdt.target], true);
    await lifeEstateNFT.setApprovalForAll(lifeEstateMarketPlace.target, true);
    await lusdt
      .connect(addr1)
      .approve(lifeEstateMarketPlace.target, tokenAmount);
    await lifeEstateNFT.mintBuyToken(0, 2, lusdt.target);

    await lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target);

    await lifeEstateMarketPlace.connect(addr1).buyListedToken(0, lusdt.target);

    expect(await lifeEstateNFT.balanceOf(addr1.address, 0)).to.equal(2);
  });
  it("should transfert the erc20 amount from msg.sender to seller", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner, addr1 } =
      await loadFixture(deployAllContracts);

    const tokenAmount = 500;

    await lusdt.connect(owner).transfer(addr1.address, tokenAmount);

    await lusdt.connect(owner).approve(lifeEstateNFT.target, tokenAmount);
    await lifeEstateNFT.setApprovedTokens([lusdt.target], true);
    await lifeEstateNFT.setApprovalForAll(lifeEstateMarketPlace.target, true);
    await lusdt
      .connect(addr1)
      .approve(lifeEstateMarketPlace.target, tokenAmount);
    await lifeEstateNFT.mintBuyToken(0, 2, lusdt.target);

    await lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target);

    await lifeEstateMarketPlace.connect(addr1).buyListedToken(0, lusdt.target);

    //the amount per sell is the total of the sell and no per token ( 5% are added fees)
    //395 = 500 - (100 + 5%)
    expect(await lusdt.balanceOf(addr1.address)).to.equal(395);
  });
  it("should delete the listed token from listings", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner, addr1 } =
      await loadFixture(deployAllContracts);

    const tokenAmount = 500;

    await lusdt.connect(owner).transfer(addr1.address, tokenAmount);

    await lusdt.connect(owner).approve(lifeEstateNFT.target, tokenAmount);
    await lifeEstateNFT.setApprovedTokens([lusdt.target], true);
    await lifeEstateNFT.setApprovalForAll(lifeEstateMarketPlace.target, true);
    await lusdt
      .connect(owner)
      .approve(lifeEstateMarketPlace.target, tokenAmount);
    await lifeEstateNFT.mintBuyToken(0, 2, lusdt.target);

    await lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target);

    await lusdt
      .connect(addr1)
      .approve(lifeEstateMarketPlace.target, tokenAmount);

    await lifeEstateNFT
      .connect(addr1)
      .setApprovalForAll(lifeEstateMarketPlace.target, true);

    await lifeEstateMarketPlace.connect(addr1).buyListedToken(0, lusdt.target);

    const structListing = await lifeEstateMarketPlace.listings(0);

    expect(structListing.tokenId).to.be.equal(0);
    expect(structListing.amount).to.be.equal(0);
    expect(structListing.price).to.be.equal(0);
    expect(structListing.active).to.be.equal(false);
  });
});
describe("cancelListing", function () {
  it("should revert if the canceler is not the owner of the listing", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner, addr1 } =
      await loadFixture(deployAllContracts);

    const tokenAmount = 500;

    await lusdt.connect(owner).transfer(addr1.address, tokenAmount);

    await lusdt.connect(owner).approve(lifeEstateNFT.target, tokenAmount);
    await lifeEstateNFT.setApprovedTokens([lusdt.target], true);

    await lifeEstateNFT.setApprovalForAll(lifeEstateMarketPlace.target, true);
    await lifeEstateNFT.mintBuyToken(0, 2, lusdt.target);

    await lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target);

    await expect(
      lifeEstateMarketPlace.connect(addr1).cancelListing(0)
    ).to.be.revertedWith("Only the seller can cancel a listing");
  });
  it("should set listing.active is false", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner } =
      await loadFixture(deployAllContracts);

    const tokenAmount = 500;

    await lusdt.connect(owner).approve(lifeEstateNFT.target, tokenAmount);
    await lifeEstateNFT.setApprovedTokens([lusdt.target], true);

    await lifeEstateNFT.setApprovalForAll(lifeEstateMarketPlace.target, true);
    await lifeEstateNFT.mintBuyToken(0, 2, lusdt.target);

    await lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target);

    await lifeEstateMarketPlace.cancelListing(0);

    const structListing = await lifeEstateMarketPlace.listings(0);

    expect(structListing.active).to.be.equal(false);
  });
  it("should emit TokenListingRemoved event", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner } =
      await loadFixture(deployAllContracts);

    const tokenAmount = 500;

    await lusdt.connect(owner).approve(lifeEstateNFT.target, tokenAmount);
    await lifeEstateNFT.setApprovedTokens([lusdt.target], true);

    await lifeEstateNFT.setApprovalForAll(lifeEstateMarketPlace.target, true);
    await lifeEstateNFT.mintBuyToken(0, 2, lusdt.target);

    await lifeEstateMarketPlace.listToken(0, 2, 100, lifeEstateNFT.target);

    await expect(lifeEstateMarketPlace.cancelListing(0))
      .to.emit(lifeEstateMarketPlace, "TokenListingRemoved")
      .withArgs(0);
  });
});
describe("setApprovedToken", function () {
  it("should revert if the caller is not the owner", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner, addr1 } =
      await loadFixture(deployAllContracts);

    await expect(
      lifeEstateMarketPlace.connect(addr1).setApprovedToken(lusdt.target)
    ).to.be.revertedWithCustomError(
      lifeEstateMarketPlace,
      "OwnableUnauthorizedAccount"
    );
  });
  it("should check tokenAddress is added to approvedTokens array", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner } =
      await loadFixture(deployAllContracts);

    await lifeEstateMarketPlace.setApprovedToken(lusdt.target);

    const approvedTokens = await lifeEstateMarketPlace.approvedTokens(0);

    expect(approvedTokens).to.be.equal(lusdt.target);
  });
});
describe("withdrawFunds", function () {
  it("should revert if the caller is not the owner", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner, addr1 } =
      await loadFixture(deployAllContracts);

    await expect(
      lifeEstateMarketPlace.connect(addr1).withdrawFunds()
    ).to.be.revertedWithCustomError(
      lifeEstateMarketPlace,
      "OwnableUnauthorizedAccount"
    );
  });
  it("should send all marketTokensBalance of approvedTokens to the owner", async function () {});
  it("should emit FundsWithdrawn event", async function () {
    const { lifeEstateMarketPlace, lifeEstateNFT, lusdt, owner } =
      await loadFixture(deployAllContracts);

    await lusdt.connect(owner).transfer(lifeEstateMarketPlace.target, 500);

    await lifeEstateMarketPlace.connect(owner).setApprovedToken(lusdt.target);

    const marketBalance = await lusdt.balanceOf(lifeEstateMarketPlace.target);

    console.log(marketBalance.toString());

    await expect(lifeEstateMarketPlace.connect(owner).withdrawFunds())
      .to.emit(lifeEstateMarketPlace, "FundsWithdrawn")
      .withArgs(owner.address, 500);
  });
});

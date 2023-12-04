const hre = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();

  //add the owner address
  const ownerAddress = owner.address;

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
    pool,
    garage,
    garden,
    uri
  );

  // Deploy LUSDT
  const LUSDT = await ethers.getContractFactory("LoupUSDT");
  const lusdt = await LUSDT.deploy();

  const lusdtAddress = lusdt.target;

  lifeEstateNFT.connect(owner).setApprovedTokens([lusdtAddress], true);

  // Necessary token amount for mint the token
  const tokenAmountToApproveAndTransfer = 10000;

  // Approve and transfer tokenAmountToApproveAndTransfer to LifeEstateNFT
  await lusdt
    .connect(owner)
    .approve(lifeEstateNFT.target, tokenAmountToApproveAndTransfer);

  const partSupplies = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  const partPrices = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

  await lifeEstateNFT.setPartDetails(partSupplies, partPrices);

  //call the mintBuyToken function from LifeEstateNFT with owner
  lifeEstateNFT.connect(owner).mintBuyToken(0, 100, lusdtAddress);

  //log the emit event PartMinted from LifeEstateNFT
  lifeEstateNFT.on("PartMinted", (ownerAddress, partId, amount) => {
    console.log(
      `PartMinted from OwnerAddress ${ownerAddress}, :partId ${partId}, amount ${amount}`
    );
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("owner", owner);
  const ownerAddress = owner.address;

  // const owner = await ethers.getSigners();
  // const LUSDT = await ethers.getContractFactory("LoupUSDT");
  // const lusdt = await LUSDT.deploy();
  const deployedLUSDTAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  // const lusdt = await ethers.getContractAt("LoupUSDT", deployedLUSDTAddress);

  const networkName = hre.network.name;
  console.log(`Vous êtes connecté au réseau : ${networkName}`);
  // await lusdt.waitForTransaction();
  // const LUSDT = await ethers.getContractFactory("LoupUSDT");
  // const lusdt = LUSDT.attach(deployedLUSDTAddress);
  // await lusdt.deploymentTransaction().wait(1);

  if (networkName === "sepolia") {
    //Acheteur Metamask à modifier
    const acheteurAddress = "0x28588549098DB4ef87A21Dc85DCA159487778f8E";

    const lusdt = await ethers.getContractAt("LoupUSDT", deployedLUSDTAddress);
    await lusdt.deploymentTransaction();
    console.log("LoupUSDT BUG ?:", lusdt);

    //pour le script sepolia
    //const lusdt = await ethers.getContractAt("LoupUSDT","adresse du contrat sous sepolia"");

    // const tokenAmount = 1 * 10 ** 18;
    //getconversion from 1 to wei ethers 1000
    const tokenAmount = 19999999999999999999999n;

    //const of the owner balance before transfer
    const ownerBalanceBefore = await lusdt.balanceOf(owner);
    console.log("J'AI FAIT UN BALANCE OF", ownerBalanceBefore);

    console.log("ACHETEUR ADDRESSE ", acheteurAddress);
    console.log("TOKEN AMOUNT", tokenAmount);

    //const of the addr1 balance before transfer
    const addr1BalanceBefore = await lusdt.balanceOf(acheteurAddress);

    await lusdt.transfer(acheteurAddress, tokenAmount);
    console.log("J'AI FAIT UN TRANSFER");
    // await lusdt.waitForTransaction();

    //const of the owner balance after transfer
    const ownerBalanceAfter = await lusdt.balanceOf(owner);

    //const of the addr1 balance after transfer
    const addr1BalanceAfter = await lusdt.balanceOf(acheteurAddress);

    console.log("owner.address", owner);

    console.log(
      `The owner balance before transfer is: ${ownerBalanceBefore} and after transfer is: ${ownerBalanceAfter}`
    );
    console.log("addr1.address", acheteurAddress);
    console.log(
      `The adrr1 balance before transfer is: ${addr1BalanceBefore} and after transfer is: ${addr1BalanceAfter}`
    );
    console.log(`The owner correcty transfer ${tokenAmount} LUSDT to addr1`);
  } else {
    //Acheteur Hardhat
    const acheteurAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

    console.log("Vous êtes connecté au réseau : ", networkName);

    // const lusdt = await hre.ethers.getContractAt(
    //   "LoupUSDT",
    //   deployedLUSDTAddress
    // );
    // const lusdt = LUSDT.target;

    const LUSDT = await ethers.getContractFactory("LoupUSDT");
    const lusdt = await LUSDT.deploy();

    console.log("LoupUSDT deployed to:", lusdt.target);
    console.log("lusdt", lusdt);
    // const lusdt = await LUSDT.deploy();

    //Reseau local test : hardhat
    // await lusdt.deploymentTransaction();

    //pour le script sepolia
    //const lusdt = await ethers.getContractAt("LoupUSDT","adresse du contrat sous sepolia"");

    // const tokenAmount = 1 * 10 ** 18;
    //getconversion from 1 to wei ethers 1000
    const tokenAmount = 19999999999999999999999n;

    //const of the owner balance before transfer
    console.log("owner ADRESSE", owner.address);
    console.log("LUST BUG?", lusdt);

    const ownerBalanceBefore = await lusdt.balanceOf(owner.address);

    console.log("J'AI FAIT UN BALANCE OF", ownerBalanceBefore);

    console.log("ACHETEUR ADDRESSE ", acheteurAddress);
    console.log("TOKEN AMOUNT", tokenAmount);

    //const of the addr1 balance before transfer
    const addr1BalanceBefore = await lusdt.balanceOf(acheteurAddress);

    await lusdt.transfer(acheteurAddress, tokenAmount);
    console.log("J'AI FAIT UN TRANSFER");
    // await lusdt.waitForTransaction();

    //const of the owner balance after transfer
    const ownerBalanceAfter = await lusdt.balanceOf(owner.address);

    //const of the addr1 balance after transfer
    const addr1BalanceAfter = await lusdt.balanceOf(acheteurAddress);

    console.log("owner.address", owner.address);

    console.log(
      `The owner balance before transfer is: ${ownerBalanceBefore} and after transfer is: ${ownerBalanceAfter}`
    );
    console.log("addr1.address", acheteurAddress);
    console.log(
      `The adrr1 balance before transfer is: ${addr1BalanceBefore} and after transfer is: ${addr1BalanceAfter}`
    );
    console.log(`The owner correcty transfer ${tokenAmount} LUSDT to addr1`);
  }
  // console.log("LoupUSDT deployed to:", lusdt.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

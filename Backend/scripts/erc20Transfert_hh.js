const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("owner", owner);
  const ownerAddress = owner.address;

  const deployedLUSDTAddress = "0x8fFd15cD87CDb95386E2858A3463FBfe8F900c2D";

  const networkName = hre.network.name;
  console.log(`Vous êtes connecté au réseau : ${networkName}`);

  if (networkName === "sepolia") {
    const acheteurAddress = "0x28588549098DB4ef87A21Dc85DCA159487778f8E";
    console.log("on est ligne 16");
    const lusdt = await ethers.getContractAt("LoupUSDT", deployedLUSDTAddress);
    await lusdt.deploymentTransaction();
    console.log("LoupUSDT BUG ?:", lusdt);
    console.log("on est ligne 20");

    const tokenAmount = 19999999999999999999999n;

    const ownerBalanceBefore = await lusdt.balanceOf(owner);
    console.log("J'AI FAIT UN BALANCE OF", ownerBalanceBefore);
    console.log("on est ligne 26");
    console.log("ACHETEUR ADDRESSE ", acheteurAddress);
    console.log("TOKEN AMOUNT", tokenAmount);
    console.log("on est ligne 29");

    const addr1BalanceBefore = await lusdt.balanceOf(acheteurAddress);

    await lusdt.transfer(acheteurAddress, tokenAmount);
    console.log("J'AI FAIT UN TRANSFER");

    const ownerBalanceAfter = await lusdt.balanceOf(owner);

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

    const LUSDT = await ethers.getContractFactory("LoupUSDT");
    const lusdt = await LUSDT.deploy();

    console.log("LoupUSDT deployed to:", lusdt.target);
    console.log("lusdt", lusdt);

    const tokenAmount = 19999999999999999999999n;

    console.log("owner ADRESSE", owner.address);
    console.log("LUST BUG?", lusdt);

    const ownerBalanceBefore = await lusdt.balanceOf(owner.address);

    console.log("J'AI FAIT UN BALANCE OF", ownerBalanceBefore);

    console.log("ACHETEUR ADDRESSE ", acheteurAddress);
    console.log("TOKEN AMOUNT", tokenAmount);

    const addr1BalanceBefore = await lusdt.balanceOf(acheteurAddress);

    await lusdt.transfer(acheteurAddress, tokenAmount);
    console.log("J'AI FAIT UN TRANSFER");

    const ownerBalanceAfter = await lusdt.balanceOf(owner.address);

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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("owner", owner);
  const ownerAddress = owner.address;
  const acheteurAddress = "0x28588549098DB4ef87A21Dc85DCA159487778f8E";

  // const owner = await ethers.getSigners();
  // const LUSDT = await ethers.getContractFactory("LoupUSDT");
  // const lusdt = await LUSDT.deploy();
  const deployedLUSDTAddress = "0x016fafa2878F7654140023D05134E984E8A5BF31";
  const lusdt = await ethers.getContractAt("LoupUSDT", deployedLUSDTAddress);

  console.log("LoupUSDT BUG ?:", lusdt);

  // await lusdt.waitForTransaction();
  // const LUSDT = await ethers.getContractFactory("LoupUSDT");
  // const lusdt = LUSDT.attach(deployedLUSDTAddress);
  // await lusdt.deploymentTransaction().wait(1);

  await lusdt.deploymentTransaction();

  //pour le script sepolia
  //const lusdt = await ethers.getContractAt("LoupUSDT","adresse du contrat sous sepolia"");

  // const tokenAmount = 1 * 10 ** 18;
  //getconversion from 1 to wei ethers 1000
  const tokenAmount = 199999999999999999999n;

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

  // console.log("LoupUSDT deployed to:", lusdt.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

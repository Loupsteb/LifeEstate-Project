const hre = require("hardhat");

async function main() {
  const [owner, addr1, addr2, addr3] = await ethers.getSigners();

  const LUSDT = await ethers.getContractFactory("LoupUSDT");
  const lusdt = await LUSDT.deploy();

  const tokenAmount = 1000;

  //const of the owner balance before transfer
  const ownerBalanceBefore = await lusdt.balanceOf(owner.address);

  //const of the addr1 balance before transfer
  const addr1BalanceBefore = await lusdt.balanceOf(addr1.address);

  await lusdt.transfer(addr1.address, tokenAmount);

  //const of the owner balance after transfer
  const ownerBalanceAfter = await lusdt.balanceOf(owner.address);

  //const of the addr1 balance after transfer
  const addr1BalanceAfter = await lusdt.balanceOf(addr1.address);

  console.log(
    `The owner balance before transfer is: ${ownerBalanceBefore} and after transfer is: ${ownerBalanceAfter}`
  );
  console.log(
    `The adrr1 balance before transfer is: ${addr1BalanceBefore} and after transfer is: ${addr1BalanceAfter}`
  );
  console.log(`The owner correcty transfer ${tokenAmount} LUSDT to addr1`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

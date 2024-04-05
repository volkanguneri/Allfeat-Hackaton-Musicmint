const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Admins = await ethers.getContractFactory("Admins");
  const admins = await Admins.deploy(deployer.address);

  console.log("Admins deployed to:", admins.target);

  // ALBUMS DEPLOYMENT

  const Albums = await ethers.getContractFactory("Albums");
  const albums = await Albums.deploy();

  console.log("Albums deployed to:", albums.target);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
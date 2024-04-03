const hre = require("hardhat");
const fs = require("fs");

async function main() {

    const { chainId } = await ethers.provider.getNetwork();
    let paymentAddress;
    /*********************************************************/

    const Admins = await hre.ethers.getContractFactory("Admins");
    const admins = await Admins.deploy();
    await admins.deployed();
    console.log(
        `Admins deployed to ${admins.address}`
    );


    const data1 = {
        address: admins.address,
        abi: JSON.parse(admins.interface.format('json'))
    }
    // fs.writeFileSync('./../front/public/contracts/solarNft.json',
    //     JSON.stringify(data1))
    // fs.writeFileSync(`./../front/public/contracts/${chainId}/solarNft.json`,
    //     JSON.stringify(data1))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

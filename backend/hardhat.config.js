require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// import("hardhat/config").HardhatUserConfig;

module.exports = {
  solidity: "0.8.24",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      gas: 5000000,
    },

    // mumbai: {
    //   url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    //   accounts: [`0x${PRIVATE_KEY}`],
    //   chainId: 80001,
    //   from: `${DEFAULT_ADDRESS_MUMBAI}`
    // }
    // ,
    // goerli: {
    //   url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    //   accounts: [`${PRIVATE_KEY}`],
    //   from: `${DEFAULT_ADDRESS_GOERLI}`

    // },
  },
};

require("@nomicfoundation/hardhat-toolbox")
// require("@nomiclabs/hardhat-etherscan") // thros some kind of error
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()



/** @type import('hardhat/config').HardhatUserConfig */
let SepUrl = process.env.SEPOLIA_URL || " ";
let pvtkey = process.env.PRIVATE_KEY || " ";
let apiKey = process.env.ETHERSCAN_APIKEY || " ";
let cmckey = process.env.coinMarketCapKey || " ";




module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    sepolia: {
      url: SepUrl,
      accounts: [pvtkey],
      chainId: 11155111,
      blockConfirmations: 6
    }
  },
  solidity: "0.8.19",
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: apiKey
    }
  },
  gasReporter: {
    enabled: false,
    // currency: "INR",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: cmckey
    // token : "MATIC" (to get in polygon instead of eth)
  },
};

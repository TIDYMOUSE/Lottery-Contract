const { ethers } = require("hardhat")

const developmentchains = ["hardhat", "localhost"]

const networkConfig = {
    11155111: {
        name: "sepolia",
        subscriptionId: "6926",
        vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        entranceFee: ethers.parseEther("0.01"),
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        callBackGasLimit: "100000",
        interval: "30"
    },
    31337: {
        name: "hardhat",
        entranceFee: ethers.parseEther("0.01"),
        subscriptionId: "588",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        callBackGasLimit: "500000",
        interval: "30"
    }
}

module.exports = {
    developmentchains,
    networkConfig,
}
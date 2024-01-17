const { network, ethers } = require("hardhat");
const { developmentchains, networkConfig } = require("../helper-hardhat-config.js")

const BASE_FEE = ethers.parseEther("0.25");  // premium(as mentioned on oracle docs)
const GAS_PRICE_LINK = 1e9;   //link per gas. calculated value based on gas price of link
let vrfCoordinatorV2Mock, vrfCoordinatorV2MockAddress, lotteryAddress;
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    if (developmentchains.includes(network.name)) {
        log("Local Network, deploying mocks ..................");
        // vrfCoordinatorV2MockAddress = (await deployments.get("VRFCoordinatorV2Mock")).address;
        // lotteryAddress = (await deployments.get("Lottery")).address
        // vrfCoordinatorV2Mock = await ethers.getContractAt("VRFCoordinatorV2Mock", vrfCoordinatorV2MockAddress);
        // await vrfCoordinatorV2Mock.addConsumer(networkConfig[chainId]["subscriptionId"], lotteryAddress)
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })
        log("Mocks deployed")
        log("____________________________________________________________________")

    }
}

module.exports.tags = ["all", "mocks"]
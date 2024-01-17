const { network, ethers } = require("hardhat");
const { developmentchains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify.js");

const SUB_FUND = ethers.parseEther("2");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId;

    if (developmentchains.includes(network.name)) {
        // const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = (await deployments.get("VRFCoordinatorV2Mock")).address
        const vrfCoordinatorV2Mock = await ethers.getContractAt("VRFCoordinatorV2Mock", vrfCoordinatorV2Address)
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        // new syntax
        subscriptionId = transactionReceipt.logs[0].args.subId;

        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, SUB_FUND);

    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
        subscriptionId = networkConfig[chainId]["subscriptionId"];
    }

    const args = [
        // vrfCoordinatorV2Address,
        networkConfig[chainId]["entranceFee"],
        networkConfig[chainId]["gasLane"],
        // subscriptionId,
        networkConfig[chainId]["callBackGasLimit"],
        networkConfig[chainId]["interval"]
    ];
    const Lottery = await deploy("Lottery", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentchains.includes(network.name) && process.env.ETHERSCAN_APIKEY) {
        log("Verifying ....")
        await verify(Lottery.address, args);
        log("_________________________________________________")
    }
}

module.exports.tags = ["all", "lottery"]
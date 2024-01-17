const { developmentchains, networkConfig } = require("../../helper-hardhat-config")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { assert, expect } = require("chai")
const { int } = require("hardhat/internal/core/params/argumentTypes")



!developmentchains.includes(network.name) ? describe.skip :
    describe("Lottery unit tests", async () => {
        let lottery, vrfCoordinatorV2Mock, lotteryAddrress, vrfCoordinatorV2MockAddress, entranceFee, interval
        const chainId = network.config.chainId;

        beforeEach(async () => {
            const { deployer } = await getNamedAccounts();
            await deployments.fixture(["all"])
            let [signer] = await ethers.getSigners()
            lotteryAddrress = (await deployments.get("Lottery")).address
            vrfCoordinatorV2MockAddress = (await deployments.get("VRFCoordinatorV2Mock")).address
            lottery = await ethers.getContractAt("Lottery", lotteryAddrress)
            vrfCoordinatorV2Mock = await ethers.getContractAt("VRFCoordinatorV2Mock", vrfCoordinatorV2MockAddress, signer)
            entranceFee = await lottery.getEntranceFee()
            interval = await lottery.getInterval();
        })

        describe("constructor", () => {
            it("Initializes the contract correctly", async () => {
                const LotteryState = await lottery.getLotteryState();
                assert.equal(LotteryState.toString(), "0");
                assert.equal(interval.toString(), networkConfig[chainId]["interval"]);
            })
        })

        describe("enter Lottery", async () => {
            it("entrance fee is not paid", async () => {
                await expect(lottery.enterLottery()).to.be.revertedWithCustomError(lottery, "Lottery__insufficientFeesPaid");
            })

            it("records players when they enter", async () => {
                let { deployer } = await getNamedAccounts()
                await lottery.enterLottery({ value: entranceFee });
                assert.equal(await lottery.getPlayers(0), deployer)
            })

            it("emits event on entering the lottery", async () => {
                await expect(lottery.enterLottery({ value: entranceFee })).to.emit(lottery, "LotteryEnter")
            })

            it("doesnt allow when calculating", async () => {
                await lottery.enterLottery({ value: entranceFee })
                await network.provider.send("evm_increaseTime", [ethers.toNumber(interval) + 1])
                await network.provider.send("evm_mine", [])
                // pretending to be a chainlink keeper
                await lottery.performUpkeep(ethers.toUtf8Bytes(""))
                await expect(lottery.enterLottery({ value: entranceFee })).to.be.revertedWithCustomError(lottery, "Lottery__notOpen")
            })
        })

    })
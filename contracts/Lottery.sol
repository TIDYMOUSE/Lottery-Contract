// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
// import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFV2WrapperConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

error Lottery__insufficientFeesPaid();
error Lottery__failedTransfer();
error Lottery__notOpen();
error Lottery__UpkeepNotNeeded(
    uint256 currBal,
    uint256 numPlayers,
    uint256 lotteryState
);

contract Lottery is
    VRFV2WrapperConsumerBase,
    AutomationCompatibleInterface,
    ConfirmedOwner
{
    // Type declarations
    enum LotteryState {
        OPEN,
        CALCUTLATING
    }

    // state variables
    uint256 private immutable i_fee;
    address payable[] private s_players;
    // VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    // uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callBackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    // Address LINK - hardcoded for Sepolia
    address constant linkAddress = 0x779877A7B0D9E8603169DdbD7836e478b4624789;

    // address WRAPPER - hardcoded for Sepolia
    address constant wrapperAddress =
        0xab18414CD93297B0d12ac29E63Ca20f515b3DB46;

    //Lottery variables
    address private s_recentWinner;
    LotteryState private s_lotteryState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    event LotteryEnter(address indexed player);
    event RequestedLotteryWinner(uint256 requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        // address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane, //keyhash
        // uint64 subscriptionId,
        uint32 callBackGasLimit,
        uint256 interval
    )
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(linkAddress, wrapperAddress)
    //  VRFConsumerBaseV2(vrfCoordinatorV2)
    {
        i_fee = entranceFee;
        // i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        // i_subscriptionId = subscriptionId;
        i_callBackGasLimit = callBackGasLimit;
        s_lotteryState = LotteryState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    function enterLottery() public payable {
        if (msg.value < i_fee) {
            revert Lottery__insufficientFeesPaid();
        }
        if (s_lotteryState != LotteryState.OPEN) revert Lottery__notOpen();
        s_players.push(payable(msg.sender));

        emit LotteryEnter(msg.sender);
    }

    /**
     * @dev This is the function that the Chainlink Keeper nodes call
     * they look for `upkeepNeeded` to return True.
     * the following should be true for this to return true:
     * 1. The time interval has passed between raffle runs.
     * 2. The lottery is open.
     * 3. The contract has ETH.
     * 4. Implicity, your subscription is funded with LINK.
     **/

    function checkUpkeep(
        bytes memory //checkdata
    )
        public
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        bool isOpen = (LotteryState.OPEN == s_lotteryState);
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = (address(this).balance > 0);
        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
        return (upkeepNeeded, "0x0");
    }

    function performUpkeep(bytes calldata) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded)
            revert Lottery__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_lotteryState)
            );
        s_lotteryState = LotteryState.CALCUTLATING;
        uint256 requestId = requestRandomness(
            // i_gasLane,
            // i_subscriptionId,
            i_callBackGasLimit,
            REQUEST_CONFIRMATIONS,
            NUM_WORDS
        );
        emit RequestedLotteryWinner(requestId);
    }

    function fulfillRandomWords(
        uint256, // _requestId,
        uint256[] memory _randomWords
    ) internal override {
        uint256 winnerIndex = _randomWords[0] % s_players.length;
        s_recentWinner = s_players[winnerIndex];
        s_lotteryState = LotteryState.OPEN;
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;
        (bool callSuccess, ) = s_recentWinner.call{
            value: address(this).balance
        }("");
        if (!callSuccess) revert Lottery__failedTransfer();
        emit WinnerPicked(s_recentWinner);
    }

    // Allow withdraw of Link tokens from the contract

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    function getEntranceFee() public view returns (uint256) {
        return i_fee;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return s_players;
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getLotteryState() public view returns (LotteryState) {
        return s_lotteryState;
    }

    function getNumWords() public pure returns (uint32) {
        return NUM_WORDS;
    }

    function getNumofPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getLastTimestamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp;
    }
}

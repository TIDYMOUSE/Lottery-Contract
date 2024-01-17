# PROJECT REQUIREMENTS

```shell
yarn add --dev hardhat
yarn hardhat
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv


yarn add --dev @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers@1 @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan chai ethers@5 hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v6

#after importing the vrfv2 consumer contract
yarn add --dev @chainlink/contracts
```

virtual == expected to be overidden

```js
subscriptionId = transactionReceipt.logs[0].args.subId;
// or
subscriptionId = transactionReceipt.logs[0].args[0];
```

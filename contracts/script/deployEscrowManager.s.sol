// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "forge-std/Script.sol";
import "../src/EscrowManager.sol"; // Path to your EscrowManager contract

// Importing interfaces for Aave and token addresses
import {IPoolAddressesProvider} from "../lib/aave-v3-origin/src/contracts/interfaces/IPool.sol";
import {IERC20} from "../lib/aave-v3-origin/src/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

contract EscrowManagerTest is Script {
    address public daoContract = 0x0000000000000000000000000000000000000000; // Your DAO contract address (replace with actual)
    address public poolAddressesProvider =
        0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A; // Aave Pool Addresses Provider contract address (replace with actual)
    address public daiToken = 0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357; // DAI Token contract address (replace with actual)
    address public aDaiToken = 0x29598b72eb5CeBd806C5dCD549490FdA35B13cD8; // aDAI Token contract address (replace with actual)

    function run() public {
        // Start the script with a specific Ethereum account
        vm.startBroadcast();

        // Deploy the EscrowManager contract
        EscrowManager escrowManager = new EscrowManager(
            daoContract,
            poolAddressesProvider,
            daiToken,
            aDaiToken
        );

        // Optionally, you can set the DAO contract address after deployment
        // escrowManager.setDAOContract(daoContract);

        // Print the deployed contract address
        console.log("EscrowManager deployed at:", address(escrowManager));

        vm.stopBroadcast();
    }
}

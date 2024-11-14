// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "forge-std/Script.sol";
import "../src/DAO.sol";
import "../src/EscrowManager.sol";

contract DeployDAO is Script {
    address admin = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; // Replace with the actual admin address
    address escrowManagerAddress = 0xC4c48BFcCbdD552782B081d7eB81e769552A8b1D; // Replace with the deployed EscrowManager address

    uint256 memberLimit = 20; // Example values
    uint256 minInvestment = 7390000000000000; // Example values
    uint256 maxInvestment = 147874307000000000 ether; // Example values
    uint256 lockPeriod = 31536000; // Example values

    function run() public {
        // Set up the deployment on Sepolia network
        vm.startBroadcast(); // Start broadcasting transactions to the network

        // Deploy the DAO contract
        DAO dao = new DAO(
            memberLimit,
            minInvestment,
            maxInvestment,
            lockPeriod,
            admin,
            escrowManagerAddress
        );

        // Output the deployed DAO contract address
        console.log("DAO deployed at:", address(dao));

        // Example of interacting with the DAO contract (optional)
        // You can call functions like joinDAO or invest here if needed

        vm.stopBroadcast(); // Stop broadcasting the transaction
    }
}

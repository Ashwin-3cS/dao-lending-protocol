// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "forge-std/Script.sol";
import "../src/DAOFactory.sol"; // Adjust this path if needed

contract DeployDAOFactoryScript is Script {
    function run() external {
        // Load private key from environment variables for broadcasting transactions
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start a broadcast, required for sending transactions in Foundry
        vm.startBroadcast(deployerPrivateKey);

        // Deploy DAOFactory
        DAOFactory daoFactory = new DAOFactory();
        console.log("DAOFactory deployed at:", address(daoFactory));

        // Define parameters for createDAO function
        string memory cityName = "Chennai";
        string memory daoName = "Chennai DAO";
        uint256 memberLimit = 20;
        uint256 minInvestment = 7390000000000000;
        uint256 maxInvestment = 147874307000000000;
        uint256 lockPeriod = 31536000;
        address escrowManagerAddress = 0xC4c48BFcCbdD552782B081d7eB81e769552A8b1D; // Replace with actual address

        // Call the createDAO function on the deployed DAOFactory
        daoFactory.createDAO(
            cityName,
            daoName,
            memberLimit,
            minInvestment,
            maxInvestment,
            lockPeriod,
            escrowManagerAddress
        );

        console.log("DAO created in city:", cityName, "DAO Name:", daoName);

        // End broadcast after transactions are sent
        vm.stopBroadcast();
    }
}

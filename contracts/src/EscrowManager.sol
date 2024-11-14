// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IPool} from "../lib/aave-v3-origin/src/contracts/interfaces/IPool.sol";
import {IPoolAddressesProvider} from "../lib/aave-v3-origin/src/contracts/interfaces/IPool.sol";
import {IERC20} from "../lib/aave-v3-origin/src/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

contract EscrowManager {
    address public daoContract;
    IPool public pool;
    IERC20 public daiToken;
    IERC20 public aDaiToken;

    event FundsLent(uint256 amount);
    event FundsWithdrawn(uint256 amount);

    constructor(
        address _daoContract, // Placeholder address initially
        address _poolAddressesProvider,
        address _daiToken,
        address _aDaiToken
    ) {
        daoContract = _daoContract; // Assign the placeholder DAO contract address
        IPoolAddressesProvider provider = IPoolAddressesProvider(
            _poolAddressesProvider
        );
        pool = IPool(provider.getPool());
        daiToken = IERC20(_daiToken);
        aDaiToken = IERC20(_aDaiToken);
    }

    // Function to set the actual DAO address after deployment
    function setDAOContract(address _daoContract) external {
        require(daoContract == address(0), "DAO contract address already set"); // Only allow setting once
        daoContract = _daoContract;
    }

    modifier onlyDAO() {
        require(msg.sender == daoContract, "Only DAO can call this function");
        _;
    }

    // Supply DAI to Aave and receive aTokens
    function lendToAave(uint256 amount) external onlyDAO {
        require(
            daiToken.balanceOf(address(this)) >= amount,
            "Insufficient DAI balance"
        );

        // Approve the pool contract to spend the tokens
        daiToken.approve(address(pool), amount);

        // Supply assets to the Aave pool
        pool.supply(address(daiToken), amount, address(this), 0);

        emit FundsLent(amount);
    }

    // Withdraw all aTokens after lock period
    function withdrawFromAave() external onlyDAO {
        uint256 aTokenBalance = aDaiToken.balanceOf(address(this));
        require(aTokenBalance > 0, "No aTokens to withdraw");

        // Withdraw the underlying asset from Aave
        pool.withdraw(address(daiToken), aTokenBalance, daoContract);

        emit FundsWithdrawn(aTokenBalance);
    }

    // Function to get the aDAI balance held in this contract
    function getADaiBalance() external view returns (uint256) {
        return aDaiToken.balanceOf(address(this));
    }
}

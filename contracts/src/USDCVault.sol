// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

contract USDCVault {
    IERC20 public usdcToken; // Interface to the USDC token contract

    // Address of the contract owner
    address public owner;

    // Events for tracking
    event FundTransferred(address indexed recipient, uint256 amount);

    // Initialize with the USDC token contract address
    constructor(address _usdcTokenAddress) {
        usdcToken = IERC20(_usdcTokenAddress);
        owner = msg.sender;
    }

    // Function to transfer USDC to a recipient address
    function distributeUSDC(
        address recipient,
        uint256 usdcAmount
    ) external onlyOwner {
        require(
            usdcToken.balanceOf(address(this)) >= usdcAmount,
            "Not enough USDC in the contract"
        );

        // Transfer USDC to the recipient
        bool success = usdcToken.transfer(recipient, usdcAmount);
        require(success, "Transfer failed");

        emit FundTransferred(recipient, usdcAmount);
    }

    // Modifier to allow only the owner to call specific functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
}

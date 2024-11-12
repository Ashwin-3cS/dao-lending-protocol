// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./EscrowManager.sol";

contract DAO {
    address public daoAdmin;
    uint256 public memberLimit;
    uint256 public minInvestment;
    uint256 public maxInvestment;
    uint256 public daoBalance;
    uint256 public lockPeriod; // Duration in seconds (e.g., 1 year = 31536000 seconds)
    uint256 public lockStartTime; // Timestamp when the funds are transferred to escrow
    address[] public members;
    mapping(address => bool) public isMember;
    mapping(address => uint256) public investments;

    EscrowManager public escrowManager;

    event MemberJoined(address indexed member, uint256 investment);
    event InvestmentMade(address indexed member, uint256 amount);
    event FundsTransferredToEscrow(uint256 amount);
    event LockPeriodStarted(uint256 lockStartTime);

    modifier onlyAdmin() {
        require(msg.sender == daoAdmin, "Only admin can perform this action");
        _;
    }

    modifier onlyMember() {
        require(
            isMember[msg.sender],
            "Only a DAO member can perform this action"
        );
        _;
    }

    constructor(
        uint256 _memberLimit,
        uint256 _minInvestment,
        uint256 _maxInvestment,
        uint256 _lockPeriod, // Lock period in seconds
        address _admin,
        address _escrowManager
    ) {
        daoAdmin = _admin;
        memberLimit = _memberLimit;
        minInvestment = _minInvestment;
        maxInvestment = _maxInvestment;
        lockPeriod = _lockPeriod;
        escrowManager = EscrowManager(_escrowManager);
    }

    function joinDAO() external payable {
        require(members.length < memberLimit, "DAO member limit reached");
        require(
            msg.value == minInvestment,
            "Investment must match the minimum requirement"
        );
        require(!isMember[msg.sender], "Already a member");
        require(
            daoBalance + msg.value <= maxInvestment,
            "DAO investment cap reached"
        );

        isMember[msg.sender] = true;
        members.push(msg.sender);
        investments[msg.sender] = msg.value;
        daoBalance += msg.value;

        emit MemberJoined(msg.sender, msg.value);

        if (daoBalance >= maxInvestment) {
            transferFundsToEscrow();
        }
    }

    function invest() external payable onlyMember {
        require(
            msg.value == minInvestment,
            "Investment amount must match the minimum investment"
        );
        require(
            daoBalance + msg.value <= maxInvestment,
            "DAO investment cap reached"
        );

        investments[msg.sender] += msg.value;
        daoBalance += msg.value;

        emit InvestmentMade(msg.sender, msg.value);

        if (daoBalance >= maxInvestment) {
            transferFundsToEscrow();
        }
    }

    function transferFundsToEscrow() internal {
        uint256 amountToTransfer = daoBalance;
        daoBalance = 0;
        lockStartTime = block.timestamp; // Set the start time of the lock period

        (bool success, ) = address(escrowManager).call{value: amountToTransfer}(
            ""
        );
        require(success, "Failed to transfer funds to EscrowManager");

        escrowManager.lendToAave(amountToTransfer);
        emit FundsTransferredToEscrow(amountToTransfer);
        emit LockPeriodStarted(lockStartTime);
    }

    // Function to check if the lock period has ended
    function isLockPeriodEnded() public view returns (bool) {
        return block.timestamp >= lockStartTime + lockPeriod;
    }

    // Function to initiate withdrawal from EscrowManager after lock period
    function withdrawFundsFromEscrow() external onlyAdmin {
        require(isLockPeriodEnded(), "Lock period has not ended");
        escrowManager.withdrawFromAave();
    }
}

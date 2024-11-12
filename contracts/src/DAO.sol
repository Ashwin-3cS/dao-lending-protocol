// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract DAO {
    address public daoAdmin;
    uint256 public memberLimit;
    uint256 public minInvestment;
    uint256 public maxInvestment;
    uint256 public daoBalance; // Total balance of the DAO
    address[] public members;
    mapping(address => bool) public isMember;
    mapping(address => uint256) public investments;

    event MemberJoined(address indexed member, uint256 investment);
    event InvestmentMade(address indexed member, uint256 amount);

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
        address _admin
    ) {
        daoAdmin = _admin;
        memberLimit = _memberLimit;
        minInvestment = _minInvestment;
        maxInvestment = _maxInvestment;
    }

    // Function to join the DAO with an exact investment amount
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
    }

    // Function to make an additional investment (only if within cap limit)
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
    }

    // View function to get all current members
    function getMembers() external view returns (address[] memory) {
        return members;
    }

    // Function to get a member's investment
    function getInvestment(address _member) external view returns (uint256) {
        return investments[_member];
    }

    // Function to get the DAO's current balance
    function getDAOBalance() external view returns (uint256) {
        return daoBalance;
    }
}

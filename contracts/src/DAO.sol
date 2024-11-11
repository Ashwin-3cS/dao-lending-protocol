// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract DAO {
    address public daoAdmin;
    uint256 public memberLimit;
    uint256 public minInvestment;
    address[] public members;
    mapping(address => bool) public isMember;
    mapping(address => uint256) public investments;
    mapping(address => address) public memberSafeAccounts; // Map each member to their Safe Account address

    event MemberJoined(
        address indexed member,
        address safeAccount,
        uint256 investment
    );
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

    constructor(uint256 _memberLimit, uint256 _minInvestment, address _admin) {
        daoAdmin = _admin;
        memberLimit = _memberLimit;
        minInvestment = _minInvestment;
    }

    // Function to join the DAO
    function joinDAO(address _safeAccount) external payable {
        require(members.length < memberLimit, "DAO member limit reached");
        require(
            msg.value >= minInvestment,
            "Investment does not meet minimum requirement"
        );
        require(!isMember[msg.sender], "Already a member");

        isMember[msg.sender] = true;
        members.push(msg.sender);
        investments[msg.sender] = msg.value;
        memberSafeAccounts[msg.sender] = _safeAccount;

        emit MemberJoined(msg.sender, _safeAccount, msg.value);
    }

    // Function to make an additional investment
    function invest() external payable onlyMember {
        require(msg.value > 0, "Investment amount must be greater than zero");
        investments[msg.sender] += msg.value;

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
}

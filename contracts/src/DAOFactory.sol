// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./DAO.sol";

contract DAOFactory {
    address public admin;

    struct DAOInfo {
        address daoAddress;
        string cityName;
        string daoName;
        uint256 memberLimit;
        uint256 minInvestment;
        uint256 daomaxInvestment;
        uint256 lockPeriod;
    }

    // Mapping city name to list of DAOs in that city
    mapping(string => DAOInfo[]) public cityToDAOs;

    event DAOCreated(
        string indexed cityName,
        string daoName,
        address daoAddress
    );

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Function to create a new DAO
    function createDAO(
        string calldata _cityName,
        string calldata _daoName,
        uint256 _memberLimit,
        uint256 _minInvestment,
        uint256 _maxInvestment,
        uint256 _lockPeriod,
        address _escrowManagerAddress
    ) external onlyAdmin {
        // Create the new DAO without passing the factory address
        DAO newDAO = new DAO(
            _memberLimit,
            _minInvestment,
            _maxInvestment,
            _lockPeriod,
            admin,
            _escrowManagerAddress
        );

        // Add DAO details to the struct
        DAOInfo memory daoInfo = DAOInfo({
            daoAddress: address(newDAO),
            cityName: _cityName,
            daoName: _daoName,
            memberLimit: _memberLimit,
            minInvestment: _minInvestment,
            daomaxInvestment: _maxInvestment,
            lockPeriod: _lockPeriod
        });

        // Add DAO to the city's list
        cityToDAOs[_cityName].push(daoInfo);

        emit DAOCreated(_cityName, _daoName, address(newDAO));
    }

    // Function to fetch all DAOs for a given city
    function getDAOsByCity(
        string calldata _cityName
    ) external view returns (DAOInfo[] memory) {
        return cityToDAOs[_cityName];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LifeEstateNFT.sol";

contract LifeEstateFactory {
    address[] public LifeEstateAddresses;

    event LifeEstateDeployed(
        address indexed propertyAddress,
        string propertyName
    );

    function deployLifeEstate(
        string memory _propertyName,
        uint256 _marketPrice,
        uint256 _propertySurfaceInSquareMeters,
        uint256 _rooms,
        uint256 _bedRooms,
        string memory _cityLocation,
        string memory _countryLocation,
        bool _pool,
        bool _garage,
        bool _garden,
        string memory _uri
    ) public returns (address) {
        LifeEstateNFT newLifeEstate = new LifeEstateNFT(
            _propertyName,
            _marketPrice,
            _propertySurfaceInSquareMeters,
            _rooms,
            _bedRooms,
            _cityLocation,
            _countryLocation,
            _pool,
            _garage,
            _garden,
            _uri
        );
        LifeEstateAddresses.push(address(newLifeEstate));
        emit LifeEstateDeployed(address(newLifeEstate), _propertyName);

        return address(newLifeEstate);
    }

    function initLifeEstateParts(
        address newLifeEstate,
        uint256[] memory _partTotalSupplies,
        uint256[] memory _partPrices
    ) public {
        LifeEstateNFT newNFT = LifeEstateNFT(newLifeEstate);
        newNFT.setPartDetails(_partTotalSupplies, _partPrices);
    }

    //for get all properties
    function getAllLifeEstate() public view returns (address[] memory) {
        return LifeEstateAddresses;
    }

    //for get only one property
    function getOneLifeEstate(uint256 _index) public view returns (address) {
        require(_index < LifeEstateAddresses.length, "Index out of bounds");
        return LifeEstateAddresses[_index];
    }
}

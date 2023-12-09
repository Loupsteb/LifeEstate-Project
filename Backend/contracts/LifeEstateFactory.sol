// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LifeEstateNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A factory contract for creating and initializing LifeEstateNFT contracts.
/// @notice This contract allows deployment and initialization of LifeEstateNFT instances.
contract LifeEstateFactory is Ownable {
    /// @notice Array of deployed LifeEstateNFT contract addresses.
    address[] private LifeEstateAddresses;

    /// @notice Emitted when a new LifeEstateNFT contract is deployed.
    /// @param propertyAddress The address of the deployed LifeEstateNFT contract.
    /// @param propertyName The name of the property for the deployed contract.
    event LifeEstateDeployed(
        address indexed propertyAddress,
        string propertyName
    );

    /// @notice Initializes the contract setting the deployer as the initial owner.
    constructor() Ownable(msg.sender) {}

    /// @notice Deploys a new LifeEstateNFT contract with the provided property details.
    /// @param _propertyName The name of the property.
    /// @param _marketPrice The market price of the property.
    /// @param _propertySurfaceInSquareMeters The surface area of the property in square meters.
    /// @param _rooms The number of rooms in the property.
    /// @param _bedRooms The number of bedrooms in the property.
    /// @param _cityLocation The city where the property is located.
    /// @param _pool Indicates if the property has a pool.
    /// @param _garage Indicates if the property has a garage.
    /// @param _garden Indicates if the property has a garden.
    /// @param _uri The URI for the metadata of the property.
    /// @return The address of the newly deployed LifeEstateNFT contract.
    function deployLifeEstate(
        string memory _propertyName,
        uint256 _marketPrice,
        uint256 _propertySurfaceInSquareMeters,
        uint256 _rooms,
        uint256 _bedRooms,
        string memory _cityLocation,
        bool _pool,
        bool _garage,
        bool _garden,
        string memory _uri
    ) external returns (address) {
        LifeEstateNFT newLifeEstate = new LifeEstateNFT(
            _propertyName,
            _marketPrice,
            _propertySurfaceInSquareMeters,
            _rooms,
            _bedRooms,
            _cityLocation,
            _pool,
            _garage,
            _garden,
            _uri
        );
        LifeEstateAddresses.push(address(newLifeEstate));
        emit LifeEstateDeployed(address(newLifeEstate), _propertyName);

        return address(newLifeEstate);
    }

    ///todo: Security check the array length and change to onlyOwner
    /// @notice Initializes the parts of a LifeEstateNFT contract.
    /// @param newLifeEstate The address of the LifeEstateNFT to initialize.
    /// @param _partTotalSupplies An array of total supplies for each part.
    /// @param _partPrices An array of prices for each part.
    function initLifeEstateParts(
        address newLifeEstate,
        uint256[] memory _partTotalSupplies,
        uint256[] memory _partPrices
    ) external {
        LifeEstateNFT newNFT = LifeEstateNFT(newLifeEstate);
        newNFT.setPartDetails(_partTotalSupplies, _partPrices);
    }

    function initOwner(
        address newOwner,
        address newLifeEstate
    ) external onlyOwner {
        LifeEstateNFT newNFT = LifeEstateNFT(newLifeEstate);
        newNFT.transferOwnership(newOwner);
    }

    /// @notice Retrieves all LifeEstateNFT addresses deployed by this factory.
    /// @return array of addresses of all deployed LifeEstateNFT contracts.
    function getAllLifeEstate() external view returns (address[] memory) {
        return LifeEstateAddresses;
    }

    /// @notice Retrieves a single LifeEstateNFT address by index.
    /// @param _index The index of the LifeEstateNFT in the `LifeEstateAddresses` array.
    /// @return address of the LifeEstateNFT contract at the given index.
    /// @dev Reverts if the index is out of bounds of the `LifeEstateAddresses` array.
    function getOneLifeEstate(uint256 _index) external view returns (address) {
        require(_index < LifeEstateAddresses.length, "Index out of bounds");
        return LifeEstateAddresses[_index];
    }
}

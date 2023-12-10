// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A token contract representing fractional ownership in real estate properties
/// @notice This contract allows for the minting and trading of fractional real estate shares represented as ERC1155 tokens
/// @dev Inherits from ERC1155 for NFT functionality and Ownable for access control
contract LifeEstateNFT is ERC1155, Ownable {
    /// @dev Details of a life estate share including supply metrics and price
    struct EstateShare {
        uint256 mintSupply;
        uint256 totalSupply;
        uint256 circulatingSupply;
        uint256 price;
    }

    /// @dev Specifications of a real estate property including location and features
    struct EstateSpecs {
        uint256 marketPrice;
        string propertyName;
        uint256 propertySurfaceInSquareMeters;
        uint256 rooms;
        uint256 bedRooms;
        string cityLocation;
        string countryLocation;
        bool pool;
        bool garage;
        bool garden;
        string uri;
    }

    /// @dev Address where the contract's funds are stored
    address payable private treasuryAddress;

    EstateSpecs public estateSpecs;

    /// @dev Just declare the maximum part ID as a constant
    uint256 public constant PARTMAX_ID = 10;

    /// @dev A flag indicating if the contract's parts have been initialized
    bool public initialized = false;

    /// @dev Mapping to store each part's details keyed by part ID
    mapping(uint256 => EstateShare) public parts;

    /// @dev Mapping to store an ERC20 token is approved for minting parts
    mapping(address => bool) public approvedTokens;

    //Temporaly to simplify the frontend treatment : will replace the mapping after refactoring
    /// @dev Array of approved ERC20 tokens
    address[] public approvedTokensArray;

    /// @notice Events for various actions within the contract
    event PartSet(uint256 indexed partId, uint256 mintSupply, uint256 price);
    event PartMinted(
        address indexed owner,
        uint256 indexed partId,
        uint256 amount
    );
    event PartsMinted(address indexed owner, bytes32 indexed encodedTokens);
    event ERC20Withdrawn(
        address indexed owner,
        address indexed tokenAddress,
        uint256 amount
    );

    /// @notice Initializes a new estate with specified details and sets the contract owner
    /// @param _propertyName The name of the property
    /// @param _marketPrice The market price of the property
    /// @param _propertySurfaceInSquareMeters The surface area of the property in square meters
    /// @param _rooms The number of rooms in the property
    /// @param _bedRooms The number of bedrooms in the property
    /// @param _cityLocation The city where the property is located
    /// @param _pool Whether the property has a pool
    /// @param _garage Whether the property has a garage
    /// @param _garden Whether the property has a garden
    /// @param _uri The metadata URI for the property
    constructor(
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
    ) ERC1155(_uri) Ownable(msg.sender) {
        EstateSpecs memory _estateSpecs;
        _estateSpecs.propertyName = _propertyName;
        _estateSpecs.marketPrice = _marketPrice;
        _estateSpecs
            .propertySurfaceInSquareMeters = _propertySurfaceInSquareMeters;
        _estateSpecs.rooms = _rooms;
        _estateSpecs.bedRooms = _bedRooms;
        _estateSpecs.propertyName = _propertyName;
        _estateSpecs.cityLocation = _cityLocation;
        _estateSpecs.pool = _pool;
        _estateSpecs.garage = _garage;
        _estateSpecs.garden = _garden;
        _estateSpecs.uri = _uri;

        estateSpecs = _estateSpecs;
    }

    /// @notice Transfers the ownership of the contract to a new address
    /// @dev Overrides the transferOwnership function from Ownable to transfer all tokens to the new owner
    function transferOwnership(address newOwner) public override onlyOwner {
        // super._transfer(owner(), newOwner, balanceOf(owner()));
        super.transferOwnership(newOwner);
    }

    /// @notice Initializes the parts with their total supplies and prices
    /// @dev Sets the part details for all parts at once, marking the contract as initialized
    /// @param _partTotalSupplies An array of the total supply for each part
    /// @param _partPrices An array of prices for each part
    /// @custom:modifier onlyOwner Only the owner can initialize the parts
    function setPartDetails(
        uint256[] memory _partTotalSupplies,
        uint256[] memory _partPrices
    ) external onlyOwner {
        require(!initialized, "Parts are already initialized");
        require(
            _partTotalSupplies.length == _partPrices.length &&
                _partPrices.length == PARTMAX_ID + 1,
            "Part ID is invalid"
        );
        initialized = true;

        for (uint256 i = 0; i <= PARTMAX_ID; i++) {
            EstateShare memory newShare;
            newShare.mintSupply = _partTotalSupplies[i];
            newShare.totalSupply = _partTotalSupplies[i];
            newShare.price = _partPrices[i];
            parts[i] = newShare;
            emit PartSet(i, _partTotalSupplies[i], _partPrices[i]);
        }
    }

    /// @notice Retrieves the estate share details for a given part ID
    /// @dev View function to get details from the parts mapping
    /// @param partId The ID of the part for which to retrieve details
    /// @return EstateShare memory The details of the specified part
    function getEstateShare(
        uint256 partId
    ) external view returns (EstateShare memory) {
        return parts[partId];
    }

    /// @notice Retrieves all the information of the estate specifications
    /// @dev View function to get details from the estateSpecs struct
    /// @return estateSpecs memory The details of the estate specifications
    function getEstateSpecs() external view returns (EstateSpecs memory) {
        return estateSpecs;
    }

    /// @notice Approves or disapproves ERC20 tokens for minting NFT parts
    /// @dev Only the owner can call this function to update the approvedTokens mapping
    /// @param tokenAddresses An array of token addresses to set approval
    /// @param isApproved The approval status to set for the given token addresses
    function setApprovedTokens(
        address[] memory tokenAddresses,
        bool isApproved
    ) external onlyOwner {
        uint256 arrayLength = tokenAddresses.length;
        for (uint256 i = 0; i < arrayLength; i++) {
            approvedTokens[tokenAddresses[i]] = isApproved;
            approvedTokensArray.push(tokenAddresses[i]);
        }
    }

    /// @notice Mints a new token part if the token is approved and the buyer has enough balance
    /// @dev Transfers the required amount of ERC20 tokens from the buyer to this contract as payment
    /// @param partId The ID of the part to mint
    /// @param amount The amount of the part to mint
    /// @param tokenAddress The address of the ERC20 token to use for payment
    function mintBuyToken(
        uint256 partId,
        uint256 amount,
        address tokenAddress
    ) external {
        require(approvedTokens[tokenAddress], "Token not approved");
        IERC20 token = IERC20(tokenAddress);
        uint256 totalPrice = amount * parts[partId].price;

        require(parts[partId].mintSupply >= amount, "Not enough supply");
        require(
            token.balanceOf(msg.sender) >= totalPrice,
            "Not enough token balance"
        );

        token.transferFrom(msg.sender, address(this), totalPrice);

        parts[partId].mintSupply -= amount;
        parts[partId].circulatingSupply += amount;
        _mint(msg.sender, partId, amount, "");

        emit PartMinted(msg.sender, partId, amount);
    }

    /// @notice Buys multiple token parts with the specified ERC20 token
    /// @dev Ensures all parts have enough supply and the buyer has enough balance before minting
    /// @param partIds An array of part IDs to mint
    /// @param amounts An array of amounts for each part ID to mint
    /// @param tokenAddress The address of the ERC20 token to use for payment
    function buyMultipleMintTokens(
        uint256[] memory partIds,
        uint256[] memory amounts,
        address tokenAddress
    ) external {
        require(approvedTokens[tokenAddress], "Token not approved");
        IERC20 token = IERC20(tokenAddress);
        uint256 totalPrice = 0;

        for (uint256 i = 0; i < partIds.length; i++) {
            require(
                parts[partIds[i]].mintSupply >= amounts[i],
                "Not enough supply for a part"
            );
            totalPrice += amounts[i] * parts[partIds[i]].price;
        }

        require(
            token.balanceOf(msg.sender) >= totalPrice,
            "Not enough token balance"
        );

        token.transferFrom(msg.sender, address(this), totalPrice);

        for (uint256 i = 0; i < partIds.length; i++) {
            parts[partIds[i]].mintSupply -= amounts[i];
            parts[partIds[i]].circulatingSupply += amounts[i];
        }

        _mintBatch(msg.sender, partIds, amounts, "");

        // TODO: Add event emission for PartsMinted
    }

    function getTokensOf(
        address account
    ) external view returns (uint256[] memory) {
        uint256[] memory balances = new uint256[](PARTMAX_ID + 1);
        for (uint256 i = 0; i <= PARTMAX_ID; i++) {
            balances[i] = balanceOf(account, i);
        }
        return balances;
    }

    /// @notice Withdraws the accumulated ERC20 tokens from the contract to the owner's address
    /// @dev Only the owner can call this function to transfer all balances of approved tokens
    /// @param tokenAddress The address of the ERC20 token to withdraw from the contract
    function withdrawERC20(address tokenAddress) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        token.transfer(owner(), balance);
        emit ERC20Withdrawn(owner(), tokenAddress, balance);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LifeEstateNFT is ERC1155, Ownable {
    //struct of the details of a lifeEstate share
    struct EstateShare {
        uint256 mintSupply;
        uint256 totalSupply;
        uint256 circulatingSupply;
        uint256 price;
    }

    //struct for an estate, like number of rooms, if a pool is present, etc.
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

    EstateSpecs public estateSpecs;

    //address of the Dapp's treasury
    address payable public treasuryAddress;

    // boolean to check if the contract is initialized
    bool public initialized = false;

    //mapping for store the PartDetails to the partId
    mapping(uint256 => EstateShare) public parts;

    //mapping for store the approved erc20 token for minting
    mapping(address => bool) public approvedTokens;

    // ID of the parts is from 0 to Part_Max    uint256 public constant PART_0_ID = 0;
    uint256 public constant PARTMAX_ID = 10;

    //event for the set of a part
    event PartSet(
        uint256 _partType,
        uint256 _partTotalSupply,
        uint256 _partPrice
    );

    // event for when a new part is minted
    event PartMinted(
        address indexed _owner,
        uint256 indexed _partId,
        uint256 _amount
    );

    //event for when multiple parts are minted on same time
    event PartsMinted(address indexed _owner, bytes32 encodedTokens);

    //event for when the fund from the treasury address are withdraw
    event ERC20Withdrawn(
        address indexed _owner,
        address tokenAddress,
        uint256 _amount
    );

    constructor(
        string memory _propertyName,
        uint256 _marketPrice,
        uint256 _propertySurfaceInSquareMeters,
        uint256 _rooms,
        uint256 _bedRooms,
        string memory _cityLocation,
        // string memory _countryLocation,
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
        // _estateSpecs.countryLocation = _countryLocation;
        _estateSpecs.pool = _pool;
        _estateSpecs.garage = _garage;
        _estateSpecs.garden = _garden;
        _estateSpecs.uri = _uri;

        estateSpecs = _estateSpecs;
    }

    //-----------------Set Part Details-----------------//

    //PRECISER @dev qu'on attend les valeurs ds le meme ordre ex id0 = ID0, supplis de ID0, prix deID0
    //ETANT DONNE que tu recois ds l'ordre ds le tableau :
    //on pourrait dire quà l'index 0 c'est ID0, index1 c'est ID1 => ca ferait un param en moins
    //EN require tu check que length = 11 (ton nbr d'id)
    //function to set the details of a part
    //Public function because the factory need to call it for create a new property
    function setPartDetails(
        uint256[] memory _partTotalSupplies,
        uint256[] memory _partPrices
    ) public onlyOwner {
        require(!initialized, "Parts are already initialized");
        //tu t'assures que tu as autant de valeur que d'id (0 à max) et qu'il n'en manque pas ds un tableau
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

    //-----------------Get Function-----------------//

    //je ne sais pas si tout les getters sont necessaires car tu peux recup une struct et la lire
    //ds le front (tu corrigera qd tu sera au front si tu vois que pas necessaire)
    //l'esetniel c'est get ta struct et eventuellement prix et supply pour faciliter
    //l'info pour la marketplace ou la page de mint

    //function to get the struct EstateShare from his ID
    function getEstateShare(
        uint256 partId
    ) public view returns (EstateShare memory) {
        return parts[partId];
    }

    //function to get all the information of the EstateSpecs struct
    function getEstateSpecs() public view returns (EstateSpecs memory) {
        return estateSpecs;
    }

    //-----------------Mint Function-----------------//

    //make a fonction for approve a erc20 token for minting
    function setApprovedTokens(
        address[] memory tokenAddresses,
        bool isApproved
    ) public onlyOwner {
        uint256 arrayLength = tokenAddresses.length;
        for (uint256 i = 0; i < arrayLength; i++) {
            approvedTokens[tokenAddresses[i]] = isApproved;
        }
    }

    function mintBuyToken(
        uint256 partId,
        uint256 amount,
        address tokenAddress
    ) public {
        require(approvedTokens[tokenAddress], "Token not approved");
        IERC20 token = IERC20(tokenAddress);
        uint256 totalPrice = amount * parts[partId].price;

        require(parts[partId].mintSupply >= amount, "Not enough supply");
        require(
            token.balanceOf(msg.sender) >= totalPrice,
            "Not enough token balance"
        );

        //Transfert the tokens from the buyer to the designed contract
        token.transferFrom(msg.sender, address(this), totalPrice);

        parts[partId].mintSupply -= amount; // Décrémente le supply
        parts[partId].circulatingSupply += amount;
        _mint(msg.sender, partId, amount, "");

        emit PartMinted(msg.sender, partId, amount);
    }

    //Buy multiple tokens with ERC20 token
    //todo : ATTENTION RAJOUTER L EVENT !!!!!!!!!!!
    function buyMultipleMintTokens(
        uint256[] memory partIds,
        uint256[] memory amounts,
        address tokenAddress
    ) public {
        require(approvedTokens[tokenAddress], "Token not approved");
        IERC20 token = IERC20(tokenAddress);
        uint256 totalPrice = 0;

        // Calculate the number of tokens to mint and the total price
        for (uint256 i = 0; i < partIds.length; i++) {
            require(
                parts[partIds[i]].mintSupply >= amounts[i],
                "Not enough supply for a part"
            );
            totalPrice += amounts[i] * parts[partIds[i]].price;
        }

        // Verify that the buyer has enough balance
        require(
            token.balanceOf(msg.sender) >= totalPrice,
            "Not enough token balance"
        );

        //Transfert the tokens from the buyer to the designed contract
        token.transferFrom(msg.sender, address(this), totalPrice);
        // string memory encodedInfos = "";
        // uint256[] memory encodedInfos = new uint256[](partIds.length * 2);
        // actualise the supply of each part
        for (uint256 i = 0; i < partIds.length; i++) {
            parts[partIds[i]].mintSupply -= amounts[i];
            parts[partIds[i]].circulatingSupply += amounts[i];
            // encodedInfos[i * 2] = i;
            // encodedInfos[(i * 2) + 1] = amounts[i];
        }
        // bytes32 encodedTokens = keccak256(abi.encodePacked(encodedInfos));

        //get keccak256 of encodedInfos array
        // bytes32 encodedTokens = keccak256(abi.encode(encodedInfos));
        _mintBatch(msg.sender, partIds, amounts, "");

        // emit PartsMinted(msg.sender, encodedTokens);
    }

    //ATTENTION ICI CA CA MARCHE POUR DE L ETHER !!!!
    //pour les dai... faut : transferFrom du token vers votre wallet
    // fuction for withdraw the funds of the treasury address
    function withdrawERC20(address tokenAddress) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        token.transfer(owner(), balance);
        emit ERC20Withdrawn(owner(), tokenAddress, balance);
    }
}

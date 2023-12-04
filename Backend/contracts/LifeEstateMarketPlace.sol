// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// @title MarketPlace for the LifeEstateNFT
/// @author Loup Esteban
/// @notice This contract is using for the secondary market of the LifeEstateNFT
/// @dev Explain to a developer any extra details

import "./LifeEstateFactory.sol";
import "./LifeEstateNFT.sol";
import "./LoupUSDT.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LifeEstateMarketPlace is ERC1155Holder, Ownable, ReentrancyGuard {
    IERC1155 public lifeEstateNFT;

    //Variables
    struct Listing {
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 price; // Price per token
        bool active;
        address newLifeEstate;
    }

    address[] public approvedTokens;

    //percents of the operational fee
    uint256 public operationFee = 5;

    //mapping listing index to listings
    mapping(uint256 => Listing) public listings;

    //mapping for protocole balance of tokens taxe
    // mapping(address => uint256) public marketTokensBalance;

    //security checker
    uint256 public listingCounter;

    //Events
    //event for when a new listing is created
    event TokenListingCreated(
        uint256 indexed tokenId,
        uint256 amount,
        uint256 price
    );

    //envent when a token is bought
    event TokenBought(uint256 indexed tokenId, uint256 amount, uint256 price);

    //event when a list of tokens is bought
    event TokensBought(
        uint256[] indexed tokenIds,
        uint256[] amounts,
        uint256[] prices
    );

    //event when a token is sold
    event TokenSold(uint256 indexed tokenId, uint256 amount, uint256 price);

    //event when a list of tokens is sold
    event TokensSold(
        uint256[] indexed tokenIds,
        uint256[] amounts,
        uint256[] prices
    );

    //event when a listing is delisted/removed
    event TokenListingRemoved(uint256 indexed tokenId);

    //event when the fund are withdrawn from the contract to the owner address
    event FundsWithdrawn(address indexed _owner, uint256 _amount);

    // address factoryAddress;

    // //Constructor
    // constructor(address _factoryAddress) {
    //   factoryAddress = _factoryAddress;
    // }

    //--------------------------------//

    LifeEstateFactory public factory;

    //Constructor
    constructor(address _factoryAddress) Ownable(msg.sender) {
        factory = LifeEstateFactory(_factoryAddress);
    }

    //Modifier

    //Functions
    //create a listing for a token
    //todo : make a listing with variety of tokensID (type of parts)

    function listToken(
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        address newLifeEstate
    ) public {
        LifeEstateNFT propertyToSale = LifeEstateNFT(newLifeEstate);
        //The seller needs to have approved the marketplace to manage their tokens
        require(
            propertyToSale.isApprovedForAll(msg.sender, address(this)),
            "Marketplace needs approval to manage tokens"
        );
        require(
            propertyToSale.balanceOf(msg.sender, tokenId) >= amount,
            "Not enough tokens owned to list"
        );

        //Create a new listing
        listings[listingCounter] = Listing(
            msg.sender,
            tokenId,
            amount,
            price,
            true,
            newLifeEstate
        );
        listingCounter += 1;

        //Send an event when a new listing is created
        emit TokenListingCreated(tokenId, amount, price);
    }

    //create a listing for a bunch of tokens

    //buy a token
    //todo: make a partial buy token function

    function buyListedToken(
        uint256 listingID,
        address tokenAddress
    ) public nonReentrant {
        Listing storage listing = listings[listingID];
        require(listing.active, "Token not listed for sale");
        // Récupération des valeurs de tokenId et amount à partir de la struct listing
        uint256 tokenId = listing.tokenId;
        uint256 amount = listing.amount;

        uint256 price = listing.price;
        ERC20 token = ERC20(tokenAddress);
        uint256 fees = (price * operationFee) / 100;
        uint256 totalPrice = price + fees;
        require(
            token.balanceOf(msg.sender) >= totalPrice,
            "Not enough token balance"
        );

        LifeEstateNFT NftToBuy = LifeEstateNFT(listing.newLifeEstate);
        require(
            NftToBuy.balanceOf(listing.seller, tokenId) >= amount,
            "The seller do not have the same amount of token"
        );
        //Transfert the tokens from the seller to the buyer
        NftToBuy.safeTransferFrom(
            listing.seller,
            msg.sender,
            tokenId,
            amount,
            ""
        );
        //Transfert the cash from the buyer to the seller
        token.transferFrom(msg.sender, listing.seller, totalPrice);

        delete listings[listingID];

        // if listingID < listingCounter && listingID != 0 {
        //   listings[listingID] = listings[listingCounter - 1];
        //   delete listings[listingCounter - 1];
        // }

        emit TokenBought(tokenId, amount, listing.price);
    }

    //cancel a token sell
    function cancelListing(uint256 tokenId) public {
        Listing storage listing = listings[tokenId];
        require(
            listing.seller == msg.sender,
            "Only the seller can cancel a listing"
        );
        listing.active = false;

        emit TokenListingRemoved(tokenId);
    }

    function setApprovedToken(address tokenAddress) public onlyOwner {
        approvedTokens.push(tokenAddress);
    }

    // Withdraw funds from contract to owner
    function withdrawFunds() public onlyOwner {
        for (uint256 i = 0; i < approvedTokens.length; i++) {
            ERC20 token = ERC20(approvedTokens[i]);
            uint256 balance = token.balanceOf(address(this));
            // marketTokensBalance[approvedTokens[i]] = 0;
            token.transfer(owner(), balance);
            emit FundsWithdrawn(owner(), balance);
        }
    }
}

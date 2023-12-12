// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title MarketPlace for LifeEstate NFT
 * @dev Manages the listing, selling, and buying of NFT parts representing shares in real estate properties.
 * This contract uses ReentrancyGuard to prevent re-entrant calls.
 */

import "./LifeEstateFactory.sol";
import "./LifeEstateNFT.sol";
import "./LoupUSDT.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LifeEstateMarketPlace is ERC1155Holder, Ownable, ReentrancyGuard {
    // A struct representing a listing for an NFT on the marketplace.
    struct Listing {
        address seller; // The address of the seller.
        uint256 tokenId; // The ID of the NFT being sold.
        uint256 amount; // The amount of the particular NFT token being sold.
        uint256 price; // The price per token.
        bool active; // Whether the listing is active.
        address newLifeEstate; // The address of the specific LifeEstate NFT contract.
    }

    // Reference to the NFT contract with which this marketplace interacts.
    IERC1155 private lifeEstateNFT;

    // The fee percentage that the marketplace charges for every transaction.
    uint256 private operationFee = 5;

    // A counter to keep track of the number of listings.
    uint256 public listingCounter;

    LifeEstateFactory public factory;

    // An array of ERC20 token addresses that are approved for use in the marketplace.
    address[] public approvedTokens;

    // Mapping from listing ID to the listing struct, storing details of the listing.
    // mapping(uint256 => Listing) public listings;
    Listing[] public listings;

    // Events
    event TokenListingCreated(
        uint256 indexed tokenId,
        uint256 amount,
        uint256 price
    );
    event TokenBought(uint256 indexed tokenId, uint256 amount, uint256 price);
    event TokenListingRemoved(uint256 indexed tokenId);
    event FundsWithdrawn(address indexed _owner, uint256 _amount);

    /**
     * @dev Initializes the contract by setting the factory contract address and the owner.
     * @param _factoryAddress Address of the LifeEstateFactory contract.
     */
    constructor(address _factoryAddress) Ownable(msg.sender) {
        factory = LifeEstateFactory(_factoryAddress);
    }

    ///Security check size of listings (limit the size or implement pagination)
    ///At the moment use of the array is safe because the seller will have to buy lot of tokens before
    /**
     * @notice Creates a listing for a token.
     * @dev Requires approval from the token owner for the marketplace to manage their tokens.
     * @param tokenId The token ID to list.
     * @param amount The amount of the token to list.
     * @param price The listing price per token.
     * @param newLifeEstate The associated LifeEstate NFT contract address.
     */
    //todo : make a listing with variety of tokensID (type of parts)

    function listToken(
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        address newLifeEstate
    ) external {
        LifeEstateNFT propertyToSale = LifeEstateNFT(newLifeEstate);
        require(
            propertyToSale.isApprovedForAll(msg.sender, address(this)),
            "Marketplace needs approval to manage tokens"
        );
        require(
            propertyToSale.balanceOf(msg.sender, tokenId) >= amount,
            "Not enough tokens owned to list"
        );

        Listing memory newlisting = Listing(
            msg.sender,
            tokenId,
            amount,
            price,
            true,
            newLifeEstate
        );

        listings.push(newlisting);

        listingCounter += 1;

        emit TokenListingCreated(tokenId, amount, price);
    }

    /**
     * @notice Allows a user to buy a token that has been listed in the marketplace.
     * @dev Ensures the transaction is not re-entrant.
     * @param listingID The ID of the listing to buy from.
     * @param tokenAddress The ERC20 token address to use for payment.
     */
    function buyListedToken(
        uint256 listingID,
        address tokenAddress
    ) external nonReentrant {
        uint256 listingLength = listings.length;

        require(listingID < listingLength, "listingID does not exist");

        Listing storage listing = listings[listingID];
        require(listing.active, "Token not listed for sale");

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

        NftToBuy.safeTransferFrom(
            listing.seller,
            msg.sender,
            tokenId,
            amount,
            ""
        );
        //Transfert the cash from the buyer to the seller
        token.transferFrom(msg.sender, listing.seller, totalPrice);

        uint256 listPrice = listing.price;

        // delete listings[listingID];

        Listing memory lastListing = listings[listings.length - 1];

        listings[listingID] = lastListing;

        listings.pop();

        listingCounter -= 1;

        emit TokenBought(tokenId, amount, listPrice);
    }

    /**
     * @notice Cancels a token listing if the caller is the seller.
     * @param listingID The ID of the token listing to cancel.
     */
    function cancelListing(uint256 listingID) external {
        uint256 listingLength = listings.length;

        require(listingID < listingLength, "listingID does not exist");

        require(
            listings[listingID].seller == msg.sender,
            "Only the seller can cancel a listing"
        );

        require(listingLength > 0, "No listing available");

        Listing memory lastListing = listings[listings.length - 1];

        listings[listingID] = lastListing;

        listings.pop();

        listingCounter -= 1;

        emit TokenListingRemoved(listingID);
    }

    function getAllListings() external view returns (Listing[] memory) {
        return listings;
    }

    /**
     * @notice Approves a new ERC20 token for transactions within the marketplace.
     * @param tokenAddress The address of the token to approve.
     */
    function setApprovedToken(address tokenAddress) public onlyOwner {
        approvedTokens.push(tokenAddress);
    }

    /**
     * @notice Withdraws the funds accumulated from sales to the contract owner's address.
     */
    function withdrawFunds() external onlyOwner {
        for (uint256 i = 0; i < approvedTokens.length; i++) {
            ERC20 token = ERC20(approvedTokens[i]);
            uint256 balance = token.balanceOf(address(this));
            // marketTokensBalance[approvedTokens[i]] = 0;
            token.transfer(owner(), balance);
            emit FundsWithdrawn(owner(), balance);
        }
    }
}

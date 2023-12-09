// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title A mock ERC20 token for demonstration and testing purposes
/// @notice This contract is a simplified version of a standard ERC20 token, specifically designed for testing
/// @dev Inherits from OpenZeppelin's ERC20 implementation
contract LoupUSDT is ERC20 {
    /// @notice Constructor to create LoupUSDT token
    /// @dev Mints a predefined amount of tokens to the deployer's address
    constructor() ERC20("LoupUSDT", "LUSDT") {
        // Mint a fixed amount of LoupUSDT tokens (1 million) to the deployer
        // Note: The total supply is set arbitrarily for testing purposes
        _mint(msg.sender, 100000000000 * 10 ** decimals());
    }
}

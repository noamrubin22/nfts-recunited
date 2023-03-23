// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTunited is ERC721, Ownable {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint(address to, uint256 tokenId, string memory metadata) public onlyOwner {
        require(!_exists(tokenId), "Token already exists");
        _mint(to, tokenId);
        _setTokenURI(tokenId, metadata);
        _soulbindToken(tokenId);
    }

    // NFT is souldbound
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override virtual {
        require(ownerOf(tokenId) == owner() || to == address(0) || from == address(0), "You can't transfer this NFT if you are not the contract owner.");
    }
}

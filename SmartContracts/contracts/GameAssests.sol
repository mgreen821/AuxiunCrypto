//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract GameAssests is ERC721{

    //Here we are using to Counters to allow us track and iterate tokenIds, so each tokenId will be unique. 
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    //This event will be called when a new token is created and minted. I will log the address of the owner and the tokenId. 
    event Minted(address owner, uint256 tokenId);

    constructor() ERC721("Item", "ITM"){}

    //Returns the name of the token.
    function getName() public view returns(string memory){
        return name();
    }

    //Returns the symbol of the token.
     function getSymbol() public view returns(string memory){
        return symbol();
    }

    //Returns URI associated with a specific token. 
    function getTokenURI(uint256 tokenId) public view returns(string memory){
        return tokenURI(tokenId);
    }

    //Allows us to transfer a token from one account to another. 
    function transferItem(address from, address to, uint256 tokenId) public{
        safeTransferFrom(from, to, tokenId);
    }

    //Returns the address of the owner of a specific token. 
    function ownerOfToken(uint256 tokenId) public view returns(address){
        return ownerOf(tokenId);
    }

    //Used to create a new item. It mints the item and sets the owner to the person who has created it.
    function createItem(string memory tokenURI) public{
        
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit Minted(msg.sender, newItemId);
    }
    
    //Returns the amount of tokens owned by a specific address.
    function getBalance(address owner) public view returns(uint256){
        return balanceOf(owner);
    }
}
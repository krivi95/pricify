// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
import "./Item.sol";

/**
 * @title Store
 * @dev Store contract for storing items and their prices.
 */
contract Store is AccessControl {
    
    // roles for AccessControl contract
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    // items listed under a store
    uint256 public numOfItems;
    mapping(uint256 => Item) public items;
    
    constructor(){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
    }
    
    function addAdmin(address _address) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin of a store");
        _setupRole(ADMIN_ROLE, _address);
    }
    
    function removeAdmin(address _address) public {
        require(hasRole(ADMIN_ROLE, msg.sender),"Caller is not an admin of a store");
        revokeRole(ADMIN_ROLE, _address);
    }
    
    function isAdmin(address _address) public view returns(bool) {
        return hasRole(ADMIN_ROLE, _address);
    }
    
    function createNewItem(uint256 _isoCurrency, string memory _name, uint _price) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin of a store");
        Item item = new Item(this, numOfItems, _isoCurrency, _name, _price);
        items[numOfItems] = item;
        numOfItems++;
    }
    
    function updateItemPrice(uint256 _itemId, uint256 _amount) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin of a store");
        require(_itemId <= numOfItems, "Item with provided id doesn't exist in this store");
        items[_itemId].updatePrice(_amount, msg.sender);
    }
    
    function getNumberOfPricesForItem(uint256 _itemId) public view returns(uint256) {
        require(_itemId <= numOfItems, "Item with provided id doesn't exist in this store");
        return items[_itemId].numberOfPriceChanges();
        
    }
    
    function getPriceForItemAtIndex(uint256 _itemId, uint256 _index) public view returns(uint256, uint256, address){
        require(_itemId <= numOfItems, "Item with provided id doesn't exist in this store");
        return items[_itemId].getPriceAtIndex(_index);
    }
    
}
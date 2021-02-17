// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
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
    
    /**
     * @dev Creates new store contract for managing items and prices in a store.
     * @param _admin address taht will be the admin of the store
     */
    constructor(address _admin) public {
        _setupRole(DEFAULT_ADMIN_ROLE, _admin);
        _setupRole(ADMIN_ROLE, _admin);
    }
    
    /**
     * @dev Grants admin role to specified address
     * @param _address which will be granted an admin role
     */
    function addAdmin(address _address) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin of a store");
        _setupRole(ADMIN_ROLE, _address);
    }
    
    /**
     * @dev Revokes admin role from specified address
     * @param _address which will be revoked an admin role
     */
    function removeAdmin(address _address) public {
        require(hasRole(ADMIN_ROLE, msg.sender),"Caller is not an admin of a store");
        revokeRole(ADMIN_ROLE, _address);
    }
    
    /**
     * @dev Checks if the specified role has admin role
     * @param _address to verify
     */
    function isAdmin(address _address) public view returns(bool) {
        return hasRole(ADMIN_ROLE, _address);
    }
    
    /**
     * @dev Creates new item under this store
     * @param _isoCurrency currency identifier according to ISO-4127
     * @param _name of the item
     * @param _price initial price of the item
     */
    function createNewItem(uint256 _isoCurrency, string memory _name, uint _price) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin of a store");
        Item item = new Item(this, numOfItems, _isoCurrency, _name, _price);
        items[numOfItems] = item;
        numOfItems++;
    }
    
    /**
     * @dev Updates the price for the selected item (creates new Price record)
     * @param _itemId identifier of the item
     * @param _amount new price
     */
    function updateItemPrice(uint256 _itemId, uint256 _amount) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin of a store");
        require(_itemId <= numOfItems, "Item with provided id doesn't exist in this store");
        items[_itemId].updatePrice(_amount, msg.sender);
    }
    
    /**
     * @dev Gets number of Price records for selected item.
     * @param _itemId identifier of the item
     */
    function getNumberOfPricesForItem(uint256 _itemId) public view returns(uint256) {
        require(_itemId <= numOfItems, "Item with provided id doesn't exist in this store");
        return items[_itemId].numberOfPriceChanges();
        
    }
    
     /**
     * @dev Gets price record on selected index for specified item 
     * @param _itemId identifier of the item
     * @param _index price record index
     */
    function getPriceForItemAtIndex(uint256 _itemId, uint256 _index) public view returns(uint256, uint256, address){
        require(_itemId <= numOfItems, "Item with provided id doesn't exist in this store");
        return items[_itemId].getPriceAtIndex(_index);
    }
    
}
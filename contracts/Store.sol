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
    
    struct StoreInfo {
        uint256 storeId;
        string name;
        uint256 numOfItems;
    }

    StoreInfo public storeInfo;
    mapping(uint256 => Item) public items;
    
    /**
     * @dev Modifier that allows only admins of a store to manage items
     * @param _address address of a user that is trying to update the price.
     */
    modifier onlyStoreAdmin(address _address){
        require(hasRole(ADMIN_ROLE, _address), "Caller is not an admin of a store");
        _;
    }
    
    /**
     * @dev Creates new store contract for managing items and prices in a store.
     * @param _admin address taht will be the admin of the store
     * @param _name name of the store
     */
    constructor(uint256 _storeId, string memory _name, address _admin) public {
        storeInfo.storeId = _storeId;
        storeInfo.name = _name;
        _setupRole(DEFAULT_ADMIN_ROLE, _admin);
        _setupRole(ADMIN_ROLE, _admin);
    }
    
    /**
     * @dev Grants admin role to specified address
     * @param _address which will be granted an admin role
     */
    function addAdmin(address _address) public onlyStoreAdmin(msg.sender) {
        // require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin of a store");
        _setupRole(ADMIN_ROLE, _address);
    }
    
    /**
     * @dev Revokes admin role from specified address
     * @param _address which will be revoked an admin role
     */
    function removeAdmin(address _address) public onlyStoreAdmin(msg.sender) {
        // require(hasRole(ADMIN_ROLE, msg.sender),"Caller is not an admin of a store");
        revokeRole(ADMIN_ROLE, _address);
    }
    
    /**
     * @dev Checks if the specified role has admin role
     * @param _address to verify
     * @return bool (if the specified address has admin rights)
     */
    function isAdmin(address _address) public view returns(bool) {
        return hasRole(ADMIN_ROLE, _address);
    }
    
    /**
     * @dev Creates new item under this store
     * @param _address address of the user who is creating new item
     * @param _isoCurrency currency identifier according to ISO-4127
     * @param _name of the item
     * @param _price initial price of the item
     */
    function createNewItem(address _address, uint256 _isoCurrency, string memory _name, uint _price) public onlyStoreAdmin(_address) {
        // require(hasRole(ADMIN_ROLE, _address), "Caller is not an admin of a store");
        Item item = new Item(this, storeInfo.numOfItems, _isoCurrency, _name, _price);
        items[storeInfo.numOfItems] = item;
        storeInfo.numOfItems++;
    }
    
    /**
     * @dev Updates the price for the selected item (creates new Price record)
     * @param _address address of the user who is creating new item
     * @param _itemId identifier of the item
     * @param _amount new price
     */
    function updateItemPrice(address _address, uint256 _itemId, uint256 _amount) public onlyStoreAdmin(_address) {
        // require(hasRole(ADMIN_ROLE, _address), "Caller is not an admin of a store");
        require(_itemId <= storeInfo.numOfItems, "Item with provided id doesn't exist in this store");
        items[_itemId].updatePrice(_amount, _address);
    }
    
    /**
     * @dev Gets number of Price records for selected item.
     * @param _itemId identifier of the item
     * @return number of times the price has been updated
     */
    function getNumberOfPricesForItem(uint256 _itemId) public view returns(uint256) {
        require(_itemId <= storeInfo.numOfItems, "Item with provided id doesn't exist in this store");
        return items[_itemId].numberOfPriceChanges();
    }
    
     /**
     * @dev Gets price record on selected index for specified item 
     * @param _itemId identifier of the item
     * @param _index price record index
     * @return tuple(amount, unixTimestamp, updatedUser)
     */
    function getPriceForItemAtIndex(uint256 _itemId, uint256 _index) public view returns(uint256, uint256, address){
        require(_itemId <= storeInfo.numOfItems, "Item with provided id doesn't exist in this store");
        return items[_itemId].getPriceAtIndex(_index);
    }
    
    /**
     * @dev Returns tuple containing basic information for selected items
     * @param _itemId item identifier 
     * @return tuple(itemId, isoCurrency, name, lastPrice, numberOfPriceChanges)
     */
    function getItemInfo(uint256 _itemId) public view returns(uint256, uint256, string memory, uint256, uint256) {
        require(_itemId <= storeInfo.numOfItems, "Item with provided id doesn't exist in this store");
        return items[_itemId].itemInfo();
    }
    
}
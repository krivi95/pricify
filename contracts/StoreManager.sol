// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.0 <0.8.0;

import "./Store.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title StoreManager
 * @dev StoreManager contract for managing stores, items and prices. One address could be managining only one store.
 */
contract StoreManager is Ownable {
    
    mapping(uint256 => Store) public storeIdMapping;
    mapping(address => Store) public storeAddressMapping;
    uint256 public numOfStores;

    /**
     * @dev Creates new store (only one store per account is allowed)
     * @param _name name of the store
     * @param _admin address of the store admin
     */
    function createNewStore(string memory _name, address _admin) onlyOwner public {
        require(address(storeAddressMapping[msg.sender]) == address(0), "You already have created a store! Please call getMyStoreInfo method for more info.");
        Store store = new Store(numOfStores, _name, _admin);
        storeIdMapping[numOfStores] = store;
        storeAddressMapping[_admin] = store;
        numOfStores++;
    }
    
    /**
     * @dev Returns basic information for selected store
     * @param _storeId name of the store
     * @return returns tuple(storeId, name, numberOfItems)
     */
    function getStoreInfoById(uint256 _storeId) public view returns(uint256, string memory, uint256) {
        require(_storeId < numOfStores, "Store with specified id doesn't exist!");
        return storeIdMapping[_storeId].storeInfo();
    }
    
    /**
     * @dev Returns basic information for the store where sender is admin
     * @return tuple(storeId, name, numberOfItems)
     */
    function getMyStoreInfo() public view returns(uint256, string memory, uint256) {
        require(address(storeAddressMapping[msg.sender]) != address(0), "You don't have any store assigned to you!");
        return storeAddressMapping[msg.sender].storeInfo();
    }
    
    /**
     * @dev Grants specified address the admin rights for the store
     * @param _address user that will have admin rights
     */
    function addAdminToMyStore(address _address) public {
        require(address(storeAddressMapping[msg.sender]) != address(0), "You don't have any store assigned to you!");
        storeAddressMapping[msg.sender].addAdmin(_address);
    }
    
    /**
     * @dev Revokes admin rights for the store for the specified address 
     * @param _address user that will have admin rights removed
     */
    function removeAdminFromMyStore(address _address) public {
        require(address(storeAddressMapping[msg.sender]) != address(0), "You don't have any store assigned to you!");
        storeAddressMapping[msg.sender].removeAdmin(_address);
    }
    
    /**
     * @dev Checks if the specified address has admin rights for the store  
     * @param _storeId identifier for the store entry
     * @param _address of the user
     */
    function isStoreAdmin(uint256 _storeId, address _address) public view returns(bool) {
        require(_storeId < numOfStores, "Store with specified id doesn't exist!");
        return storeIdMapping[_storeId].isAdmin(_address);
    }
    
    /**
     * @dev Returns the basic information for the selected item in the store 
     * @param _storeId identifier for the store entry
     * @param _itemId identifier of the item in the store
     * @return tuple(itemId, isoCurrency, name, lastPrice, numberOfPriceChanges)
     */
    function getItemInfo(uint256 _storeId, uint256 _itemId) public view returns(uint256, uint256, string memory, uint256, uint256) {
        require(_storeId < numOfStores, "Store with specified id doesn't exist!");
        return storeIdMapping[_storeId].getItemInfo(_itemId);
    }
    
    /**
     * @dev Returns the selected price entry for the item in the store 
     * @param _storeId identifier for the store entry
     * @param _itemId identifier of the item in the store
     * @param _index price index
     * @return tuple(amount, unixTimestamp, updatedUser)
     */
    function getPriceForItemAtIndex(uint256 _storeId, uint256 _itemId, uint256 _index) public view returns(uint256, uint256, address){
        require(_storeId < numOfStores, "Store with specified id doesn't exist!");
        return storeIdMapping[_storeId].getPriceForItemAtIndex(_itemId, _index);
    }
    
    /**
     * @dev Creates new item and adds it to the store 
     * @param _isoCurrency currency identifier according to the ISO-4127 standard
     * @param _name name of the item
     * @param _price price of the item
     */
    function addNewItemToMyStore(uint256 _isoCurrency, string memory _name, uint _price) public {
        require(address(storeAddressMapping[msg.sender]) != address(0), "You don't have any store assigned to you!");
        storeAddressMapping[msg.sender].createNewItem(msg.sender, _isoCurrency, _name, _price);
    }
    
    /**
     * @dev Updates the price of the item under sender's store 
     * @param _itemId identifier of the item whose price will be updated
     * @param _amount new price for the item
     */
    function updateItemPrice(uint256 _itemId, uint256 _amount) public {
        require(address(storeAddressMapping[msg.sender]) != address(0), "You don't have any store assigned to you!");
        storeAddressMapping[msg.sender].updateItemPrice(msg.sender, _itemId, _amount);
    }
    
   
}
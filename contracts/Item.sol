// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.0 <0.8.0;

import "./Store.sol";


/**
 * @title Item
 * @dev Item contract for storing item related information.
 */
contract Item {

    struct Price {
        uint256 amount;  //price of the item
        uint256 timestamp; //time and date when price was changed
        address updatedUser; //user who updated the price
    }
    
    struct ItemInfo {
        uint256 itemId;
        uint256 isoCurrency;
        string name;
        uint256 lastPrice;
        uint256 numOfPriceChanges;
    }

    ItemInfo public itemInfo;
    mapping(uint256 => Price) public prices;
    Store parentContract;
    
    /**
     * @dev Modifier that allows only admins of a store to update a price for an item under that store.
     * @param _address address of a user that is trying to update the price.
     */
    modifier onlyStoreAdmin(address _address){
        require(parentContract.isAdmin(_address), "You are not allowed to update the price of the item! Only admins of the store can update the price!");
        _;
    }
    
    /** 
     * @dev Create a new ballot to choose one of 'proposalNames'.
     * @param _itemId unique identifier of the item  
     * @param _isoCurrency currency that will be used for a price of the item (ISO-4127)
     * @param _name name of the item
     */
    constructor(Store _storeContract, uint256 _itemId, uint256 _isoCurrency, string memory _name, uint _price) public {
        parentContract = _storeContract;
        itemInfo.itemId = _itemId;
        itemInfo.isoCurrency = _isoCurrency;
        itemInfo.name = _name;
        _addNewPrice(_price, msg.sender);
    }
    
    /**
     * @dev Adds new price entry for the item.
     * @param _amount new price for the item
     */
    function _addNewPrice(uint256 _amount, address _sender) internal {
        prices[itemInfo.numOfPriceChanges].amount = _amount;
        prices[itemInfo.numOfPriceChanges].timestamp = block.timestamp;
        prices[itemInfo.numOfPriceChanges].updatedUser = _sender;
        itemInfo.lastPrice = _amount;
        itemInfo.numOfPriceChanges++;
    }
    
    /**
     * @dev Update the price of the item.
     * @param _amount new price for the item
     */
    function updatePrice(uint256 _amount, address _sender) onlyStoreAdmin(_sender) external {
        _addNewPrice(_amount, _sender);
    }
    
    /**
     * @dev Number of price changes for this item (number of Price records).
     */
    function numberOfPriceChanges() public view returns(uint256) {
        return itemInfo.numOfPriceChanges;
    }
    
    
    /**
     * @dev Returns the price record (unpacked into a tuple) at selected index.
     * @param _index of the price record
     */
    function getPriceAtIndex(uint256 _index) public view returns(uint256, uint256, address) {
        require(_index < itemInfo.numOfPriceChanges, "There is no price entry with specified index.");
        return (prices[_index].amount, prices[_index].timestamp, prices[_index].updatedUser);
    }
   
}
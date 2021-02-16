// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

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

    uint256 public itemId;
    uint256 public isoCurrency;
    string public name;
    mapping(uint256 => Price) prices;
    uint256 numOfPriceChanges;
    Store parentContract;
    
    /** 
     * @dev Create a new ballot to choose one of 'proposalNames'.
     * @param _itemId unique identifier of the item  
     * @param _isoCurrency currency that will be used for a price of the item
     * @param _name name of the item
     */
    constructor(Store _storeContract, uint256 _itemId, uint256 _isoCurrency, string memory _name, uint _price) {
        parentContract = _storeContract;
        itemId = _itemId;
        isoCurrency = _isoCurrency;
        name = _name;
        _addNewPrice(_price, msg.sender);
    }
    
    modifier ownerOrAllowed(address _address){
        //Only owner or person who is given allowance (and has positive balance) can withdraw the money
        require(parentContract.isAdmin(_address), "You are not allowed to update the price of the item! Only admins of the store can update the price!");
        _;
    }
    
    /**
     * @dev Adds new price entry for the item.
     * @param _amount new price for the item
     */
    function _addNewPrice(uint256 _amount, address _sender) internal {
        prices[numOfPriceChanges].amount = _amount;
        prices[numOfPriceChanges].timestamp = block.timestamp;
        prices[numOfPriceChanges].updatedUser = _sender;
        numOfPriceChanges++;
    }
    
    /**
     * @dev Update the price of the item.
     * @param _amount new price for the item
     */
    function updatePrice(uint256 _amount, address _sender) ownerOrAllowed(_sender) external {
        _addNewPrice(_amount, _sender);
    }
    
    function numberOfPriceChanges() public view returns(uint256) {
        return numOfPriceChanges;
    }
    
    function getPriceAtIndex(uint256 _index) public view returns(uint256, uint256, address) {
        require(_index < numOfPriceChanges, "There is no price entry with specified index.");
        return (prices[_index].amount, prices[_index].timestamp, prices[_index].updatedUser);
    }
   
}
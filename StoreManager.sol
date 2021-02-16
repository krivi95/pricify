// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./Store.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";


/**
 * @title StoreManager
 * @dev StoreManager contract for managing.
 */
contract StoreManager is Ownable {
    
    mapping(uint256 => Store) stores;
    uint256 public numOfStores;

    function createNewStore(address _admin) onlyOwner public {
        Store store = new Store(_admin);
        stores[numOfStores] = store;
        numOfStores++;
    }
    
    function getStore(uint256 _storeId) public view returns(Store) {
        require(_storeId < numOfStores, "Store with specified id doesn't exist!");
        return stores[_storeId];
    }
   
}
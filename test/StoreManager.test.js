/**
 * Testing StoreManager smart contract.
 * 
 * This contract represents main public interface for managining store (items under store and their prices).
 * In order to test it, start Ganache and update the truffle.config file to reglect the Ganache network parameters.
 * Command: "truffle test"/"npm test".
 */
const assert = require('assert');
const { AssertionError } = require('assert');
const StoreManager = artifacts.require("./StoreManager.sol");

contract("StoreManager", accounts => {
    // Test case data
    const [owner, storeOwner, additionalStoreAdmin, randomUser] = accounts;
    const storeName = "My first and only store";
    const isoCurrency = 941;
    const initialPrice = 5000;
    const updatedPrice1 = 4990;
    const updatedPrice2 = 3990;

    it("...should allow owner to create a store for new store owner", async () => {
        const storeManagerInstance = await StoreManager.deployed();

        // Contract owner creates a new store
        await storeManagerInstance.createNewStore(storeName, storeOwner, { from: owner });

        // Get store information
        const storeInfo = await storeManagerInstance.getMyStoreInfo({ from: storeOwner });

        // Verify the correct store information
        assert.equal(storeInfo[0], 0, "Store wasn't crated.");
        assert.equal(storeInfo[1], storeName, "Store wasn't crated.");
        assert.equal(storeInfo[2], 0, "Store wasn't crated.");
    });

    it("...should not allow to create a second store for an existing store owner", async () => {
        const storeManagerInstance = await StoreManager.deployed();

        // Get store information (from a previous test)
        let storeInfo = await storeManagerInstance.getMyStoreInfo({ from: storeOwner });
        assert.equal(storeInfo[0], 0, "Store wasn't crated.");
        assert.equal(storeInfo[1], storeName, "Store wasn't crated.");
        assert.equal(storeInfo[2], 0, "Store wasn't crated.");

        // Contract owner tries to create a new store for the same account (this should fail)
        try {
            await storeManagerInstance.createNewStore("My second store", storeOwner, { from: owner });
            assert.fail('Expected exception not thrown!');
        } catch (error) {
            if (error instanceof AssertionError) {
                // Rise up the assertion fail error
                throw error;
            }
        }

        // Get store information (it should return the same result as previous call)
        storeInfo = await storeManagerInstance.getMyStoreInfo({ from: storeOwner });


        // Verify the correct store information
        assert.equal(storeInfo[0], 0, "Store wasn't crated.");
        assert.equal(storeInfo[1], storeName, "Store wasn't crated.");
        assert.equal(storeInfo[2], 0, "Store wasn't crated.");

    });

    it("...should allow store owner to create a new items", async () => {
        const storeManagerInstance = await StoreManager.deployed();

        // Create a new items in the store
        await storeManagerInstance.addNewItemToMyStore(isoCurrency, "Mastering Bitcoin", initialPrice, { from: storeOwner });
        await storeManagerInstance.addNewItemToMyStore(isoCurrency, "Mastering Ethereum", initialPrice, { from: storeOwner });
        
        // Get store information 
        let storeInfo = await storeManagerInstance.getMyStoreInfo({ from: storeOwner });
        let storeId = storeInfo[0];
        let numberOfItems = storeInfo[2];
        assert.equal(numberOfItems, 2, "Two items weren't created and saved under the store.");
        
        // Get and verify the first item
        let itemInfo1 = await storeManagerInstance.getItemInfo(storeId, 0);
        assert.equal(itemInfo1[0], 0, "Item's id doesn't match with the expexted one.");
        assert.equal(itemInfo1[1], isoCurrency, "Item's currency doesn't match with the expexted one.");
        assert.equal(itemInfo1[2], "Mastering Bitcoin", "Item's name doesn't match with the expexted one.");
        assert.equal(itemInfo1[3], initialPrice, "Item's price doesn't match with the expexted one.");
        assert.equal(itemInfo1[4], 1, "Item's number of price entries doesn't match with the expexted one.");
        
        // Get and verify the first item
        let itemInfo2 = await storeManagerInstance.getItemInfo(storeId, 1);
        assert.equal(itemInfo2[0], 1, "Item's id doesn't match with the expexted one.");
        assert.equal(itemInfo2[1], isoCurrency, "Item's currency doesn't match with the expexted one.");
        assert.equal(itemInfo2[2], "Mastering Ethereum", "Item's name doesn't match with the expexted one.");
        assert.equal(itemInfo2[3], initialPrice, "Item's price doesn't match with the expexted one.");
        assert.equal(itemInfo2[4], 1, "Item's number of price entries doesn't match with the expexted one.");
    });
    
    it("...should allow store owner to update the price on the items", async () => {
        const storeManagerInstance = await StoreManager.deployed();
        
        // Get store information 
        let storeInfo = await storeManagerInstance.getMyStoreInfo({ from: storeOwner });
        let storeId = storeInfo[0];
        
        // Update price for the first item (the one created in previous test)
        await storeManagerInstance.updateItemPrice(0, updatedPrice1, { from: storeOwner });
        await storeManagerInstance.updateItemPrice(0, updatedPrice2, { from: storeOwner });
        
        // Get item and verify the its price
        let itemInfo1 = await storeManagerInstance.getItemInfo(storeId, 0);
        assert.equal(itemInfo1[0], 0, "Item's id doesn't match with the expexted one.");
        assert.equal(itemInfo1[1], isoCurrency, "Item's currency doesn't match with the expexted one.");
        assert.equal(itemInfo1[2], "Mastering Bitcoin", "Item's name doesn't match with the expexted one.");
        assert.equal(itemInfo1[3], updatedPrice2, "Item's price doesn't match with the expexted one.");
        assert.equal(itemInfo1[4], 3, "Item's number of price entries doesn't match with the expexted one.");
        
        // Verify each price enty
        for (let index = 0; index < itemInfo1[4]; index++) {
            let priceRecord = await storeManagerInstance.getPriceForItemAtIndex(storeId, 0, index);
            let price = priceRecord[0]
            if (index == 0) {
                assert.equal(price, initialPrice);
            }
            else if (index == 1) {
                assert.equal(price, updatedPrice1);
            }
            else if (index == 2) {
                assert.equal(price, updatedPrice2);
            }
            
        }
    });
    
    it("...should not allow user who is not store admin to create new items", async () => {
        const storeManagerInstance = await StoreManager.deployed();
        
        try {
            // Create new item and add it to the store
            await storeManagerInstance.addNewItemToMyStore(isoCurrency, "New item", initialPrice, { from: randomUser });
            assert.fail('Expected exception not thrown!');
        } catch (error) {
            if (error instanceof AssertionError) {
                // Rise up the assertion fail error
                throw error;
            }
        }
    });
    
    it("...should not allow user who is not store admin to update price on the items", async () => {
        const storeManagerInstance = await StoreManager.deployed();
        
        try {
            // Update the price on the item
            await storeManagerInstance.updateItemPrice(0, updatedPrice1, { from: randomUser });
            assert.fail('Expected exception not thrown!');
        } catch (error) {
            if (error instanceof AssertionError) {
                // Rise up the assertion fail error
                throw error;
            }
        }
    });
    
    it("...should not allow user who is not store admin to add new store admin", async () => {
        const storeManagerInstance = await StoreManager.deployed();
        
        try {
            // Addding a new store admin
            await storeManagerInstance.addAdminToMyStore(additionalStoreAdmin, { from: randomUser });
            assert.fail('Expected exception not thrown!');
        } catch (error) {
            if (error instanceof AssertionError) {
                // Rise up the assertion fail error
                throw error;
            }
        }
    });

    it("...should allow user who is store admin to add new store admin", async () => {
        const storeManagerInstance = await StoreManager.deployed();

        // Get store information 
        let storeInfo = await storeManagerInstance.getMyStoreInfo({ from: storeOwner });
        let storeId = storeInfo[0];
        
        // Addding a new store admin
        await storeManagerInstance.addAdminToMyStore(additionalStoreAdmin, { from: storeOwner });
        
        // Verify that a user was successfully granted an admin role
        let validation = await storeManagerInstance.isStoreAdmin(storeId, additionalStoreAdmin)
        assert.equal(validation, true, "User address wan't granted an admin role!");
        
        // Verify that a new user can create a new item and update the price of the item
        await storeManagerInstance.addNewItemToMyStore(isoCurrency, "New item", initialPrice, { from: additionalStoreAdmin });
        await storeManagerInstance.updateItemPrice(2, updatedPrice1, { from: additionalStoreAdmin });
        let itemInfo = await storeManagerInstance.getItemInfo(storeId, 2);
        assert.equal(itemInfo[3], updatedPrice1, "Item's price doesn't match with the expexted one.");
    });

});

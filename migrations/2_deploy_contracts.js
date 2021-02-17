var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var StoreManager = artifacts.require("./StoreManager.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(StoreManager);
};

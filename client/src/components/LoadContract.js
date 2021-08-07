// ReactJS components
import React, { useState, useEffect } from "react";

// Local ReactJS components
import MetaMaskLogo from "../components/img/metamask.svg";

// MaterialUI components
import Button from "@material-ui/core/Button";

// Ethereum contracts
import StoreManager from "../contracts/StoreManager.json";
import getWeb3 from "../getWeb3";

export default function LoadContract() {
  const [contractInfo, setContractInfo] = useState(null);

  async function loadStoreManagerContract() {
    // Get network provider and web3 instance.
    const web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();

    //Getting the ethereum network id (Mainnet, Testnet, Ropsten, ...)
    const networkId = await web3.eth.net.getId();

    const storeManager = new web3.eth.Contract(
      StoreManager.abi,
      StoreManager.networks[networkId] &&
        StoreManager.networks[networkId].address
    );

    setContractInfo({
      web3: web3,
      accounts: accounts,
      storeManager: storeManager,
    });
    
    alert("MetaMask wallet connected!")
  }

  return (
    <div>
      <img src={MetaMaskLogo} alt="metamasklogo.svg" width="50" height="50" />
      <Button
        color="secondary"
        variant="contained"
        size="large"
        component="a"
        onClick={loadStoreManagerContract}
      >
        Connect to MetaMask
      </Button>
    </div>
  );
}

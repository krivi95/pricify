// ReactJS components
import React, { useState, useEffect } from "react";

// Ethereum contracts
import StoreManager from "../contracts/StoreManager.json";
import getWeb3 from "../getWeb3";


export default function LoadContract() {
    const [contractInfo, setContractInfo] = useState(null);

    useEffect(() => {
        loadStoreManagerContract();
    });

    async function loadStoreManagerContract() {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        //Getting the ethereum network id (Mainnet, Testnet, Ropsten, ...)
        const networkId = await web3.eth.net.getId();

        const storeManager = new web3.eth.Contract(
            StoreManager.abi,
            StoreManager.networks[networkId] && StoreManager.networks[networkId].address
        );

        setContractInfo({
            web3: web3,
            accounts: accounts,
            storeManager: storeManager
        });


    }

    return (
        <div>
            <button onClick={loadStoreManagerContract}>
                Connect to MetaMask
            </button>
        </div>
    );
}

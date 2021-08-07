//  ReactJS components
import React, { useState } from "react";

// Placeholder for smart contract values
const defaultContractInfo = { web3: null, accounts: null, storeManager: null };

// Smart contract context to be used in nested copoments
export const SmartContractContext = React.createContext({ contractInfo: null });

// Provides sets null values for smart contract context
// context has first to be updates by one of the child components, the one that loads the web3
// before context is used in other nested components to interact with the smart contract
export const SmartContractProvider = ({ children }) => {
  const [contractInfo, setContractInfo] = useState(defaultContractInfo);

  return (
    <SmartContractContext.Provider
      value={{ contractInfo: contractInfo, setContractInfo }}
    >
      {children}
    </SmartContractContext.Provider>
  );
};

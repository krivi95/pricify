// ReactJS components
import React, { useState, useEffect, useContext } from "react";

//  Material-UI imports
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Divider from "@material-ui/core/Divider";

// Firebase
import firebase from "../../firebase/firebase";

// Local ReactJS components
import { default as CustomTypography } from "../landingpage/modules/components/Typography";
import { SmartContractContext } from "../../context/SmartContractContext";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../Loading";

function Stats() {
  const [isLoading, setIsLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState(null);
  const smartContractContext = useContext(SmartContractContext);
  const currentUser = useContext(AuthContext);

  useEffect(() => {
    async function getStoreInfo() {
      /**
       * Collect info on store both from the StoreManager smart contract and Firebase DB
       */

      // Getting firebase Store Id from user's record
      let firebaseStoreId = null;
      var firebaseUserId = currentUser.currentUser.uid;
      var userRef = firebase.database().ref("users/" + firebaseUserId);
      await userRef.once("value", (snapshot) => {
        firebaseStoreId = snapshot.val().storeId;
      });

      let numOfStoreAdmins = null;
      var storeRef = firebase.database().ref("stores/" + firebaseStoreId);
      await storeRef.once("value", (snapshot) => {
        numOfStoreAdmins = snapshot.val().numOfStoreAdmins;
      });

      // Read store info from the StoreManager contract (getMyStoreInfo method)
      if (smartContractContext.contractInfo.storeManager) {
        try {
          let storeInfo =
            await smartContractContext.contractInfo.storeManager.methods
              .getMyStoreInfo()
              .call({ from: smartContractContext.contractInfo.accounts[0] });
          setStoreInfo({
            storeId: storeInfo[0],
            name: storeInfo[1],
            numOfItems: storeInfo[2],
            numOfStoreAdmins: numOfStoreAdmins,
          });
          setIsLoading(false);
        } catch (error) {
          console.log(error.message);
          alert(error.message);
        }
      } else {
        alert(
          "MetaMask hasn't been connected. Please conenct you're MetaMask wallet on home page and then continue"
        );
      }
    }

    getStoreInfo();
  }, []);

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <React.Fragment>
        <CustomTypography
          variant="h5"
          gutterBottom
          marked="center"
          align="center"
        >
          <span style={{ fontWeight: "lighter", fontFamily: "monospace" }}>
            Overview of store's number of products and admins:
          </span>
        </CustomTypography>
        &nbsp;
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Store name</b>
              </TableCell>
              <TableCell>
                <b>Store id (smart contract)</b>
              </TableCell>
              <TableCell>
                <b>Number of items</b>
              </TableCell>
              <TableCell>
                <b>Number of admins</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={storeInfo.storeId}>
              <TableCell>{storeInfo.name}</TableCell>
              <TableCell>{storeInfo.storeId}</TableCell>
              <TableCell>{storeInfo.numOfItems}</TableCell>
              <TableCell>{storeInfo.numOfStoreAdmins}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}
export default Stats;

// ReactJS components
import React, { useState, useEffect } from "react";

//  Material-UI imports
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

// Firebase
import firebase from "../../firebase/firebase";

// Local ReactJS components
import Title from "./Title";
import Loading from "../Loading";

function Stats() {
  const [stores, setStores] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getStores() {
        /**
         * Getting the leas from database (Stats from Landing Page)
         */
      var storesRef = firebase.database().ref("stores");
      var allStores = [];
      await storesRef.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          allStores.push(childSnapshot.val());
        });
      });
      setStores(allStores);
      setIsLoading(false);
    }

    getStores();
  }, []);

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <React.Fragment>
        <h1>Pricify statistics</h1>
        <Title>Overview of user activity, stores, number of products:</Title>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Store name</b></TableCell>
              <TableCell><b>Store owner</b></TableCell>
              <TableCell><b>Store owner ETH address</b></TableCell>
              <TableCell><b>Creation time</b></TableCell>
              <TableCell><b>Number of store items</b></TableCell>
              <TableCell><b>Number of store admins</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((row) => (
              <TableRow key={row.ownerUserId}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.ownerEmail}</TableCell>
                <TableCell>{row.ownerEthAddress}</TableCell>
                <TableCell>{row.creationTime}</TableCell>
                <TableCell>{row.numOfItems}</TableCell>
                <TableCell>{row.numOfStoreAdmins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}
export default Stats;

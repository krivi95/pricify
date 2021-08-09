// ReactJS components
import React, { useState, useEffect } from "react";

// Local ReactJS components
import { default as CustomTypography } from "../landingpage/modules/components/Typography";
import NewProduct from "./NewProduct";
import ProductTable from "./ProductTable";

//  Material-UI imports
import { Box } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";

// Firebase
import firebase from "../../firebase/firebase";

function Products() {
  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");

  // Loading user's name
  useEffect(() => {
    // Logged user uuid
    var userUuid = firebase.auth().currentUser.uid;

    // Getting first and last name
    var userData = firebase.database().ref("users/" + userUuid);
    userData.on("value", (snapshot) => {
      const data = snapshot.val();
      setName(data.firstName + " " + data.lastName);
      setStoreName(data.storeName);
    });
  }, [name]);

  return (
    <React.Fragment>
      <Box display="flex">
        <Box m="auto">
          <NewProduct />
          &nbsp;
          <Divider />
          &nbsp;
          <ProductTable />
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default Products;

// ReactJS components
import React, { useState, useEffect } from "react";

// Local ReactJS components
import LoadContract from "../LoadContract";
import { default as CustomTypography } from "../landingpage/modules/components/Typography";

//  Material-UI imports
import { Box } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";

// Firebase
import firebase from "../../firebase/firebase";

function Home() {
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
          <CustomTypography
            variant="h5"
            gutterBottom
            marked="center"
            align="center"
          >
            <span style={{ fontWeight: "lighter", fontFamily: "monospace" }}>
              Welcome {name}!
            </span>
          </CustomTypography>
          <CustomTypography
            variant="subtitle2"
            gutterBottom
            marked="center"
            align="center"
          >
            <span style={{ fontWeight: "lighter", fontFamily: "monospace" }}>
              As admin of <b>{storeName}</b>, you can add/remove admins for a
              store, view store statistics, manage items in store, add new
              items, update the items' price, generate QR code for customers to
              check the items' price and many more.
            </span>
          </CustomTypography>
          <Divider />
          &nbsp;
          <CustomTypography
            variant="subtitle1"
            gutterBottom
            marked="center"
            align="center"
          >
            <span style={{ fontWeight: "lighter", fontFamily: "monospace" }}>
              But before you continue, please connect your MetaMask wallet to
              Pricify DApp:
            </span>
          </CustomTypography>
          <LoadContract />
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default Home;

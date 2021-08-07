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

function StoreHomeScreen() {
  const [name, setName] = useState("");

  // Loading user's name
  useEffect(() => {
    // Logged user uuid
    var userUuid = firebase.auth().currentUser.uid;

    // Getting first and last name
    var userData = firebase.database().ref("users/" + userUuid);
    userData.on("value", (snapshot) => {
      const data = snapshot.val();
      setName(data.firstName + " " + data.lastName);
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
              As admin, from this dashboards, you can view the call to action
              messages from the landing page, manage users and look at basis
              stats of smart contracts.
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

export default StoreHomeScreen;

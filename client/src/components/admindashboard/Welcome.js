// ReactJS components
import React, { useState, useEffect } from "react";

//  Material-UI imports
import { Box } from "@material-ui/core";

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
      <Box display="flex" height={800}>
        <Box m="auto">
          <h2>Welcome {name}!</h2>
          <h3>
            You can view the call to action messages from the landing page,
            manage users and look at basis stats of smart contracts.
          </h3>
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default StoreHomeScreen;

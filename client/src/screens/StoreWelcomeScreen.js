// ReactJS components
import React from "react";

// Local ReactJS components
import AppAppBar from "../components/landingpage/modules/views/AppAppBar";
import AppFooter from "../components/landingpage/modules/views/AppFooter";
import withRoot from "../components/landingpage/modules/withRoot";

//  Material-UI imports
import { Box } from "@material-ui/core";

function StoreHomeScreen() {
  return (
    <React.Fragment>
      <AppAppBar />
      <Box display="flex" height={800}>
        <Box m="auto">
          <h2>Welcome! Thanks for registering with us!</h2>
          <h3>
            Please wait while your store is being created on the Ethereum
            blockchain. We'll send an email when everyhting is ready.
          </h3>
        </Box>
      </Box>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(StoreHomeScreen);

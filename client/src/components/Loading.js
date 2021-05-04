//  ReactJS components
import React from "react";

// Local ReactJS components
import AppAppBar from "../components/landingpage/modules/views/AppAppBar";
import AppFooter from "../components/landingpage/modules/views/AppFooter";
import withRoot from "../components/landingpage/modules/withRoot";

//  Material-UI imports
import CircularProgress from "@material-ui/core/CircularProgress";
import { Box } from "@material-ui/core";

function Loading() {
  return (
    <React.Fragment>
      <AppAppBar />
      <Box display="flex" height={500}>
        <Box m="auto">
          <h2>Loading...</h2>
          <CircularProgress color="secondary" />
        </Box>
      </Box>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Loading);

// ReactJS components
import React from "react";
import clsx from "clsx";

// Local ReactJS components
import AppFooter from "../components/landingpage/modules/views/AppFooter";

//  Material-UI imports
import { Box } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

// Firebase
import firebase from "../firebase/firebase";

// React Router
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    backgroundColor: "black",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
  },
}));

function StoreHomeScreen() {
  const classes = useStyles();
  const history = useHistory();
  const [redirectPage, setRedirectPage] = React.useState(null);
  const [name, setName] = React.useState("");

  // Loading user's name
  React.useEffect(() => {
    // Logged user uuid
    var userUuid = firebase.auth().currentUser.uid;

    // Getting first and last name
    var userData = firebase.database().ref("users/" + userUuid);
    userData.on("value", (snapshot) => {
      const data = snapshot.val();
      setName(data.firstName + " " + data.lastName);
    });
  }, [name]);

  // Home screen, but keep bein logged in
  const home = () => {
    firebase.auth().signOut();
    history.push("/");
  };

  // Logging out of admin page
  const logout = () => {
    firebase.auth().signOut();
    setRedirectPage(<Redirect push to="/" />);
  };

  // If user has logged out
  if (redirectPage != null) {
    return redirectPage;
  } else {
    return (
      <React.Fragment>
        <AppBar position="absolute" className={clsx(classes.appBar)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              className={clsx(classes.menuButton)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              <IconButton color="inherit" onClick={home}>
                PRICIFY
              </IconButton>
            </Typography>
            <IconButton color="inherit" onClick={logout}>
              LOGOUT
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box display="flex" height={800}>
          <Box m="auto">
            <h2>Welcome {name}! Thanks for registering with us!</h2>
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
}

export default StoreHomeScreen;

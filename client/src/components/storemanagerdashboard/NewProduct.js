// ReactJS components
import React, { useState, useContext } from "react";

// MaterialUI components
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";

// Local ReactJS components
import { default as CustomTypography } from "../landingpage/modules/components/Typography";
import { SmartContractContext } from "../../context/SmartContractContext";
import isoCurrencyMapping from "../currencies";

//  Material-UI imports
import { Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

// Firebase
import firebase from "../../firebase/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    button: {
      width: "100%",
    },
  },
}));

const currencyLabels = [
  {
    value: "USD",
    label: "$",
  },
  {
    value: "EUR",
    label: "€",
  },
  {
    value: "JPY",
    label: "¥",
  },
  {
    value: "RSD",
    label: "RSD",
  },
];

function NewProduct() {
  const classes = useStyles();
  const smartContractContext = useContext(SmartContractContext);
  const [isFormVisible, setIsFormVisibility] = useState(false);
  const [inputData, setInputData] = React.useState({
    name: "",
    price: "",
    currency: "USD",
  });
  const [currency, setCurrency] = useState("EUR");

  const toggleForm = () => {
    /**
     * Shows/hides form for creating a new product
     */
    setIsFormVisibility(!isFormVisible);
  };

  const createNewProduct = async () => {
    /**
     * Creates new product: rocord on blockchain and increasing counter in firebase db
     */

    if (!inputData.name || !inputData.currency) {
      alert("Please enter a product name and price!");
    }

    // Add new product through StoreManager contract (addNewItemToMyStore method)
    if (smartContractContext.contractInfo.storeManager) {
      try {
        await smartContractContext.contractInfo.storeManager.methods
          .addNewItemToMyStore(
            isoCurrencyMapping[inputData.currency],
            inputData.name,
            inputData.price
          )
          .send({ from: smartContractContext.contractInfo.accounts[0] });
      } catch (error) {
        console.log(error.message);
        alert(error.message);
        return;
      }
    } else {
      alert(
        "MetaMask hasn't been connected. Please conenct you're MetaMask wallet on home page and then continue"
      );
      return;
    }

    // Getting firebase Store Id from user's record
    let firebaseStoreId = null;
    var firebaseUserId = firebase.auth().currentUser.uid;
    var userRef = firebase.database().ref("users/" + firebaseUserId);
    await userRef.once("value", (snapshot) => {
      firebaseStoreId = snapshot.val().storeId;
    });

    // Current number of store items
    let numOfItems = null;
    var storeRef = firebase.database().ref("stores/" + firebaseStoreId);
    await storeRef.once("value", (snapshot) => {
      numOfItems = snapshot.val().numOfItems;
    });

    // Updating store record in the Firebase database
    storeRef = firebase.database().ref("stores").child(firebaseStoreId);
    await storeRef.update({
      numOfItems: numOfItems + 1,
    });

    console.log();
    alert("Product " + inputData.name + "has been added to the blockchain.");
  };

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
            <div>
              <span style={{ fontWeight: "lighter", fontFamily: "monospace" }}>
                New product:
              </span>
            </div>
            <IconButton onClick={toggleForm}>
              <div>
                <CustomTypography
                  variant="subtitle2"
                  gutterBottom
                  marked="center"
                  align="center"
                >
                  <span
                    style={{ fontWeight: "lighter", fontFamily: "monospace" }}
                  >
                    {isFormVisible ? "(see less)" : "(see more)"}
                  </span>
                </CustomTypography>
              </div>
              <div>
                {isFormVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
            </IconButton>
          </CustomTypography>
          {isFormVisible && (
            <form className={classes.root}>
              <div>
                <TextField
                  name="name"
                  id="Name"
                  label="Name"
                  variant="outlined"
                  onChange={(e) =>
                    setInputData({ ...inputData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <TextField
                  name="price"
                  id="Price"
                  label="Price"
                  variant="outlined"
                  onChange={(e) =>
                    setInputData({ ...inputData, price: parseInt(e.target.value) })
                  }
                />
                <TextField
                  name="currency"
                  id="Currency"
                  select
                  label="Select"
                  value="USD"
                  helperText="Please select your currency"
                  variant="outlined"
                  onChange={(e) =>
                    setInputData({ ...inputData, currency: e.target.value })
                  }
                >
                  {currencyLabels.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <Button
                color="secondary"
                variant="contained"
                className={classes.button}
                onClick={createNewProduct}
              >
                Add new product
              </Button>
            </form>
          )}
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default NewProduct;

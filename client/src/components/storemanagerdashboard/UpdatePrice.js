import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CreateIcon from "@material-ui/icons/Create";
import { red } from "@material-ui/core/colors";
import { Box } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

// Local ReactJS components
import { default as CustomTypography } from "../landingpage/modules/components/Typography";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: "#fbf3fb",
  },
}));

export default function UpdatePrice(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [inputData, setInputData] = React.useState({
    newPrice: null,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const updateProductPrice = async () => {
    /**
     * Updates the item's price: new price record for Item, in a store, on the blockchain
     */

    if (!inputData.newPrice) {
      alert("Please enter a new price!");
      return;
    }

    // Add new price record on blockchain
    await props.smartContractContext.contractInfo.storeManager.methods
      .updateItemPrice(props.productId, inputData.newPrice)
      .send({ from: props.smartContractContext.contractInfo.accounts[0] });

    alert("Price was updated.");
    handleClose();
  };

  return (
    <span>
      <IconButton
        color="primary"
        aria-label="add to shopping cart"
        size="small"
        onClick={handleToggle}
      >
        <p style={{ color: red[500] }}>Update price</p>
        &nbsp;
        <CreateIcon style={{ color: red[500] }} />
      </IconButton>
      <Backdrop className={classes.backdrop} open={open}>
        <Box display="flex">
          <Box m="auto">
            <Paper elevation={3} className={classes.paper}>
              <CustomTypography
                variant="h4"
                gutterBottom
                marked="center"
                align="center"
              >
                Update price:
              </CustomTypography>
              <form>
                <div>
                  <TextField
                    name="New Price"
                    id="New Price"
                    label="New Price"
                    variant="outlined"
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        newPrice: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                &nbsp;
                <div>
                  <Button
                    color="secondary"
                    variant="contained"
                    className={classes.button}
                    onClick={updateProductPrice}
                  >
                    Update
                  </Button>
                  &nbsp;
                  <Button
                    color="secondary"
                    variant="contained"
                    className={classes.button}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Paper>
          </Box>
        </Box>
      </Backdrop>
    </span>
  );
}

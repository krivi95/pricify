// ReactJS components
import React, { useState } from "react";

// MaterialUI components
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";

// Local ReactJS components
import { default as CustomTypography } from "../landingpage/modules/components/Typography";

//  Material-UI imports
import { Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

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
  const [isFormVisible, setIsFormVisibility] = useState(false);
  const [currency, setCurrency] = useState("EUR");

  const toggleForm = () => {
    setIsFormVisibility(!isFormVisible);
  };

  const handleChange = (event) => {
    setCurrency(event.target.value);
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
                  id="Name"
                  label="Name"
                  defaultValue="Product name"
                  variant="outlined"
                />
              </div>
              <div>
                <TextField
                  id="Price"
                  label="Price"
                  defaultValue="Price"
                  variant="outlined"
                />
                <TextField
                  id="Currency"
                  select
                  label="Select"
                  value={currency}
                  onChange={handleChange}
                  helperText="Please select your currency"
                  variant="outlined"
                >
                  {currencyLabels.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                className={classes.button}
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

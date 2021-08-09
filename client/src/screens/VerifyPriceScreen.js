// ReactJS components
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

// MaterialUI components
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

// Local ReactJS components
import Typography from "../components/landingpage/modules/components/Typography";
import AppFooter from "../components/landingpage/modules/views/AppFooter";
import AppAppBar from "../components/landingpage/modules/views/AppAppBar";
import withRoot from "../components/landingpage/modules/withRoot";
import { SmartContractContext } from "../context/SmartContractContext";
import LoadContract from "../components/LoadContract";
import { isoCurrencyMappingRevert } from "../components/currencies";

// Plotly
import Plot from "react-plotly.js";

const styles = (theme) => ({
  root: {
    display: "flex",
    overflow: "hidden",
    marginBottom: theme.spacing(2),
  },
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    backgroundColor: "#fbf3fb",
    padding: 25,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(0, 5),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  button: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    minWidth: 200,
  },
});

function VerifyPriceScreen(props) {
  // material-ui styles
  const { classes } = props;

  // Get url parameters
  let { storeId, productId } = useParams();

  // Smart contract context (after connecting MetaMast it should be loaded)
  const smartContractContext = useContext(SmartContractContext);

  // Hook states
  const [isLoading, setIsLoading] = useState(true);
  const [productName, setProductName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [oldPrice, setOldPrice] = useState(null);
  const [currency, setCurrency] = useState("");
  const [priceDifference, setPriceDifference] = useState(null);
  const [showPrices, setShowPrices] = useState(false);
  const [priceDates, setPriceDates] = useState(false);
  const [priceAmounts, setPriceAmounts] = useState(false);

  useEffect(() => {
    async function loadData() {
      // Read store info from the StoreManager contract (getMyStoreInfo method)
      if (smartContractContext.contractInfo.storeManager) {
        try {
          let item =
            await smartContractContext.contractInfo.storeManager.methods
              .getItemInfo(storeId, productId)
              .call();

          // Update state (most recent product info)
          setProductName(item[2]);
          setCurrentPrice(item[3]);
          setCurrency(isoCurrencyMappingRevert[parseInt(item[1])]);

          // Getting the item's historical prices
          let priceChangeDates = [];
          let prices = [];
          let numOfPriceChanges = item[4];
          for (
            let priceIndex = 0;
            priceIndex < numOfPriceChanges;
            priceIndex++
          ) {
            let priceRecord =
              await smartContractContext.contractInfo.storeManager.methods
                .getPriceForItemAtIndex(storeId, productId, priceIndex)
                .call();

            // Add price
            prices.push(parseInt(priceRecord[0]));

            // Add date
            let utcSeconds = parseInt(priceRecord[1]);
            let utcMilliseconds = new Date(0); // The 0 there is the key, which sets the date to the epoch
            utcMilliseconds = utcMilliseconds.setUTCSeconds(utcSeconds);
            priceChangeDates.push(new Date(utcMilliseconds));
          }

          // Getting the previous price and calculating recent price change
          let currentPrice = item[3];
          let oldPrice = null;
          if (numOfPriceChanges - 2 >= 0) {
            oldPrice = prices[numOfPriceChanges - 2];
            setOldPrice(oldPrice);
          }
          if (currentPrice != null && oldPrice != null) {
            setPriceDifference(
              ((100 * (oldPrice - currentPrice)) / oldPrice).toFixed(2)
            );
          }

          // Updating the state (historical price data for the plots)
          setPriceDates(priceChangeDates);
          setPriceAmounts(prices);

          // Geting the store info
          // (for getting the store name)
          let storeInfo =
            await smartContractContext.contractInfo.storeManager.methods
              .getStoreInfoById(storeId)
              .call();
          setStoreName(storeInfo[1]);
        } catch (error) {
          console.log(error.message);
          alert(error.message);
          return;
        }

        setIsLoading(false);
      } else {
        alert(
          "MetaMask hasn't been connected. Please conenct you're MetaMask wallet on home page and then continue"
        );
        return;
      }
    }

    loadData();
  }, [smartContractContext]);

  function seePriceHistory() {
    setShowPrices(!showPrices);
  }

  // calculating relative price change
  let pnlInfo = "/";
  if (priceDifference > 0) {
    pnlInfo = (
      <span style={{ color: "red", fontWeight: "bold" }}>
        {Math.abs(priceDifference)}%
        <TrendingDownIcon />
      </span>
    );
  } else if (priceDifference < 0) {
    pnlInfo = (
      <span style={{ color: "green", fontWeight: "bold" }}>
        {Math.abs(priceDifference)}%
        <TrendingUpIcon />
      </span>
    );
  }

  if (isLoading) {
    return (
      <React.Fragment>
        <AppAppBar />
        <section className={classes.root}>
          <Container className={classes.container} height={800}>
            <Typography
              variant="h3"
              gutterBottom
              marked="center"
              align="center"
            >
              <span style={{ fontWeight: "lighter", fontFamily: "monospace" }}>
                Verify the price
              </span>
            </Typography>
            <Grid container spacing={5}>
              <Grid item xs={12} md={2}></Grid>
              <Grid item xs={12} md={8}>
                <Paper elevation={3} className={classes.paper} height={800}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    marked="center"
                    align="center"
                  >
                    <span
                      style={{ fontWeight: "lighter", fontFamily: "monospace" }}
                    >
                      Before you can verify the product discount and price
                      history, please connect your MetaMask wallet to Pricify
                      DApp:
                    </span>
                  </Typography>
                  <LoadContract />
                </Paper>
              </Grid>
              <Grid item xs={12} md={2}></Grid>
            </Grid>
          </Container>
        </section>
        <AppFooter />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <AppAppBar />
        <section className={classes.root}>
          <Container className={classes.container}>
            <Typography
              variant="h3"
              gutterBottom
              marked="center"
              align="center"
            >
              <span style={{ fontWeight: "lighter", fontFamily: "monospace" }}>
                Verify the price
              </span>
            </Typography>
            <Grid container spacing={5}>
              <Grid item xs={12} md={2}></Grid>
              <Grid item xs={12} md={8}>
                <Paper elevation={3} className={classes.paper}>
                  <div className={classes.item}>
                    <Typography variant="h5" align="center">
                      {productName}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                      Store: {storeName}
                    </Typography>
                  </div>
                  <Divider variant="middle" />
                  <div className={classes.item}>
                    <Typography variant="h6" align="center">
                      Current price: {currentPrice} {currency}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                      (Old price: {oldPrice} {currency})
                    </Typography>
                    <Typography variant="h6" align="center">
                      Price change:&nbsp;
                      {pnlInfo}
                    </Typography>
                    <Button
                      color="secondary"
                      variant="contained"
                      size="large"
                      className={classes.button}
                      component="a"
                      onClick={seePriceHistory}
                    >
                      See price history
                    </Button>
                  </div>
                  <div className={classes.item}>
                    {showPrices && (
                      <div>
                        <Typography variant="h5" align="center">
                          Historical price changes
                        </Typography>
                        <Divider variant="middle" />
                        <div className={classes.item}>
                          <Paper elevation={1}>
                            <Plot
                              data={[
                                {
                                  x: priceDates,
                                  y: priceAmounts,
                                  type: "scatter",
                                  fill: "tozeroy",
                                  mode: "lines+markers",
                                  marker: { color: "pink" },
                                },
                              ]}
                              layout={{
                                width: 520,
                                height: 340,
                                title: "Price changes over time",
                              }}
                            />
                          </Paper>
                        </div>
                      </div>
                    )}
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12} md={2}></Grid>
            </Grid>
          </Container>
        </section>
        <AppFooter />
      </React.Fragment>
    );
  }
}

export default withRoot(withStyles(styles)(VerifyPriceScreen));

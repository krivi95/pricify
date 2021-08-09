// ReactJS components
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

// Local ReactJS components
import { default as CustomTypography } from "../landingpage/modules/components/Typography";
import { SmartContractContext } from "../../context/SmartContractContext";
import { isoCurrencyMappingRevert } from "../currencies";
import Loading from "../Loading";
import UpdatePrice from "./UpdatePrice";

//  Material-UI imports
import { Box } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import GetAppIcon from "@material-ui/icons/GetApp";
import Tooltip from "@material-ui/core/Tooltip";
import { red } from "@material-ui/core/colors";

function createTableRows(allProducts, smartContractContext, routeToVerifyPage) {
  let tableRows = [];
  for (let key in allProducts) {
    tableRows.push(
      <TableRow key={key}>
        <TableCell>{allProducts[key].id}</TableCell>
        <TableCell>{allProducts[key].name}</TableCell>
        <TableCell align="right">
          {allProducts[key].currentPrice} {allProducts[key].currency}
        </TableCell>
        <TableCell align="right">{allProducts[key].numberOfPrices}</TableCell>
        <TableCell align="right">
          <Tooltip title="Download QR code for varifying the product price">
            <IconButton
              color="primary"
              aria-label="add to shopping cart"
              size="small"
            >
              <GetAppIcon style={{ color: red[500] }} />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell>
          <UpdatePrice
            productId={allProducts[key].id}
            smartContractContext={smartContractContext}
          />
          <Tooltip title="See more product details">
            <IconButton
              color="primary"
              aria-label="add to shopping cart"
              size="small"
              onClick={() =>
                routeToVerifyPage(allProducts[key].storeId, allProducts[key].id)
              }
            >
              <MoreVertIcon style={{ color: red[500] }} />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  }
  return tableRows;
}

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState(null);
  const smartContractContext = useContext(SmartContractContext);
  const history = useHistory();

  const routeToVerifyPage = (storeId, productId) => {
    /**
     * Routes to new page: /verify/:storeId/:productId"
     */
    let path = "/verify/" + storeId + "/" + productId;
    history.push(path);
  };

  useEffect(() => {
    async function getAllProducts() {
      /**
       * Gets all the products for user's store from the blockchain
       */

      // First get the store id and number of items from the StoreManager contract
      // (getMyStoreInfo and getItemInfo methods)
      if (smartContractContext.contractInfo.storeManager) {
        try {
          // Getting the store info
          let storeInfo =
            await smartContractContext.contractInfo.storeManager.methods
              .getMyStoreInfo()
              .call({ from: smartContractContext.contractInfo.accounts[0] });

          // Getting all the items from the store
          let products = [];
          for (let itemId = 0; itemId < storeInfo[2]; itemId++) {
            let item =
              await smartContractContext.contractInfo.storeManager.methods
                .getItemInfo(storeInfo[0], itemId)
                .call();
            products.push({
              id: parseInt(item[0]),
              currency: isoCurrencyMappingRevert[parseInt(item[1])],
              name: item[2],
              currentPrice: item[3],
              numberOfPrices: parseInt(item[4]),
              storeId: storeInfo[0],
            });
          }
          setProducts(products);
          setIsLoading(false);
        } catch (error) {
          console.log(error.message);
          alert(error.message);
        }
      } else {
        alert(
          "MetaMask hasn't been connected. Please conenct you're MetaMask wallet on home page and then continue"
        );
      }
    }

    getAllProducts();
  }, [products]);

  if (isLoading) {
    return <Loading />;
  } else {
    // Create table rows dinamically when products are loaded
    let rows = createTableRows(
      products,
      smartContractContext,
      routeToVerifyPage
    );

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
                List of all products:
              </span>
            </CustomTypography>
            &nbsp;
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>ID</b>
                  </TableCell>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Current price</b>
                  </TableCell>
                  <TableCell>
                    <b>Number of price changes</b>
                  </TableCell>
                  <TableCell>
                    <b>Generate QR code</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{rows}</TableBody>
            </Table>
          </Box>
        </Box>
      </React.Fragment>
    );
  }
}

export default Home;

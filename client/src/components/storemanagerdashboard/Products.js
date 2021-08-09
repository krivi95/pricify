// ReactJS components
import React from "react";

// Local ReactJS components
import NewProduct from "./NewProduct";
import ProductTable from "./ProductTable";

//  Material-UI imports
import { Box } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";

function Products() {
  return (
    <React.Fragment>
      <Box display="flex">
        <Box m="auto">
          <NewProduct />
          &nbsp;
          <Divider />
          &nbsp;
          <ProductTable />
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default Products;

// ReactJS components
import React, { useState, useEffect, useContext } from "react";

//  Material-UI imports
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import CancelIcon from "@material-ui/icons/Cancel";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { green, red } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";

// Firebase
import firebase from "../../firebase/firebase";

// Local ReactJS components
import { default as CustomTypography } from "../landingpage/modules/components/Typography";
import { SmartContractContext } from "../../context/SmartContractContext";
import Loading from "../Loading";

const createNewStore = async (event, userId, user) => {
  /**
   * Function that activates or deactivates user's access to the system
   */

  // Change the activation status flag
  user.newStore = false;

  // Update user record in the database
  const requessRef = firebase.database().ref("users").child(userId);
  await requessRef.update({
    newStore: user.newStore,
  });

  // Create a new store record in database
  var postListRef = firebase.database().ref("stores");
  var newPostRef = postListRef.push();
  newPostRef.set({
    ownerUserId: userId,
    ownerEmail: user.email,
    ownerEthAddress: user.ethAddress,
    name: user.storeName,
    numOfItems: 0, // no items yet in the store
    numOfStoreAdmins: 1, // currently only store owner
    creationTime: Date().toLocaleString(),
  });

  alert("Successfully created store on smart contarct for new user!");
};

const activateOrDeactiveteUser = async (event, userId, user) => {
  /**
   * Function that activates or deactivates user's access to the system
   */

  // Change the activation status flag
  user.activated = !user.activated;

  // Update user record in the database
  const requessRef = firebase.database().ref("users").child(userId);
  await requessRef.update({
    activated: user.activated,
  });
  user.activated
    ? alert("Successfully activated user's account!")
    : alert("Deactivated user's request!");
};

function createTableRows(allUsers) {
  let tableRows = [];
  for (let key in allUsers) {
    tableRows.push(
      <TableRow key={key}>
        <TableCell>{allUsers[key].email}</TableCell>
        <TableCell>{allUsers[key].firstName}</TableCell>
        <TableCell>{allUsers[key].lastName}</TableCell>
        <TableCell>{allUsers[key].ethAddress}</TableCell>
        <TableCell>{allUsers[key].storeName}</TableCell>
        <TableCell>
          {allUsers[key].newStore ? (
            <IconButton
              color="primary"
              aria-label="add to shopping cart"
              size="small"
              onClick={(event) => createNewStore(event, key, allUsers[key])}
            >
              <p style={{ color: green[500] }}>Create new store</p>
              &nbsp;
              <ShoppingCartIcon style={{ color: green[500] }} />
            </IconButton>
          ) : (
            "Store exists"
          )}
        </TableCell>
        <TableCell>
          <IconButton
            color="primary"
            aria-label="add to shopping cart"
            size="small"
            onClick={(event) =>
              activateOrDeactiveteUser(event, key, allUsers[key])
            }
          >
            {allUsers[key].activated ? (
              <p style={{ color: red[500] }}>Deactivate</p>
            ) : (
              <p style={{ color: green[500] }}>Activate</p>
            )}
            &nbsp;
            {allUsers[key].activated ? (
              <CancelIcon color="secondary" />
            ) : (
              <VerifiedUserIcon style={{ color: green[500] }} />
            )}
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }
  return tableRows;
}

function Users() {
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const smartContractContext = useContext(SmartContractContext);

  console.log(smartContractContext);

  useEffect(() => {
    async function getUsers() {
      /**
       * Getting the users from database
       */
      var usersRef = firebase.database().ref("users");
      await usersRef.on("value", (snapshot) => {
        const allUsers = snapshot.val();
        setUsers(allUsers);
        setIsLoading(false);
      });
    }

    getUsers();
  }, []);

  if (isLoading) {
    return <Loading />;
  } else {
    let rows = createTableRows(users);

    return (
      <React.Fragment>
        <CustomTypography
          variant="h5"
          gutterBottom
          marked="center"
          align="center"
        >
          <span style={{ fontWeight: "lighter", fontFamily: "monospace" }}>
            Allow/revoke access and create a new store on smart contract:
          </span>
        </CustomTypography>
        &nbsp;
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>First name</b>
              </TableCell>
              <TableCell>
                <b>Last name</b>
              </TableCell>
              <TableCell>
                <b>Eth Address</b>
              </TableCell>
              <TableCell>
                <b>Store name</b>
              </TableCell>
              <TableCell>
                <b>New store</b>
              </TableCell>
              <TableCell>
                <b>Activated</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </React.Fragment>
    );
  }
}
export default Users;

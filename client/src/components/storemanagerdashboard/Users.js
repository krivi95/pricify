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
import { AuthContext } from "../../context/AuthContext";
import Loading from "../Loading";

function createTableRows(allUsers, activateOrDeactiveteUser) {
  let tableRows = [];
  for (let key in allUsers) {
    // Skip store owner
    // (Nobody should be allowed to remove that account)
    if (allUsers[key].accountType == "storeOwner") {
      continue;
    }

    tableRows.push(
      <TableRow key={key}>
        <TableCell>{allUsers[key].email}</TableCell>
        <TableCell>{allUsers[key].firstName}</TableCell>
        <TableCell>{allUsers[key].lastName}</TableCell>
        <TableCell>{allUsers[key].ethAddress}</TableCell>
        <TableCell>{allUsers[key].storeName}</TableCell>
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
  const currentUser = useContext(AuthContext);
  const smartContractContext = useContext(SmartContractContext);

  useEffect(() => {
    async function getUsers() {
      /**
       * Getting the users from database
       */

      // GEtting the admin's store name
      let storeName = null;
      var firebaseUserId = currentUser.currentUser.uid;
      var userRef = firebase.database().ref("users/" + firebaseUserId);
      await userRef.once("value", (snapshot) => {
        storeName = snapshot.val().storeName;
      });

      // Getting the admins for the store
      var usersRef = firebase.database().ref("users");
      await usersRef
        .orderByChild("storeName")
        .equalTo(storeName)
        .on("value", (snapshot) => {
          const allUsers = snapshot.val();
          setUsers(allUsers);
          setIsLoading(false);
        });
    }

    getUsers();
  }, []);

  const activateOrDeactiveteUser = async (event, userId, user) => {
    /**
     * Function that activates or deactivates user's access to the system both in database and smart contract
     */

    // Change the activation status flag
    user.activated = !user.activated;

    // Add оr remove user's eth address to the store to be an admin to manage the products
    if (smartContractContext.contractInfo.storeManager) {
      try {
        user.activated
          ? await smartContractContext.contractInfo.storeManager.methods
              .addAdminToMyStore(user.ethAddress)
              .send({ from: smartContractContext.contractInfo.accounts[0] })
          : console.log("TODO:removeAdminFromMyStore");
        // : await smartContractContext.contractInfo.storeManager.methods
        //     .removeAdminFromMyStore(user.ethAddress)
        //     .send({ from: smartContractContext.contractInfo.accounts[0] });
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

    // Update user record in the database
    const requessRef = firebase.database().ref("users").child(userId);
    await requessRef.update({
      activated: user.activated,
    });
    user.activated
      ? alert(
          "Successfully activated user's account and added as store admin to the store on blockchain!"
        )
      : alert(
          "Deactivated user's account and removed as store admin to the store on blockchain!"
        );
  };

  if (isLoading) {
    return <Loading />;
  } else {
    // Create table rows dinamically when users are loaded
    let rows = createTableRows(users, activateOrDeactiveteUser);

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

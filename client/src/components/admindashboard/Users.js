// ReactJS components
import React, { useState, useEffect } from "react";

//  Material-UI imports
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

// Firebase
import firebase from "../../firebase/firebase";

// Local ReactJS components
import Title from "./Title";
import Loading from "../Loading";

function Users() {
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUsers() {
      /**
       * Getting the users from database
       */
      var usersRef = firebase.database().ref("users");
      var allUsers = Array();
      await usersRef.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          allUsers.push(childSnapshot.val());
        });
      });
      setUsers(allUsers);
      setIsLoading(false);
      console.log(allUsers);
    }

    getUsers();
  }, []);

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <React.Fragment>
        <Title>Managining users:</Title>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>First name</TableCell>
              <TableCell>Last name</TableCell>
              <TableCell>Eth Address</TableCell>
              <TableCell>Store name</TableCell>
              <TableCell>New store</TableCell>
              <TableCell>Activated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow key={row.email}>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.firstName}</TableCell>
                <TableCell>{row.lastName}</TableCell>
                <TableCell>{row.ethAddress}</TableCell>
                <TableCell>{row.storeName}</TableCell>
                <TableCell>{row.newStore}</TableCell>
                <TableCell>{row.accountType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}
export default Users;

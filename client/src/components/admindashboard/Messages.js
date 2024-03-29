// ReactJS components
import React, { useState, useEffect } from "react";

//  Material-UI imports
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Divider from "@material-ui/core/Divider";

// Firebase
import firebase from "../../firebase/firebase";

// Local ReactJS components
import Loading from "../Loading";
import { default as CustomTypography } from "../landingpage/modules/components/Typography";

function Messages() {
  const [leads, setLeads] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getLeads() {
      /**
       * Getting the leas from database (messages from Landing Page)
       */
      var leadsRef = firebase.database().ref("leads");
      var allLeads = [];
      await leadsRef.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          allLeads.push(childSnapshot.val());
        });
      });
      setLeads(allLeads);
      setIsLoading(false);
    }

    getLeads();
  }, []);

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <React.Fragment>
        <CustomTypography
          variant="h5"
          gutterBottom
          marked="center"
          align="center"
        >
          <span style={{ fontWeight: "lighter", fontFamily: "monospace" }}>
            Overview of leads from landing page:
          </span>
        </CustomTypography>
        &nbsp;
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Message</b>
              </TableCell>
              <TableCell>
                <b>Date</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((row) => (
              <TableRow key={row.date}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.message}</TableCell>
                <TableCell>{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}
export default Messages;

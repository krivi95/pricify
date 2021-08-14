import * as React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "../components/Typography";
import ReactPlayer from "react-player";


const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
  },
  images: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  image: {
    height: "auto",
    maxWidth: "100%",
    "&:hover": {
      opacity: "0.5",
      cursor: "pointer",
    },
  },
});

function ProductDemo(props) {
  const { classes } = props;
  return (
    <Container className={classes.root} component="section">
      <Typography variant="h4" marked="center" align="center" component="h2">
        Demo
      </Typography>
      <div className={classes.images}>
        <ReactPlayer url="https://www.youtube.com/watch?v=Hbln3pX-9AA" controls={true} width="100%" height="500px"/>
      </div>
    </Container>
  );
}

ProductDemo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductDemo);

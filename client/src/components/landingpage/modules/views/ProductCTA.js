import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '../components/Typography';
import TextField from '../components/TextField';
import Snackbar from '../components/Snackbar';
import Button from '../components/Button';

import firebase from '../../../../firebase/firebase'

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: 0,
    display: 'flex',
    justifyContent: 'center',
  },
  cardWrapper: {
    zIndex: 1,
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(8, 3),
  },
  cardContent: {
    maxWidth: 400,
  },
  textField: {
    width: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(5),
  },
  button: {
    width: '100%',
  },
});

function ProductCTA(props) {
  const { classes } = props;
  const [open, setOpen] = React.useState(false);
  const [inputData, setInputData] = React.useState({ message: "", email: "", name: "" });

  const handleSubmit = (event) => {
    // Displaying Snackbar message
    event.preventDefault();
    setOpen(true);

    // Submiting data to the Firebase
    var postListRef = firebase.database().ref('leads');
    var newPostRef = postListRef.push();
    newPostRef.set({
      name: inputData.name,
      email: inputData.email,
      message: inputData.message,
      date: Date().toLocaleString()
    });
  };


  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container className={classes.root} component="section">
      <Grid container justify="center">
        <Grid item xs={12} md={6} className={classes.cardWrapper}>
          <div className={classes.card}>
            <form onSubmit={handleSubmit} className={classes.cardContent}>
              <Typography variant="h5">
                We'll get back to you for any questions you may have.
              </Typography>
              <TextField
                name="name"
                noBorder
                className={classes.textField}
                placeholder="Name"
                variant="standard"
                onChange={e => setInputData({ ...inputData, name: e.target.value })}
              />
              <TextField
                name="message"
                multiline
                rows={3}
                noBorder
                className={classes.textField}
                placeholder="Message"
                variant="standard"
                onChange={e => setInputData({ ...inputData, message: e.target.value })}
              />
              <TextField
                name="email"
                noBorder
                className={classes.textField}
                placeholder="Your email"
                variant="standard"
                // onChange={handleInputChange}
                onChange={e => setInputData({ ...inputData, email: e.target.value })}
              />
              <Button
                type="submit"
                color="primary"
                variant="contained"
                className={classes.button}
              >
                Submit
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        closeFunc={handleClose}
        message="Thanks for submitting you mail. We'll get back to you asap."
      />
    </Container>
  );
}

ProductCTA.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductCTA);

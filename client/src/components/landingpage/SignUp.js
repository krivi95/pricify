// ReactJS components
import * as React from "react";
import { Field, Form, FormSpy } from "react-final-form";
import { useHistory } from "react-router-dom";

// MaterialUI Components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";

// Landing page template components
import Typography from "./modules/components/Typography";
import AppFooter from "./modules/views/AppFooter";
import AppAppBar from "./modules/views/AppAppBar";
import AppForm from "./modules/views/AppForm";
import { email, required } from "./modules/form/validation";
import RFTextField from "./modules/form/RFTextField";
import FormButton from "./modules/form/FormButton";
import FormFeedback from "./modules/form/FormFeedback";
import withRoot from "./modules/withRoot";

// Local ReactJS components
import firebase from "../../firebase/firebase";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(6),
  },
  button: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  feedback: {
    marginTop: theme.spacing(2),
  },
}));

function SignUp() {
  const classes = useStyles();
  const [sent, setSent] = React.useState(false);
  const history = useHistory();

  const validate = (values) => {
    const errors = required(
      ["firstName", "lastName", "email", "password", "storeName", "ethAddress"],
      values
    );

    if (!errors.email) {
      const emailError = email(values.email);
      if (emailError) {
        errors.email = emailError;
      }
    }

    return errors;
  };

  const firebaseWriteUserData = async (user, userData) => {
    /**
     * Inserts new user record into Firebase Realtime database.
     * Only store managers will be created from the webapp.
     * Application superuser has to be created manually on Firebase.
     */

    let newStoreFlag = "true" === userData.newStore;
    // Account metadata
    if (newStoreFlag) {
      userData.accountType = "storeOwner";
    } else {
      userData.accountType = "storeAdmin";
    }
    userData.activated = false;
    userData.newStore = newStoreFlag;

    // Commit data to db
    firebase
      .database()
      .ref("users/" + user.uid)
      .set(userData)
      .catch((error) => {
        console.log(error.message);
      });
  };

  const firebaseSignUp = async (userData) => {
    /**
     * Creates new user for Firebase email authentication.
     */

    try {
      // Create new Firebase login
      const firebaseUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(userData.email, userData.password);

      // Write used data to db
      await firebaseWriteUserData(firebaseUser.user, userData);

      // Navite to the homepage for the user
      history.push("/store-welcome");
    } catch (error) {
      setSent(false);
      alert(error);
    }
  };

  const handleSubmit = async (userData) => {
    setSent(true);
    await firebaseSignUp(userData);
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Sign Up
          </Typography>
          <Typography variant="body2" align="center">
            <Link href="/login" underline="always">
              Already have an account?
            </Link>
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <form onSubmit={handleSubmit2} className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    autoFocus
                    component={RFTextField}
                    disabled={submitting || sent}
                    autoComplete="fname"
                    fullWidth
                    label="First name"
                    name="firstName"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    component={RFTextField}
                    disabled={submitting || sent}
                    autoComplete="lname"
                    fullWidth
                    label="Last name"
                    name="lastName"
                    required
                  />
                </Grid>
              </Grid>
              <Field
                autoComplete="storeName"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Store name"
                margin="normal"
                name="storeName"
                required
              />
              <Field
                name="newStore"
                component="input"
                type="radio"
                value="true"
                className="custom-control-input"
                margin="normal"
                id="true"
                required
              />
              <label className="custom-control-label" htmlFor="true">
                New store
              </label>
              <Field
                name="newStore"
                component="input"
                type="radio"
                value="false"
                className="custom-control-input"
                margin="normal"
                id="false"
                required
              />
              <label className="custom-control-label" htmlFor="false">
                Existing store
              </label>
              <Field
                autoComplete="ethAddress"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="ETH address"
                margin="normal"
                name="ethAddress"
                required
              />
              <Field
                autoComplete="email"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
              />
              <Field
                fullWidth
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="password"
                autoComplete="current-password"
                label="Password"
                type="password"
                margin="normal"
              />
              <FormSpy subscription={{ submitError: true }}>
                {({ submitError }) =>
                  submitError ? (
                    <FormFeedback className={classes.feedback} error>
                      {submitError}
                    </FormFeedback>
                  ) : null
                }
              </FormSpy>
              <FormButton
                className={classes.button}
                disabled={submitting || sent}
                color="secondary"
                fullWidth
              >
                {submitting || sent ? "In progress…" : "Sign Up"}
              </FormButton>
            </form>
          )}
        </Form>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignUp);

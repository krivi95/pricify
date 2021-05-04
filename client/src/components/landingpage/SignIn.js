// ReactJS components
import * as React from "react";
import { useContext } from "react";
import { Field, Form, FormSpy } from "react-final-form";
import { useHistory } from "react-router-dom";

// MaterialUI Components
import { makeStyles } from "@material-ui/core/styles";
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
import { AuthContext } from "../../context/AuthContext";
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

function SignIn() {
  const classes = useStyles();
  const [sent, setSent] = React.useState(false);
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();

  const validate = (values) => {
    const errors = required(["email", "password"], values);

    if (!errors.email) {
      const emailError = email(values.email);
      if (emailError) {
        errors.email = emailError;
      }
    }

    return errors;
  };

  const firebaseLogin = async (email, password) => {
    /**
     * Authenticates user and redirects him to the homepage.
     */

    try {
      // Authenticating user with firebase
      const firebaseUser = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      // Determining account type
      let accountType = null;
      const uid = firebaseUser.user.uid;
      await firebase
        .database()
        .ref("users/" + uid)
        .once("value", (snap) => {
          const userData = snap.val();
          accountType = userData.accountType;
        });

      if (!accountType) {
        alert("Couldn't login. Auth service not working!");
        return;
      }

      // Redirecting to the user homepage
      if (accountType == "admin") {
        history.push("/admin");
      } else {
        history.push("/store");
      }
    } catch (error) {
      setSent(false);
      alert(error);
    }
  };

  const handleSubmit = async (loginData) => {
    setSent(true);
    await firebaseLogin(loginData.email, loginData.password);
  };

  if (currentUser) {
    let accountType = null;
    const uid = currentUser.uid;
    
    firebase
      .database()
      .ref("users/" + uid)
      .once("value", (snap) => {
        const userData = snap.val();
        accountType = userData.accountType;
        if (accountType == "admin") {
          history.push("/admin");
        } else {
          history.push("/store");
        }
      });
    
  }

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Sign In
          </Typography>
          <Typography variant="body2" align="center">
            {"Not a member yet? "}
            <Link href="/register" align="center" underline="always">
              Sign Up here
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
              <Field
                autoComplete="email"
                autoFocus
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
                size="large"
              />
              <Field
                fullWidth
                size="large"
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
                size="large"
                color="secondary"
                fullWidth
              >
                {submitting || sent ? "In progress…" : "Sign In"}
              </FormButton>
            </form>
          )}
        </Form>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignIn);

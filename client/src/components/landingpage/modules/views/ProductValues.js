import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '../components/Typography';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import WidgetsIcon from '@material-ui/icons/Widgets';
import blockchainBackgrround from "../img/polkaDot.png";

const styles = (theme) => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    backgroundColor: theme.palette.secondary.light,  
  },
  container: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
    display: 'flex',
    position: 'relative',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 5),
  },
  title: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  curvyLines: {
    pointerEvents: 'none',
    position: 'absolute',
    top: -180,
    opacity: 0.05
  },
});

function ProductValues(props) {
  const { classes } = props;

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <img
          src={blockchainBackgrround}
          className={classes.curvyLines}
          alt="curvy lines"
        />
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <TrendingUpIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                Grow brand value
              </Typography>
              <Typography variant="h5">
                {
                  "Brand awareness and recognition is what drives every customer's decision. "
                }                
                {
                  "Being transparent with prices and discounts of your products helps strengthening your brand."
                }
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <LoyaltyIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                Loyality among customers
              </Typography>
              <Typography variant="h5">
                {
                  'Being honest with your costumers makes them more likely to stay with you. '
                }

                {'Loyal customers means higher profits, predictable cash flows and higher conversion rates.'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <WidgetsIcon fontSize="large"/>
              <Typography variant="h6" className={classes.title}>
                Powered by Blockchain
              </Typography>
              <Typography variant="h5">
                {"Keep product price updates on the Blockchain. Customers won't have to trust you blindly, "}
                {"they can verify the records on the blockchain and believe in the technology instead."}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}

ProductValues.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductValues);

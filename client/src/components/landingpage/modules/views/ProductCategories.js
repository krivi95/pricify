import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '../components/Typography';
import verifyDemo from '../img/verifyDemo.png'

import { useHistory } from "react-router-dom";

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
  },
  images: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%', 
    
  },
  image: {
    height: 'auto',
    maxWidth: '100%',
    '&:hover': {
      opacity: '0.5',
      cursor: 'pointer'
    },
  }
});

function ProductCategories(props) {
  const { classes } = props;
  const history = useHistory();

  return (
    <Container className={classes.root} component="section">
      <Typography variant="h4" marked="center" align="center" component="h2">
        How price validation looks like?
      </Typography>
      <div className={classes.images}>
        <img
          className={classes.image}
          src={verifyDemo}
          alt="increase priority"
          onClick={() => { history.push("/demo/verify/store-id/item-id"); }}
        />
      </div>
    </Container>
  );
}

ProductCategories.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductCategories);

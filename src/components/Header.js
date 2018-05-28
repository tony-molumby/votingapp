import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button
} from '@material-ui/core';

import FAB from './FAB';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 8
  },
  fab: {
    flex: 1
  }
});

function Header(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Votastic
          </Typography>
          <FAB className={classes.fab} />
          <Button color="inherit" >Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
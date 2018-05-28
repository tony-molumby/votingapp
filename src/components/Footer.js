import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography} from '@material-ui/core';


const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: '20px'
  },
  appbar: {
    bottom: '0px',
  },
  flex: {
    flex: 1,
  },
  text: {
    marginLeft: -12,
    marginRight: 20,
  },
});

function Footer(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position='absolute' color="default" className='appbar' >
        <Toolbar>
          <Typography variant="title" color="default" className={classes.flex}>
            Made by Tony Molumby
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {Typography} from '@material-ui/core';
import {Assessment} from '@material-ui/icons' 

const styles = {
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexFlow: 'column wrap',
      height: '400px',
      textAlign: 'center'
    },
    assessment: {
        fontSize: '200px',
    }
  };
  
  function Banner(props) {
    const { classes } = props;
    return (
      <div className={classes.root}>
        <Typography variant="display3">Votastic</Typography>
        <Typography variant="headline">Create polls and get live feedback.</Typography>
        <Assessment className={classes.assessment} color='secondary' /> 
      </div>
    );
  }
  
  Banner.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(Banner);
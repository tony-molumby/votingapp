
import React from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { Manager, Target, Popper } from 'react-popper';

import AddDialog from './addDialog';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit,
  },
  popover: {
    pointerEvents: 'none',
  },
  popperClose: {
    pointerEvents: 'none',
  },
});

class MouseOverPopover extends React.Component {
  state = {
    anchorEl: null,
    popperOpen: false,
    dialogOpen: false
  };
  
  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  handlePopperOpen = () => {
    this.setState({ popperOpen: true });
  };

  handlePopperClose = () => {
    this.setState({ popperOpen: false });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl, popperOpen, modalOpen, dialogOpen } = this.state;
    const open = !!anchorEl;

    return (
        <Manager className={this.props.className}>
          <Target>
            <Button 
                variant="fab" 
                    color="secondary" 
                    aria-label="add" 
                    className={classes.button}
                    onMouseOver={this.handlePopperOpen}
                    onMouseOut={this.handlePopperClose}
                    onClick={this.handleDialogOpen}
                    >
                <AddIcon />
            </Button> 
          </Target>
          <Popper
            placement="bottom-start"
            eventsEnabled={popperOpen}
            className={!popperOpen ? classes.popperClose : ''}
          >
            <Grow in={popperOpen} style={{ transformOrigin: '0 0 0' }}>
              <Paper
                id="react-popper-tooltip"
                className={classes.paper}
                role="tooltip"
                aria-hidden={!popperOpen}
                elevation={8}
              >
                <Typography>Create new poll.</Typography>
              </Paper>
            </Grow>
          </Popper>
          <AddDialog 
            handleDialogOpen={this.handleDialogOpen}
            handleDialogClose={this.handleDialogClose}
            open={dialogOpen}
            />
        </Manager>
    );
  }
}

MouseOverPopover.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MouseOverPopover);
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import AddForm from './addForm';

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AddDialog extends React.Component {

  render() {
    const { classes, handleDialogOpen, handleDialogClose, open } = this.props;
    return (
      <Fragment>
        <Dialog
          fullScreen
          open={this.props.open}
          onClose={handleDialogClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={handleDialogClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                Create New Poll
              </Typography>
              <Button color="inherit" onClick={handleDialogClose}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <AddForm />
        </Dialog>
      </Fragment>
    );
  }
}

AddDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddDialog);
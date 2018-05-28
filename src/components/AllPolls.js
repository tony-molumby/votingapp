import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    ExpansionPanel, 
    ExpansionPanelDetails, 
    ExpansionPanelSummary, 
    Typography
} from '@material-ui/core';
import {ExpandMore as ExpandMoreIcon} from '@material-ui/icons'; 


const styles = theme => ({
    root: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px'
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    }
  });
  
  class AllPolls extends React.Component {
      constructor(props){
          super(props);
          this.state = {
            expanded: null,
          };
;      }
   
  
    handleChange = panel => (event, expanded) => {
      this.setState({
        expanded: expanded ? panel : false,
      });
    };
  
    render() {
      const { classes } = this.props;
      const { expanded } = this.state;
  
      return (
        <div className={classes.root}>
          <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>General settings</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                maximus est, id dignissim quam.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>General settings</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                maximus est, id dignissim quam.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      );
    }
  }
  
  AllPolls.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(AllPolls);
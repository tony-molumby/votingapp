import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Paper, Tabs, Tab } from '@material-ui/core'; 

function PollTabs(props) {
    
    return (
        <Paper>
            <Tabs
            value={0}
            // onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            >
          <Tab label="All Polls" />
          <Tab label="My Polls" />
        </Tabs>
      </Paper>
    )
}

PollTabs.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default PollTabs;
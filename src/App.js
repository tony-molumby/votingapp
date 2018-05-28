import React, { Component, Fragment } from 'react';

import {Provider} from 'react-redux';
import store from './store';

import {BrowserRouter as Router} from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';

//Components
import Header from './components/Header';
import Banner from './components/Banner';
import PollTabs from './components/PollTabs';
import AllPolls from './components/AllPolls';
import Footer from './components/Footer';

const styles = theme => ({
  App: {
    minHeight: '100%'
  }
});

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Fragment>
          <CssBaseline />
          <Router>
            <div className="App">
              <Header />
              <Banner />
              <PollTabs />
              <AllPolls />
              {/* <Footer /> */}
            </div>
          </Router>
        </Fragment>
      </Provider>
    );
  }
}

export default App;

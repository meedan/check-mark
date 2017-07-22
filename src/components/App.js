import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import util from 'util';
import '../style/App.css';
import Login from './Login';
import Save from './Save';
import Error from './Error';
import superagent from 'superagent';
import config from '../config';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      error: false,
      loaded: false
    };
  }

  getChildContext() {
    return {
      user: this.state.user
    };
  }

  componentWillMount() {
    const that = this;

    superagent.get(config.checkApiUrl + '/api/me').end(function(err, response) {
      let state = { loaded: true };
      
      try {
        if (err) {
          if (err.response) {
            const json = JSON.parse(err.response.text);
            state.error = json.data.message;
          }
          else {
            state.error = err;
          }
        }
        else {
          const json = JSON.parse(response.text);
          if (response.status === 200) {
            state.error = false;
            state.user = json.data;
          }
          else {
            state.error = json.data.message;
          }
        }
      }
      catch (e) {
        state.error = util.inspect(e);
      }

      that.setState(state);
    });
  }

  render() {
    return (
      <div id="app" className={this.props.direction}>
        {!this.state.loaded ? null : (this.state.user ? <Save /> : (this.state.error ? <Error message={this.state.error} /> : <Login />))}
      </div>
    );
  }
}

App.childContextTypes = {
  user: PropTypes.object
};

export default App;

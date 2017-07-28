import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../style/App.css';
import Login from './Login';
import Save from './Save';
import Error from './Error';
import { loggedIn } from '../helpers';
import { createEnvironment } from '../relay/Environment'; 

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      error: false,
      loaded: false,
      environment: null
    };
  }

  getChildContext() {
    return {
      user: this.state.user,
      environment: this.state.environment
    };
  }

  componentWillMount() {
    const that = this;

    loggedIn(function(user, error) {
      const environment = user ? createEnvironment(user.token) : null;
      that.setState({ loaded: true, user, error, environment });
    });
  }

  render() {
    return (
      <div id="app" className={this.props.direction}>
        {!this.state.loaded ? null : (this.state.user ? <Save url={this.props.url} /> : (this.state.error ? <Error message={this.state.error} /> : <Login />))}
      </div>
    );
  }
}

App.childContextTypes = {
  user: PropTypes.object,
  environment: PropTypes.object
};

export default App;

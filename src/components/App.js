import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Login from './Login';
import Save from './Save';
import Error from './Error';
import { loggedIn } from './../helpers';
import { createEnvironment } from './../relay/Environment'; 
import { View } from 'react-native';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      error: false,
      loaded: this.props.platform === 'mobile',
      environment: null
    };
  }

  getChildContext() {
    return {
      user: this.state.user,
      environment: this.state.environment,
      platform: this.props.platform
    };
  }

  componentWillMount() {
    loggedIn(this.props.platform, (user, error) => {
      this.loginCallback(user, error);
    });
  }

  loginCallback(user, error) {
    const environment = user ? createEnvironment(user.token, '') : null;
    this.setState({ loaded: true, user, error, environment });
  }

  logoutCallback() {
    this.setState({ user: null });
  }

  render() {
    return (
      <View id="app" className={this.props.direction}>
        {!this.state.loaded ? null : (this.state.user ? <Save url={this.props.url} text={this.props.text} callback={this.logoutCallback.bind(this)} /> : (this.state.error ? <Error message={this.state.error} /> : <Login callback={this.loginCallback.bind(this)} />))}
      </View>
    );
  }
}

App.childContextTypes = {
  user: PropTypes.object,
  environment: PropTypes.object,
  platform: PropTypes.string
};

export default App;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RNExitApp from 'react-native-exit-app';
import Login from './Login';
import SaveOrUpdate from './SaveOrUpdate';
import Error from './Error';
import { loggedIn } from './../helpers';
import { createEnvironment } from './../relay/Environment';
import { View } from 'react-native';
import styles from './styles';

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
      platform: this.props.platform,
      store: this.props.store
    };
  }

  componentWillMount() {
    if (this.props.platform === 'mobile') {
      this.props.store.read('userToken', (token) => {
        if (token && token !== '') {
          this.loginCallback({ token }, false);
        }
        else {
          this.loginCallback(null, false);
        }
      });
    }
    else {
      loggedIn((user, error) => {
        this.loginCallback(user, error);
      });
    }
  }

  componentDidMount() {
    if (this.context.platform !== 'mobile') {
      const receiveMessage = (event) => {
        if (event.data === 'loggedIn') {
          loggedIn((user, error) => {
            this.loginCallback(user, error);
          });
        }
      };
      window.addEventListener('message', receiveMessage, false);
    }
  }

  loginCallback(user, error) {
    const environment = user ? createEnvironment(user.token, '', null) : null;
    this.setState({ loaded: true, user, error, environment });
  }

  logoutCallback() {
    this.setState({ user: null });
    if (this.props.platform === 'mobile') {
      RNExitApp.exitApp();
    }
  }

  saveCallback() {
    loggedIn((user, error) => {
      this.loginCallback(user, error);
    });
  }

  render() {
    return (
      <View id="app" style={styles.body} className={this.props.direction}>
        {!this.state.loaded ? null : (this.state.user ? <SaveOrUpdate url={this.props.url} text={this.props.text} image={this.props.image} callback={this.logoutCallback.bind(this)} saveCallback={this.saveCallback.bind(this)} /> : (this.state.error ? <Error message={this.state.error} /> : <Login callback={this.loginCallback.bind(this)} />))}
      </View>
    );
  }
}

App.childContextTypes = {
  user: PropTypes.object,
  environment: PropTypes.object,
  platform: PropTypes.string,
  store: PropTypes.object
};

export default App;

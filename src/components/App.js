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
      environment: null,
      saved: false,
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
    this.props.store.read('userToken', (token) => {
      if (token && token !== '') {
        this.loginCallback({ token }, false);
      }
      else {
        if (this.props.platform === 'mobile') {
          this.loginCallback(null, false);
        }
        else {
          loggedIn((user, error) => {
            this.loginCallback(user, error);
          });
        }
      }
    });
  }

  componentDidMount() {
    if (this.context.platform !== 'mobile') {
      const receiveMessage = (event) => {
        const data = event.data.split(':');
        if (!this.state.user && data[0] === 'loggedIn' && data[1]) {
          this.props.store.write('userToken', data[1], () => {
            this.loginCallback({ token: data[1] }, false);
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
    this.setState({ saved: true }, () => {
      this.loginCallback(this.state.user, false);
    });
  }

  render() {
    return (
      <View id="app" style={styles.body} className={this.props.direction}>
        {!this.state.loaded ? null : (this.state.user ? <SaveOrUpdate url={this.props.url} saved={this.state.saved} text={this.props.text} image={this.props.image} callback={this.logoutCallback.bind(this)} saveCallback={this.saveCallback.bind(this)} /> : (this.state.error ? <Error message={this.state.error} /> : <Login callback={this.loginCallback.bind(this)} />))}
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

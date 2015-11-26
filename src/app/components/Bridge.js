import React, { Component, PropTypes } from 'react';
import util from 'util';
import Login from './Login';
import Menu from './Menu';

class Bridge extends Component {
  render() {
    const { loginTwitter, loginFacebook, state } = this.props;
    let view = ((state && state.bridge && state.bridge.view) ? state.bridge.view : 'login');

    switch (view) {
      case 'login':
        return (<Login {...this.props} />);
      case 'menu':
        return (<Menu />);
      default:
        return null;
    }
  }
}

Bridge.propTypes = {
  loginTwitter: PropTypes.func.isRequired,
  loginFacebook: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired
};

export default Bridge;

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import '../style/Login.css';
import Button from './Button';
import config from '../config';

class Login extends Component {
  signIn() {
    window.open(config.checkApiUrl, 'login');
  }

  render() {
    return (
      <div id="login">
        <h2><FormattedMessage id="Login.addToCheck" defaultMessage="Add to Check" /></h2>
        <p><FormattedMessage id="Login.addLinks" defaultMessage="Add links to Check with one click. Links will be added to your most recently active project." /></p>
        <p><FormattedMessage id="Login.getStarted" defaultMessage="To get started, sign in." /></p>
        <Button onClick={this.signIn.bind(this)} label={<FormattedMessage id="Login.signIn" defaultMessage="Sign In" />} />
      </div>
    );
  }
}

export default Login;

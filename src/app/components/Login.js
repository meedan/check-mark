import React, { Component, PropTypes } from 'react';

class Login extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, saveTranslation, submitTranslation, myTranslations, state } = this.props;
    return (
      <div className="textured">
        <img src="/images/connect-with.svg" />
        <h1><span className="orange-text">Connect with:</span></h1>
        <div className="row login-button">
          <a className="btn btn-facebook-login" onClick={loginFacebook}>FACEBOOK</a>
          <a className="btn btn-twitter-login" id="twitter-login" onClick={loginTwitter}>TWITTER</a>
        </div>
      </div>
    );
  }
}

export default Login;

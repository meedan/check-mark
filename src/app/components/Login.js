import React, { Component, PropTypes } from 'react';
import util from 'util';

class Login extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, state } = this.props;
    return (
      <div>
        <h3>Connect with:</h3>
        <p>{util.inspect(state)}</p>
        <button className="btn" onClick={loginTwitter}>Login on Twitter</button>
        <button className="btn" onClick={loginFacebook}>Login on Facebook</button>
      </div>
    );
  }
}

export default Login;

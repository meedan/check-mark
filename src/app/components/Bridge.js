import React, { Component, PropTypes } from 'react';

class Bridge extends Component {
  render() {
    const { loginTwitter, loginFacebook, state } = this.props;
    return (
      <div>
        <h3>Bridge</h3>
        <button className="btn" onClick={loginTwitter}>Login on Twitter</button>
        {' '}
        <button className="btn" onClick={loginFacebook}>Login on Facebook</button>
      </div>
    );
  }
}

Bridge.propTypes = {
  loginTwitter: PropTypes.func.isRequired,
  loginFacebook: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired
};

export default Bridge;

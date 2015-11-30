import React, { Component, PropTypes } from 'react';
import util from 'util';

class Message extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, saveTranslation, submitTranslation, state } = this.props;
    return (
      <div className={state.bridge.errorType}>
        <p><a onClick={goBack}>Back</a></p>
        <p className="message">{state.bridge.message}</p>
      </div>
    );
  }
}

export default Message;

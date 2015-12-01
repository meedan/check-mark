import React, { Component, PropTypes } from 'react';
import util from 'util';

class Message extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, saveTranslation, submitTranslation, state } = this.props;
    return (
      <div className={state.bridge.errorType}>
        <p><a onClick={goBack}>{ state.bridge.previousView === 'reload' ? 'Done' : 'Back' }</a></p>
        <div className="message" dangerouslySetInnerHTML={{__html: state.bridge.message}}></div>
      </div>
    );
  }
}

export default Message;

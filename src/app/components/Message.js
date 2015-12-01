import React, { Component, PropTypes } from 'react';
import BackBar from './BackBar';

class Message extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, saveTranslation, submitTranslation, state } = this.props;
    return (
      <div className={state.bridge.errorType}>
        <BackBar goBack={goBack} />
        <div class="textured">
          <img src="images/confirmation-translated.svg" />
          <div className="message" dangerouslySetInnerHTML={{__html: state.bridge.message}}></div>
        </div>
      </div>
    );
  }
}

export default Message;

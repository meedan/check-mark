import React, { Component, PropTypes } from 'react';
import BackBar from './BackBar';

class Message extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, myTranslations, state } = this.props;
    return (
      <div>
        <BackBar goBack={goBack} myTranslations={myTranslations} />
        <div class="textured">
          <img src={state.bridge.image ? ('images/' + state.bridge.image + '.svg') : 'images/error-general-bug.svg' } />
          <div className="message" dangerouslySetInnerHTML={{__html: state.bridge.message}}></div>
        </div>
      </div>
    );
  }
}

export default Message;

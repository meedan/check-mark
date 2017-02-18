import React, { Component, PropTypes } from 'react';
import BackBar from './BackBar';

class Menu extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, myTranslations, state } = this.props;
    return (
      <div>
        <BackBar goBack={goBack} myTranslations={myTranslations} />
        <div className="textured">
          <h3 className="choose">What would you like to do with this post?</h3>
          <div className="column button-column">
            <a className="btn btn-large" id="save-post" onClick={savePost}>Save to existing project for translation</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;

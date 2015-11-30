import React, { Component, PropTypes } from 'react';
import util from 'util';

class Menu extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, saveTranslation, submitTranslation, state } = this.props;
    return (
      <div>
        <p><a onClick={goBack}>Back</a></p>
        <p>{util.inspect(state)}</p>
        <h3>What would you like to do with this post?</h3>
        <button className="btn" onClick={savePost}>Save to existing project for translation</button>
        <button className="btn" onClick={saveTranslation}>Translate this post and add it to a project</button>
      </div>
    );
  }
}

export default Menu;

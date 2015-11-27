import React, { Component, PropTypes } from 'react';
import util from 'util';

class Menu extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, state } = this.props;
    return (
      <div>
        <p><a onClick={goBack}>Back</a></p>
        <p>{util.inspect(state)}</p>
        <h3>What would you like to do with this post?</h3>
        <button className="btn">Save to existing project for translation</button>
        <button className="btn">Translate this post and add it to a project</button>
      </div>
    );
  }
}

export default Menu;

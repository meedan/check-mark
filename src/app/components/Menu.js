import React, { Component, PropTypes } from 'react';

class Menu extends Component {
  render() {
    return (
      <div>
        <h3>What would you like to do with this post?</h3>
        <button className="btn">Save to existing project for translation</button>
        <button className="btn">Translate this post and add it to a project</button>
      </div>
    );
  }
}

export default Menu;

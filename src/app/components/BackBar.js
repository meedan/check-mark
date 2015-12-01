import React, { Component, PropTypes } from 'react';

class BackBar extends Component {
  render() {
    return (
      <div className="back-bar">
        <a onClick={this.props.goBack}>
          <img src="/images/backbutton.svg" />
          Back
        </a>
      </div>
    );
  }
}

export default BackBar;

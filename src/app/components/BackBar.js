import React, { Component, PropTypes } from 'react';

class BackBar extends Component {
  loadTranslations() {
    this.props.myTranslations(0);
  }

  render() {
    return (
      <div className="back-bar">
        <a onClick={this.loadTranslations.bind(this)} id="my-translations-link">My Translations</a>
        <a onClick={this.props.goBack}>
          <img src="/images/backbutton.svg" />
          Close
        </a>
      </div>
    );
  }
}

export default BackBar;

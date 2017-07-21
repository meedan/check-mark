import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import '../style/Save.css';

class Save extends Component {
  render() {
    return (
      <div id="save">
        <h2><FormattedMessage id="Save.addToCheck" defaultMessage="Add to Check" /></h2>
      </div>
    );
  }
}

export default Save;

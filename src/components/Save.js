import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import '../style/Save.css';

class Save extends Component {
  render() {
    return (
      <div id="save">
        <h2><FormattedMessage id="Save.addToCheck" defaultMessage="Add to Check" /></h2>
        <p>{this.context.user.name}</p>
      </div>
    );
  }
}

Save.contextTypes = {
  user: PropTypes.object
};

export default Save;

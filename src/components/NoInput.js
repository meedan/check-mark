import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

class NoInput extends Component {
  render() {
    return (
      <FormattedMessage
        id="NoInput.noInput"
        defaultMessage="Please invoke this application from the share menu of another application, or copy something to the clipboard and open this application again."
      />
    );
  }
}

export default NoInput;

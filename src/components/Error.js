import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import util from 'util';

class Error extends Component {
  render() {
    const message = typeof this.props.message === 'string' ? this.props.message : util.inspect(this.props.message);

    return (
      <div id="error">
        <h2><FormattedMessage id="Error.thereWasAProblem" defaultMessage="Hmm, there was a problem" /></h2>
        { this.props.message ? <code>{message}</code> : null }
        { this.props.messageComponent ? <code>{this.props.messageComponent}</code> : null }
        <p>
          <FormattedMessage id="Error.tryAgain" defaultMessage="Please try again later." />
          <br />
          <FormattedMessage id="Error.forHelp" defaultMessage="For help contact check@meedan.com." />
        </p>
      </div>
    );
  }
}

export default Error;

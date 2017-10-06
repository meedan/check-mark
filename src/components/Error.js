import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import util from 'util';
import '../style/Error.css';

class Error extends Component {
  render() {
    const message = typeof this.props.message === 'string' ? this.props.message : util.inspect(this.props.message);

    return (
      <div id="error">
        <h2><FormattedMessage id="Error.thereWasAProblem" defaultMessage="Hmm, there was a problem" /></h2>
        <code dangerouslySetInnerHTML={{ __html: message }}></code>
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

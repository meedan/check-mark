import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import util from 'util';
import { View, Text } from 'react-native';

class Error extends Component {
  render() {
    const message = typeof this.props.message === 'string' ? this.props.message : util.inspect(this.props.message);

    return (
      <View id="error">
        <Text><FormattedMessage id="Error.thereWasAProblem" defaultMessage="Hmm, there was a problem" /></Text>
        { this.props.message ? <Text className="code">{message}</Text> : null }
        { this.props.messageComponent ? <Text className="code">{this.props.messageComponent}</Text> : null }
        <Text>
          <FormattedMessage id="Error.tryAgain" defaultMessage="Please try again later." />
          <FormattedMessage id="Error.forHelp" defaultMessage="For help contact check@meedan.com." />
        </Text>
      </View>
    );
  }
}

export default Error;

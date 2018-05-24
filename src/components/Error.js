import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import util from 'util';
import styles from './styles';
import { View, Text } from 'react-native';
import config from './../config';

class Error extends Component {
  render() {
    const message = typeof this.props.message === 'string' ? this.props.message : util.inspect(this.props.message);

    return (
      <View id="error">
        <Text style={styles.title}><FormattedMessage id="Error.thereWasAProblem" defaultMessage="Hmm, there was a problem" /></Text>
        { this.props.message ? <Text style={styles.p} className="code">{message}</Text> : null }
        { this.props.messageComponent ? <Text style={styles.p} className="code">{this.props.messageComponent}</Text> : null }
        <Text style={styles.p}>
          <FormattedMessage id="Error.forHelp" defaultMessage="For help contact {email}." values={{ email: config.appEmail }} />
        </Text>
      </View>
    );
  }
}

export default Error;

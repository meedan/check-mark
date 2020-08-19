import React, { Component } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { View, Text, Linking } from 'react-native';
import styles from './styles';
import config from './../config';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userAgent: null,
    };
  }

  onMessage(event) {
    const { data } = event.nativeEvent;
    if (data) {
      const user = JSON.parse(data);
      this.context.store.write('userToken', user.token, () => {
        this.props.callback(user, false);
      });
    }
  }

  signIn() {
    window.open(config.checkWebUrl, 'Check Web');
  }

  openCheck() {
    Linking.openURL(config.checkWebUrl);
  }

  render() {
    return (
      <View id="login">
        <Text id="title" style={styles.title}><FormattedMessage id="Login.addToApp" defaultMessage="Add to {app}" values={{ app: config.appName }} /></Text>
        <Text style={styles.p}><FormattedMessage id="Login.addLinksToApp" defaultMessage="Add links to {app} with one click. Links will be added to your selected project. If the link already exists in one of your projects, you are able to answer tasks associated with it." values={{ app: config.appName }} /></Text>
        <Text style={styles.p}><FormattedMessage id="Login.getStarted" defaultMessage="To get started, sign in." /></Text>
        <View id="button">
          <Text style={styles.button} onPress={this.signIn.bind(this)}><FormattedMessage id="Login.signIn" defaultMessage="Sign In" /></Text>
        </View>
      </View>
    );
  }
}

Login.propTypes = {
  intl: intlShape.isRequired,
};

Login.contextTypes = {
  store: PropTypes.object,
  platform: PropTypes.string
};

export default injectIntl(Login);

import React, { Component } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { WebView, View, Dimensions, Text } from 'react-native';
import styles from './styles';
import config from './../config';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkOpened: false,
      url: config.checkWebUrl
    };
  }

  onNavigationStateChange(webViewState) {
    const { url } = webViewState;
    // Avoid Twitter "Invalid request token being sent" error
    if (!/twitter/.test(url)) {
      this.setState({ url });
    }
    if (url.replace(/close\.html.*$/, 'close.html') === config.checkApiUrl + '/close.html') {
      this.setState({ url: config.checkWebUrl }, () => {
        setTimeout(() => {
          this.forceUpdate();
        }, 1000);
      });
    }
  }

  onMessage(event) {
    const { data } = event.nativeEvent;
    if (data) {
      this.setState({ checkOpened: false });
      const user = JSON.parse(data);
      this.context.store.write('userToken', user.token, () => {
        this.props.callback(user, false);
      });
    }
  }

  signIn() {
    if (this.context.platform === 'mobile') {
      this.setState({ checkOpened: true });
    }
    else {
      window.open(config.checkWebUrl);
    }
  }

  render() {
    let style = {
      backgroundColor: '#FAFAFA',
      height: 350,
      paddingBottom: 50
    };
    if (this.context.platform === 'mobile') {
      const dimensions = Dimensions.get('window');
      style.height = dimensions.height;
    }
    const script = `/* Get user */
      const waitForToken = function() {
        const slackLoginButton = document.getElementById('slack-login');
        if (slackLoginButton) {
          slackLoginButton.style.display = 'none';
        }
        let user = null;
        try {
          user = Check.store.getState().app.context.currentUser;
        }
        catch (e) {
          user = null;
        }
        
        if (user && user.token) {
          window.postMessage(JSON.stringify(user));
        }
        else {
          setTimeout(waitForToken, 200);
        }
      };
      setTimeout(waitForToken, 500);
    `;
      
    return (
      this.state.checkOpened ?
      <View style={style}>
        <WebView
          ref="webview"
          source={{ uri: this.state.url }}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          onMessage={this.onMessage.bind(this)}
          injectedJavaScript={script}
          javaScriptEnabled={true}
          javaScriptEnabledAndroid={true}
          startInLoadingState={true}
          automaticallyAdjustContentInsets={false}
          scalesPageToFit={true}
          scrollEnabled={true}
        />
      </View>
      :
      <View id="login">
        <Text id="title" style={styles.title}><FormattedMessage id="Login.addToCheck" defaultMessage="Add to Check" /></Text>
        <Text style={styles.p}><FormattedMessage id="Login.addLinks" defaultMessage="Add links to Check with one click. Links will be added to your selected project." /></Text>
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

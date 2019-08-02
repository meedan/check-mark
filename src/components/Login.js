import React, { Component } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { WebView, View, Dimensions, Text, Image, Linking } from 'react-native';
import styles from './styles';
import config from './../config';

const logos = {
  check: require('./../assets/check.png'),
  bridge: require('./../assets/bridge.png')
};

const staticLoginUrl = 'file:///android_asset/login.html';

  let slackLoginUrl = null;
let slackWorkspaceUrl = null;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkOpened: false,
      userAgent: null,
      url: staticLoginUrl
    };
  }

  onNavigationStateChange(webViewState) {
    const { url } = webViewState;
    const state = {};

    // Do not attempt to GET a POST path
    if (url === config.checkApiUrl + '/api/users/sign_in') {
      return;
    }

    // Change user agent if Slack
    if (/slack\.com/.test(url)) {
      state.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36';
    }
    else {
      state.userAgent = null;
    }

    // Fix problem with Slack login
    if (/^https:\/\/([^\.]+)\.slack\.com\/?/.test(url)) {
      if (/redir/.test(url)) {
        slackLoginUrl = url;
        state.url = url;
      }
      else {
        state.url = slackLoginUrl;
      }
    }

    // Fix problem with Slack login
    else if (/^https:\/\/slack\.com\/signin/.test(url)) {
      if (/redir/.test(url)) {
        slackWorkspaceUrl = url;
        state.url = url;
      }
      else {
        state.url = slackWorkspaceUrl;
      }
    }

    // Redirect to home page after authentication
    else {
      if (url.replace(/close\.html.*$/, 'close.html') === config.checkApiUrl + '/close.html') {
        this.setState({ url: staticLoginUrl, userAgent: null }, () => {
          setTimeout(() => {
            this.forceUpdate();
          }, 1000);
        });
      }
      
      // Avoid Twitter "Invalid request token being sent" error
      if (!/twitter/.test(url) && url !== this.state.url) {
        state.url = url;
      }
    }

    this.setState(state);
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
      window.open(config.checkWebUrl, 'Check Web');
    }
  }

  openCheck() {
    Linking.openURL(config.checkWebUrl);
  }

  render() {
    let style = {
      backgroundColor: '#FFFFFF',
      height: 350,
      paddingBottom: 50,
    };
    if (this.context.platform === 'mobile') {
      const dimensions = Dimensions.get('window');
      style.height = dimensions.height;
    }
      
    return (
      this.state.checkOpened ?
      <View style={style}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={logos[config.appId]} style={{ width: 100, height: 25 }} />
        </View>
        <WebView
          ref="webview"
          source={{ uri: this.state.url }}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          onMessage={this.onMessage.bind(this)}
          javaScriptEnabled={true}
          javaScriptEnabledAndroid={true}
          startInLoadingState={true}
          automaticallyAdjustContentInsets={false}
          scalesPageToFit={true}
          scrollEnabled={true}
          userAgent={this.state.userAgent}
        />
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.p} onPress={this.openCheck.bind(this)}>
            <FormattedMessage id="Login.registerOrRecover" defaultMessage="Register or recover password?" />
          </Text>
        </View>
      </View>
      :
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

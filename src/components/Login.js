import React, { Component } from 'react';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { WebView, View, Dimensions, Button, Text } from 'react-native';
import config from './../config';

const messages = defineMessages({
  signIn: {
    id: 'Login.signIn',
    defaultMessage: 'Sign In',
  },
});

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
    this.setState({ url });
    if (url === config.checkApiUrl + '/close.html') {
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
      height: 350
    };
    if (this.context.platform === 'mobile') {
      const dimensions = Dimensions.get('window');
      style.height = dimensions.height;
    }
    const script = `/* Get user */
      const waitForToken = function() {
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
        <Text><FormattedMessage id="Login.addToCheck" defaultMessage="Add to Check" /></Text>
        <Text><FormattedMessage id="Login.addLinks" defaultMessage="Add links to Check with one click. Links will be added to your selected project." /></Text>
        <Text><FormattedMessage id="Login.getStarted" defaultMessage="To get started, sign in." /></Text>
        <Button onPress={this.signIn.bind(this)} title={this.props.intl.formatMessage(messages.signIn)} />
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

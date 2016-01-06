import React, { Component, PropTypes } from 'react';
import Login from './Login';
import Menu from './Menu';
import Message from './Message';
import SavePost from './SavePost';
import SaveTranslation from './SaveTranslation';
import ListTranslations from './ListTranslations';

class Bridge extends Component {
  pageSupported(state) {
    if (!/(facebook|twitter)\.com$/.test(state.extension.url.split('/')[2])) {
      state.bridge.message = '<h1>Oops - right now, Bridge only works with posts from Twitter or Facebook. Try again?</h1>';
      return false;
    }
    return true;
  }

  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, saveTranslation, submitTranslation, myTranslations, state } = this.props;
    let view = ((state && state.bridge && state.bridge.view) ? state.bridge.view : 'login');

    switch (view) {
      case 'login':
        return (<Login {...this.props} />);
      case 'menu':
        return (<Menu {...this.props} />);
      case 'message':
        return (<Message {...this.props} />);
      case 'save_post':
        if (this.pageSupported(state)) {
          return (<SavePost {...this.props} />);
        }
        else {
          return (<Message {...this.props} />);
        }
      case 'save_translation':
        if (this.pageSupported(state)) {
          return (<SaveTranslation {...this.props} />);
        }
        else {
          return (<Message {...this.props} />);
        }
      case 'list_translations':
        return (<ListTranslations {...this.props} />);
      default:
        return null;
    }
  }
}

Bridge.propTypes = {
  state: PropTypes.object.isRequired
};

export default Bridge;

import React, { Component, PropTypes } from 'react';
import util from 'util';
import Login from './Login';
import Menu from './Menu';
import Message from './Message';
import SavePost from './SavePost';

class Bridge extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, state } = this.props;
    let view = ((state && state.bridge && state.bridge.view) ? state.bridge.view : 'login');

    switch (view) {
      case 'login':
        return (<Login {...this.props} />);
      case 'menu':
        return (<Menu {...this.props} />);
      case 'message':
        return (<Message {...this.props} />);
      case 'save_post':
        return (<SavePost {...this.props} />);
      default:
        return null;
    }
  }
}

Bridge.propTypes = {
  state: PropTypes.object.isRequired
};

export default Bridge;

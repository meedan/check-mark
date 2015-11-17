import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Facebook } from 'react-facebook-login';
import CounterApp from './App';

export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <CounterApp />
      </Provider>
    );
  }
}

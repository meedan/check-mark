import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import '../style/App.css';
import Login from './Login';
import Save from './Save';
import Error from './Error';
import { loggedIn } from '../helpers';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      error: false,
      loaded: false
    };
  }

  getChildContext() {
    return {
      user: this.state.user
    };
  }

  componentWillMount() {
    const that = this;

    loggedIn(function(user, error) {
      that.setState({ loaded: true, user, error });
    });
  }

  render() {
    return (
      <div id="app" className={this.props.direction}>
        {!this.state.loaded ? null : (this.state.user ? <Save /> : (this.state.error ? <Error message={this.state.error} /> : <Login />))}
      </div>
    );
  }
}

App.childContextTypes = {
  user: PropTypes.object
};

export default App;

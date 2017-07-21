import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import '../style/App.css';
import Login from './Login';
import Save from './Save';
import environment from '../relay/Environment';
import { QueryRenderer, graphql } from 'react-relay';

class App extends Component {
  getChildContext() {
    return {
      user: null
    };
  }

  render() {
    return (
      <div id="app" className={this.props.direction}>
        <QueryRenderer environment={environment}
          query={graphql`
            query AppQuery {
              me {
                name
              }
            }
          `}
          render={({error, props}) => {
            if (error || !props || !props.me) {
              return <Login />;
            }
            else if (props && props.me) {
              return <Save />;
            }
            return <p><FormattedMessage id="App.loading" defaultMessage="Loading..." /></p>;
          }}
        />
      </div>
    );
  }
}

App.childContextTypes = {
  user: PropTypes.object
};

export default App;

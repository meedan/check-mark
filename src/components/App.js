import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import '../style/App.css';
import Button from './Button';

class App extends Component {
  render() {
    return (
      <div id="app" className={this.props.direction}>
        <h2><FormattedMessage id="App.addToCheck" defaultMessage="Add to Check" /></h2>
        <p><FormattedMessage id="App.addLinks" defaultMessage="Add links to Check with one click. Links will be added to your most recently active project." /></p>
        <p><FormattedMessage id="App.getStarted" defaultMessage="To get started, sign in." /></p>
        <Button label={<FormattedMessage id="App.signIn" defaultMessage="Sign In" />} />
      </div>
    );
  }
}

export default App;

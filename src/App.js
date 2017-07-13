import React, { Component } from 'react';
import './App.css';
import Button from './Button';

class App extends Component {
  render() {
    return (
      <div className="app">
        <h2>Add to Check</h2>
        <p>Add links to Check with one click. Links will be added to your most recently active project.</p>
        <p>To get started, sign in.</p>
        <Button label="Sign in" />
      </div>
    );
  }
}

export default App;

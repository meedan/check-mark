import React from 'react';
import ReactDOM from 'react-dom';

import Nested from './nested-component';

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {activeTab: null};
  }

  componentDidMount() {
    // Get the active tab and store it in component state.
    chrome.tabs.query({active: true}, tabs => {
      this.setState({activeTab: tabs[0]});
    });
  }

  render() {
    const {activeTab} = this.state;
    return (
      <div>
        <h1>CHECK MARK</h1>
        <p>
          Welcome to Check!
        </p>
        <p>
          Current Open Tab: {activeTab ? activeTab.url : '[waiting for result]'}
        </p>
        <Nested />
      </div>
    );
  }
}

ReactDOM.render(<Popup/>, document.getElementById('app'));
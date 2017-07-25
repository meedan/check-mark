import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Projects from './Projects';
import '../style/Save.css';

class Save extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProject: null
    };
  }

  onSelectProject(option) {
    this.setState({ selectedProject: option.value });
  }

  render() {
    return (
      <div id="save">
        <h2><FormattedMessage id="Save.addToCheck" defaultMessage="Add to Check" /></h2>
        <Projects onSelectProject={this.onSelectProject.bind(this)} />
        <p>Selected project: {this.state.selectedProject}</p>
      </div>
    );
  }
}

export default Save;

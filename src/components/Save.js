import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Projects from './Projects';
import Button from './Button';
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
        <div>
          <Projects onSelectProject={this.onSelectProject.bind(this)} />
          <span id="preview"><FormattedMessage id="Save.link" defaultMessage="Link: {link}" values={{ link: this.props.url }} /></span>
        </div>
        <Button label={<FormattedMessage id="Save.save" defaultMessage="Save" />} />
      </div>
    );
  }
}

export default Save;

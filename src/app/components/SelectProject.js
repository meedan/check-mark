import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import util from 'util';

class SelectProject extends Component {
  render() {
    var options = [],
        projects = this.props.projects;

    for (var i = 0; i < projects.length; i++) {
      options.push({ value: projects[i].id, label: projects[i].title });
    }

    return (
      <div>
        <label>Project</label>
        <Select
           name="project"
           value=""
           options={options}
        />
      </div>
    );
  }
}

export default SelectProject;

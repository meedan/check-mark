import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

class SelectProject extends Component {
  render() {
    var options = [],
        projects = this.props.projects;

    for (var i = 0; i < projects.length; i++) {
      options.push({ value: projects[i].id, label: projects[i].title });
    }

    return (
      <div>
        <label for="project">Project</label>
        <Select
           name="project"
           value=""
           className="dropdown"
           id="project"
           options={options}
        />
      </div>
    );
  }
}

export default SelectProject;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'react-native';

class Select extends Component {
  render() {
    const options = this.props.options;
    return (<Picker selectedValue={this.props.selectedValue} onValueChange={this.props.onValueChange}>
      {options.map((project) => {
        return (
          <Picker.Item key={project.value} label={project.label} value={project.value} />
        );
      })}
    </Picker>);
  }
}

Select.contextTypes = {
  platform: PropTypes.string
};

export default Select;

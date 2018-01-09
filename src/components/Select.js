import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { Picker } from 'react-native';
import styles from './styles';

const messages = defineMessages({
  select: {
    id: 'Select.select',
    defaultMessage: 'Select...',
  },
});

class Select extends Component {
  render() {
    const options = this.props.options;

    return (
      <Picker style={styles.picker} selectedValue={this.props.selectedValue} onValueChange={this.props.onValueChange}>
        <Picker.Item key={0} label={this.props.intl.formatMessage(messages.select)} value={0} />
        {options.map((project) => {
          return (
            <Picker.Item key={project.value} label={project.label} value={project.value} />
          );
        })}
      </Picker>
    );
  }
}

Select.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Select);

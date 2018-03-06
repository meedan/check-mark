import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { Picker, View } from 'react-native';
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
      <View style={styles.picker}>
        <Picker textStyle={styles.picker} style={styles.picker} selectedValue={this.props.selectedValue} onValueChange={this.props.onValueChange}>
          <Picker.Item style={styles.picker} key={0} label={this.props.intl.formatMessage(messages.select)} value={0} />
          {options.map((project) => {
            return (
              <Picker.Item style={styles.picker} key={project.value} label={project.label} value={project.value} />
            );
          })}
        </Picker>
      </View>
    );
  }
}

Select.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Select);

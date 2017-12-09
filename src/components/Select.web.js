import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectPlus from 'react-select-plus';
import { FormattedMessage } from 'react-intl';
import 'react-select-plus/dist/react-select-plus.css';

class Select extends Component {
  render() {
    const options = this.props.options;
    return <SelectPlus onChange={this.props.onValueChange}
                       options={this.props.groups}
                       placeholder={<FormattedMessage id="Select.select" defaultMessage="Select..." />}
                       value={this.props.selectedValue} />;
  }
}

Select.contextTypes = {
  platform: PropTypes.string
};

export default Select;

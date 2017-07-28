import React, { Component } from 'react';
import '../style/Button.css';

class Button extends Component {
  render() {
    return (
      <button onClick={this.props.onClick ? this.props.onClick.bind(this) : null}>
        {this.props.label}
      </button>
    );
  }
}

export default Button;

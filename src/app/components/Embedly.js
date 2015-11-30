import React, { Component, PropTypes } from 'react';
import scriptjs from 'scriptjs';

class Embedly extends Component {
  componentDidMount() {
    scriptjs('https://cdn.embedly.com/widgets/platform.js', function() {
      var element = document.getElementById('embedly');
      window.embedly('card', element);
    });
  }

  render() {
    return (
      <div className="embedly">
        <a
          data-card-controls="0"
          data-card-width="100%"
          className="embedly-card"
          id="embedly"
          href={this.props.url}>
        </a>
      </div>
    );
  }
}

export default Embedly;

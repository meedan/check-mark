import React, { Component, PropTypes } from 'react';
import scriptjs from 'scriptjs';

class Bridgembed extends Component {
  translationId() {
    return this.props.translation.id;
  }

  addBridgembedScriptTag() {
    const script = document.createElement('script');
    script.src = this.props.translation.embed_url;
    script.async = true;
    document.getElementById('bridge-embed-container').appendChild(script);
  }

  removeBridgembedTags() {
    const container = document.getElementById('bridge-embed-container');
    container.innerHTML = '<div id="loader">Loading...</div>';
  }

  componentDidMount() {
    this.addBridgembedScriptTag();
  }

  componentDidUpdate() {
    this.removeBridgembedTags();
    this.addBridgembedScriptTag();
  }

  componentWillUnmount() {
    this.removeBridgembedTags();
  }

  render() {
    return (<div id="bridge-embed-container"><div id="loader">Loading...</div></div>);
  }
}

export default Bridgembed;

import React, { Component, PropTypes } from 'react';

class PenderCard extends Component {
  addTag() {
    const script = document.createElement('script');
    script.src = this.props.penderUrl + '/api/medias.js?url=' + encodeURIComponent(this.props.url);
    script.async = true;
    script.type = 'text/javascript';
    document.getElementById('pender-card').appendChild(script);
  }

  removeTag() {
    const container = document.getElementById('pender-card');
    container.innerHTML = '';
  }

  componentDidMount() {
    this.addTag();
  }

  componentDidUpdate() {
    this.removeTag();
    this.addTag();
  }

  componentWillUnmount() {
    this.removeTag();
  }

  render() {
    return (<div id="pender-card" className='pender-card'></div>);
  }
}

export default PenderCard;

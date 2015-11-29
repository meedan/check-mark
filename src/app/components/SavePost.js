import React, { Component, PropTypes } from 'react';
import SelectProject from './SelectProject';

class SavePost extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, state } = this.props;
    return (
      <div>
        <p><a onClick={goBack}>Back</a></p>
        <p>{state.extension.url}</p>
        <SelectProject projects={state.bridge.projects} />
      </div>
    );
  }
}

export default SavePost;

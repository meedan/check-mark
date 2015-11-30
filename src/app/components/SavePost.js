import React, { Component, PropTypes } from 'react';
import SelectProject from './SelectProject';
import Embedly from './Embedly';

class SavePost extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, state } = this.props;
    return (
      <div>
        <form onSubmit={submitPost.bind(this)}>
          <p><a onClick={goBack}>Back</a></p>
          <Embedly url={state.extension.url} />
          <SelectProject projects={state.extension.projects} />
          <button className="btn">Add to Project</button>
        </form>
      </div>
    );
  }
}

export default SavePost;

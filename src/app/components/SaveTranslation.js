import React, { Component, PropTypes } from 'react';
import SelectProject from './SelectProject';
import Embedly from './Embedly';
import Select from 'react-select';

class SaveTranslation extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, saveTranslation, submitTranslation, state } = this.props;
    return (
      <div>
        <form onSubmit={submitTranslation.bind(this)}>
          <p><a onClick={goBack}>Back</a></p>
          <Embedly url={state.extension.url} />
          <SelectProject projects={state.extension.projects} />
          <label>Language</label>
          <Select name="lang" value="" options={state.extension.languages} />
          <label>Translation</label>
          <textarea name="translation" />
          <label>Annotation</label>
          <textarea name="annotation" />
          <button className="btn">Submit Translation</button>
        </form>
      </div>
    );
  }
}

export default SaveTranslation;

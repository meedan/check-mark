import React, { Component, PropTypes } from 'react';
import SelectProject from './SelectProject';
import Embedly from './Embedly';
import Select from 'react-select';
import BackBar from './BackBar';

class SaveTranslation extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, saveTranslation, submitTranslation, state } = this.props;
    return (
      <div>
        <BackBar goBack={goBack} />
        <div className="textured">
          <div className="light-gray-background">
            <h3 className="action">Translate this post</h3>
            <div className="column form-column">
              <Embedly url={state.extension.url} />
              <form onSubmit={submitTranslation.bind(this)}>
                
                <label for="translation">Translation</label>
                <textarea name="translation-text" id="translation">Enter your translation here</textarea>
                <label for="annotation">Annotation</label>
                <textarea name="annotation-text" id="annotation">Enter your annotation here</textarea>
                
                <div className="select-project">
                  <SelectProject projects={state.extension.projects} />
                </div>
                <div className="select-language">
                  <label>Language</label>
                  <Select name="language" value="" options={state.extension.languages} className="dropdown" />
                </div>
                
                <button className="btn btn-large" id="submit">Submit Translation</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SaveTranslation;

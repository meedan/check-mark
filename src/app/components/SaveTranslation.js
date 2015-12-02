import React, { Component, PropTypes } from 'react';
import SelectProject from './SelectProject';
import Embedly from './Embedly';
import Select from 'react-select';
import BackBar from './BackBar';
import util from 'util';

class SaveTranslation extends Component {
  onTranslationFocus() {
    var field = React.findDOMNode(this.translation)
    field.value = "";
    field.style.backgroundColor = '#F4F4F4';
  }

  onTranslationBlur() {
    React.findDOMNode(this.translation).style.backgroundColor = '#FFF';
  }

  onAnnotationFocus() {
    React.findDOMNode(this.annotation).value = "";
  }

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

                <textarea name="translation"
                          id="translation"
                          onFocus={this.onTranslationFocus.bind(this)} 
                          onBlur={this.onTranslationBlur.bind(this)} 
                          ref={(ref) => this.translation = ref}>Enter your translation here</textarea>

                <label for="annotation">Annotation</label>

                <textarea name="annotation" 
                          id="annotation"
                          onFocus={this.onAnnotationFocus.bind(this)} 
                          ref={(ref) => this.annotation = ref}>Enter your annotation here</textarea>
                
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

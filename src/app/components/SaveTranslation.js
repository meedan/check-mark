import React, { Component, PropTypes } from 'react';
import SelectProject from './SelectProject';
import Embedly from './Embedly';
import Select from 'react-select';
import BackBar from './BackBar';
import util from 'util';

class SaveTranslation extends Component {
  onTranslationFocus() {
    var field = React.findDOMNode(this.translation)
    if (field.value === 'Enter your translation here') {
      field.value = "";
    }
    field.style.backgroundColor = '#F4F4F4';
  }

  onTranslationBlur() {
    var field = React.findDOMNode(this.translation);
    field.style.backgroundColor = '#FFF';
  }

  onTranslationKey() {
    var field = React.findDOMNode(this.translation);
    window.storage.set('translation', field.value);
  }

  onAnnotationFocus() {
    var field = React.findDOMNode(this.annotation);
    if (field.value === 'Enter your annotation here') {
      field.value = "";
    }
  }

  onAnnotationKey() {
    var field = React.findDOMNode(this.annotation);
    window.storage.set('annotation', field.value);
  }

  getSavedValues() {
    var that = this;
    window.storage.get('translation', function(value) {
      var field = React.findDOMNode(that.translation);
      if (value != '' && value != undefined) {
        field.value = value;
      }
    });
    window.storage.get('annotation', function(value) {
      var field = React.findDOMNode(that.annotation);
      if (value != '' && value != undefined) {
        field.value = value;
      }
    });
  }

  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, saveTranslation, submitTranslation, myTranslations, state } = this.props;

    this.getSavedValues();

    return (
      <div>
        <BackBar goBack={goBack} myTranslations={myTranslations} />
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
                          onKeyUp={this.onTranslationKey.bind(this)}
                          ref={(ref) => this.translation = ref}>Enter your translation here</textarea>

                <label for="annotation">Annotation</label>

                <textarea name="annotation" 
                          id="annotation"
                          onFocus={this.onAnnotationFocus.bind(this)} 
                          onKeyUp={this.onAnnotationKey.bind(this)}
                          ref={(ref) => this.annotation = ref}>Enter your annotation here</textarea>
                
                <div className="select-project">
                  <SelectProject projects={state.extension.projects} />
                </div>

                <div className="select-language">
                  <label>Target Language</label>
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

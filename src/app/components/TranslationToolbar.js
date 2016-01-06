import React, { Component, PropTypes } from 'react';
import ConfirmationLink from './ConfirmationLink';

class TranslationToolbar extends Component {
  nextTranslation() {
    this.props.myTranslations(1);
  }

  previousTranslation() {
    this.props.myTranslations(-1);
  }

  render() {
    return (
      <div id="my-translations-pager">
        <a 
          onClick={this.previousTranslation.bind(this)} 
          id="my-translations-link-previous" 
          className={this.props.translation.index === 0 ? 'hidden' : ''}>Newer</a> 

        <div>
          <a onClick={this.props.editTranslation} id="my-translations-link-edit">Edit</a>
          <ConfirmationLink id="my-translations-link-delete" label="Delete" action={this.props.deleteTranslation} />
        </div>

        <a 
          onClick={this.nextTranslation.bind(this)} 
          id="my-translations-link-next">Older</a>
      </div>
    );
  }
}

export default TranslationToolbar;

import React, { Component, PropTypes } from 'react';
import BackBar from './BackBar';
import Bridgembed from './Bridgembed';
import TranslationToolbar from './TranslationToolbar';

class ListTranslations extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, saveTranslation, submitTranslation, myTranslations, deleteTranslation, editTranslation, state } = this.props;
    return (
      <div id="my-translations">
        <BackBar goBack={goBack} myTranslations={myTranslations} />
        <div className="textured">
          <div className="light-gray-background">
            <h3 className="action">My Translations</h3>
            <div className="column form-column">

              <TranslationToolbar translation={state.bridge.translation} myTranslations={myTranslations} deleteTranslation={deleteTranslation} editTranslation={editTranslation} />

              <Bridgembed translation={state.bridge.translation} />

              <TranslationToolbar translation={state.bridge.translation} myTranslations={myTranslations} deleteTranslation={deleteTranslation} editTranslation={editTranslation} />

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListTranslations;

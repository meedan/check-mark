import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';

class EditTranslationMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation editTranslation {
      editTranslation
    }`;
  }

  getVariables() {
    var translation = this.props.translation;
    return { content: translation.content, annotation: translation.annotation, translationId: translation.id };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on EditTranslationPayload {
        translation {
          annotation,
          content
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        translation: this.props.translation.id,
      },
    }];
  }
}

export default EditTranslationMutation; 

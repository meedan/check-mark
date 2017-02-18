import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';

class CreateMediaMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation createMedia {
      createMedia
    }`;
  }

  getVariables() {
    console.log(this.props.media);

    var media = this.props.media,
        information = JSON.stringify(media.information);
    return { url: media.url, information: information, project_id: media.project_id};
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateMediaPayload {
        media
      }
    `;
  }

  getConfigs() {
    return [
      {
        type: 'REQUIRED_CHILDREN',
        children: [Relay.QL`
          fragment on CreateMediaPayload {
            media {
              dbid
            }
          }`
        ]
      }
    ];
  }
}

export default CreateMediaMutation; 

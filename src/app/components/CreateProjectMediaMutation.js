import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';

class CreateProjectMediaMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation createProjectMedia {
      createProjectMedia
    }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateProjectMediaPayload {
        project_mediaEdge,
        project_media,
        project { project_medias }
      }
    `;
  }

  getVariables() {
    console.log(this.props.media);
    return { url: this.props.media.url, quote: this.props.media.quote, project_id: this.props.media.project_id };
  }

  getFiles() {
    return { file: this.props.media.image };
  }

  getConfigs() {
    return [
      {
        type: 'RANGE_ADD',
        parentName: 'project',
        parentID: this.props.media.project_id,
        connectionName: 'project_medias',
        edgeName: 'project_mediaEdge',
        rangeBehaviors: {
          '': 'prepend',
        },
      },
      {
        type: 'REQUIRED_CHILDREN',
        children: [Relay.QL`
          fragment on CreateProjectMediaPayload {
            project_media {
              dbid
            }
          }`,
        ],
      },
    ];
  }
}

export default CreateProjectMediaMutation;

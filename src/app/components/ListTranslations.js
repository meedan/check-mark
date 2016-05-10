import React, { Component, PropTypes } from 'react';
import BackBar from './BackBar';
import Bridgembed from './Bridgembed';
import TranslationToolbar from './TranslationToolbar';
import Relay from 'react-relay';

class ListTranslations extends Component {
  render() {
    return (
      <div id="my-translations">
        <div className="textured">
          <div className="light-gray-background">
            <h3 className="action">My Translations</h3>
            <div className="column form-column">
              <Bridgembed translation={this.props.translation} /> 
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const ListTranslationsContainer = Relay.createContainer(ListTranslations, {
  fragments: {
    translation: () => Relay.QL`
      fragment on Translation {
        id,
        embed_url
      }
    `,
  },
});

export default ListTranslationsContainer;

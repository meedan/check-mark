import React, { Component, PropTypes } from 'react';
import BackBar from './BackBar';
import Bridgembed from './Bridgembed';
import TranslationToolbar from './TranslationToolbar';
import Relay from 'react-relay';
import TranslationsRoute from './TranslationsRoute';
import config from '../config/config.js';

const pageSize = 2;
let editTranslationAction = null;

class ListTranslations extends Component {
  constructor(props) {
    super(props);
    this.currentTranslationIndex = 0;
  }

  getCurrentTranslation() {
    var translations = this.props.me.translations.edges,
        index = this.currentTranslationIndex;
    if (index == translations.length - 1) {
      this.props.relay.setVariables({
        pageSize: translations.length + pageSize
      });
    }
    var translations = this.props.me.translations.edges;
    if (translations == null || translations[index] == null) {
      this.currentTranslationIndex -= 1;
    }
    index = this.currentTranslationIndex;
    var translation = translations[index].node;
    translation.index = index;
    return translation;
  }

  goToTranslation(step) {
    this.currentTranslationIndex += step;
    if (this.currentTranslationIndex < 0) {
      this.currentTranslationIndex = 0;
    }
    this.forceUpdate();
  }

  editTranslation() {
    var translation = this.getCurrentTranslation();
    editTranslationAction(translation);
  }

  render() {
    var translation = this.getCurrentTranslation();

    return (
      <div>
        <TranslationToolbar translation={translation} goToTranslation={this.goToTranslation.bind(this)} editTranslation={this.editTranslation.bind(this)} deleteTranslation={null} />
        <p></p>
        <Bridgembed translation={translation} />
      </div>
    );
  }
}

const ListTranslationsContainer = Relay.createContainer(ListTranslations, {
  initialVariables: {
    pageSize: pageSize
  },
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        name,
        translations(first: $pageSize) {
          edges {
            node {
              id,
              embed_url,
              source_url,
              content,
              annotation
            }
          }
        }
      }
    `
  }
});

class ListTranslationsScreen extends Component {
  setUpGraphql(session) {
    Relay.injectNetworkLayer(new Relay.DefaultNetworkLayer(config.bridgeApiBase + '/api/graphql', {
      headers: {
        'X-Bridge-Token': session.token,
        'X-Bridge-Uuid': session.id,
        'X-Bridge-Provider': session.provider,
        'X-Bridge-Secret': session.secret
      }
    }));
  }
  
  componentWillMount() {
    editTranslationAction = this.props.editTranslation;
  }
  
  render() {
    var route = new TranslationsRoute();
    this.setUpGraphql(this.props.state.bridge.session);

    return (
      <div id="my-translations">
        <BackBar goBack={this.props.goBack} myTranslations={this.props.myTranslations} />
        <div className="textured">
          <div className="light-gray-background">
            <h3 className="action">My Translations</h3>
            <div className="column form-column">
              <Relay.RootContainer Component={ListTranslationsContainer} route={route} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListTranslationsScreen;

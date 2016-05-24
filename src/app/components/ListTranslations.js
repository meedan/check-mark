import React, { Component, PropTypes } from 'react';
import BackBar from './BackBar';
import Bridgembed from './Bridgembed';
import TranslationToolbar from './TranslationToolbar';
import Relay from 'react-relay';
import TranslationsRoute from './TranslationsRoute';
import config from '../config/config.js';
import Pusher from 'pusher-js';
import util from 'util';

const pageSize = 2;
let editTranslationAction = null;

class ListTranslations extends Component {
  constructor(props) {
    super(props);
    this.currentTranslationIndex = 0;
    this.subscribe();
  }

  subscribe() {
    var that = this;
    Pusher.logToConsole = true;

    var pusher = new Pusher(config.pusherKey, {
      encrypted: true
    });

    /*
    var fragment = Relay.QL`
      fragment on User {
        id,
        name,
        userhash,
        translations(first: $pageSize) {
          edges {
            node {
              id,
              embed_url,
              source_url,
              content,
              annotation
            },
            cursor
          },
          pageInfo {
            hasNextPage,
            hasPreviousPage
          } 
        }
      }
    `;
    */

    var channel = pusher.subscribe('user_' + that.props.me.userhash);
    channel.bind('translation_created', function(data) {
      /*
      var query = Relay.createQuery(Relay.QL`query {
        me {
          ${fragment}
        }
      }`, { pageSize: pageSize + 1 });

      // Reindex current translations
      data.message.node.index = 0;
      var translations = that.props.me.translations.edges,
          newTranslations = [{ node: data.message.node.translations.edges[0].node, cursor: data.message.cursor }];
      for (var i = 0; i < translations.length; i++) {
        var node = translations[i].node;
        node.index = i + 1;
        newTranslations.push({ node: node, cursor: window.btoa(i + 2) });
      }
      that.props.me.translations.edges = newTranslations;
      that.props.currentTranslationIndex = 0;
      that.props.currentTranslation = data.message.node;
      that.forceUpdate();

      const payload = {
        me: {
          translations: {
            edges: newTranslations
          },
          id: that.props.me.id,
          name: that.props.me.name,
          userhash: that.props.me.userhash
        }
      };
      
      Relay.Store.getStoreData().handleQueryPayload(query, payload);
      */
      that.props.relay.forceFetch();
    });
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
        id,
        name,
        userhash,
        translations(first: $pageSize) {
          edges {
            node {
              id,
              embed_url,
              source_url,
              content,
              annotation
            },
            cursor
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

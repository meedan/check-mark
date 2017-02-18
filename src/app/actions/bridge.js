import { LOGIN_TWITTER, LOGIN_FACEBOOK, GO_BACK, SAVE_POST, SAVE_TRANSLATION, LIST_TRANSLATIONS, ERROR } from '../constants/ActionTypes';
import superagent from 'superagent';
import util from 'util';
import config from '../config/config.js';
import Relay from 'react-relay';
import CreateMediaMutation from '../components/CreateMediaMutation';

// Request information from the backend, after logged in

var request = function(method, endpoint, session, data, type, dispatch, view, previousView, callback) {
  var headers = {
    'X-Check-Token': session.token
  };

  var path = config.bridgeApiBase + '/api/' + endpoint;

  if (method === 'get' && Object.keys(data).length > 0) {
    path += '?'
    for (var key in data) {
      path += key + '=' + data[key] + '&'
    }
  }

  var http = superagent[method](path);

  http.timeout(120000);

  for (var key in headers) {
    http.set(key, headers[key]);
  }

  http.send(data);

  http.end(function(err, response) {
    if (err) {
      if (err.response) {
        var json = JSON.parse(err.response.text);
        dispatch({ type: ERROR, message: '<h2>' + json.data.message + '</h2>', view: 'message', session: session, previousView: previousView, image: 'error-invalid-url' })
      }
      else {
        dispatch({ type: ERROR, message: util.inspect(err), view: 'message', session: session, previousView: previousView, image: 'error-invalid-url' })
      }
    }
    else {
      var json = JSON.parse(response.text);
      if (response.status === 200) {
        callback(dispatch, json);
      }
      else {
        dispatch({ type: ERROR, message: '<h2>' + json.data.message + '</h2>', view: 'message', session: session, previousView: previousView, image: 'error-invalid-url' })
      }
    }
  });
};

// Request auth information from backend

var requestAuth = function(provider, type, dispatch) {
  superagent.get(config.bridgeApiBase + '/api/me')
  .end(function(err, response) {
    if (err) {
      dispatch({ type: ERROR, message: '<h2>Could not connect to Bridge</h2>', view: 'message', session: null, previousView: 'login' })
    }
    else {
      var userData = JSON.parse(response.text);
      if (!userData || !userData.data || !userData.data.token) {
        var win = window.open(config.bridgeApiBase + '/api/users/auth/' + provider + '?destination=/close.html', provider);
        var timer = window.setInterval(function() {   
          if (win.closed) {  
            window.clearInterval(timer);
            requestAuth(provider, type, dispatch);
          }  
        }, 500);
      }
      else {
        dispatch({ session: userData.data, type: type, provider: provider, view: 'menu', previousView: 'login' });
      }
    }
  });
};

export function loginTwitter() {
  return (dispatch, getState) => {
    var session = getState().bridge.session;

    if (session != undefined && session.provider === 'twitter') {
      dispatch({ session: session, type: LOGIN_TWITTER, provider: 'twitter', view: 'menu', previousView: 'login' });
    }

    requestAuth('twitter', LOGIN_TWITTER, dispatch);
  };
}

export function loginFacebook() {
  return (dispatch, getState) => {
    var session = getState().bridge.session;

    if (session != undefined && session.provider === 'facebook') {
      dispatch({ session: session, type: LOGIN_FACEBOOK, provider: 'facebook', view: 'menu', previousView: 'login' });
    }

    requestAuth('facebook', LOGIN_FACEBOOK, dispatch);
  };
}

export function goBack() {
  return (dispatch, getState) => {
    // var state = getState().bridge;
    // if (state.previousView === 'reload') {
      getState().extension.runtime.reload();
    // }
    // else {
    //   dispatch({ type: GO_BACK, view: state.previousView, session: state.session, previousView: 'login' });
    // }
  };
}

var saveObject = function(dispatch, state, type, view, url) {
  var bstate = state.bridge,
      session = bstate.session;
  console.log(session);
  
  var team = session.current_team,
      projects = team ? team.projects : [],
      languages = session.get_languages; // [{ id: 'en', title: 'English' }, ...]

  if (!team) {
    var m = '<h1>Oops! Looks like you\'re not assigned to a team yet</h1>' +
            '<h2>Please email us hello@speakbridge.io to be assigned to a team.</h2>';
    dispatch({ type: ERROR, message: m, view: 'message', session: bstate.session, previousView: bstate.view, image: 'error-unassigned' });
  }

  else if (projects.length === 0) {
    var m = '<h1>Oops! Looks like you\'re not assigned to a project yet</h1>' +
            '<h2>Please email us hello@speakbridge.io to be assigned to a project.</h2>';
    dispatch({ type: ERROR, message: m, view: 'message', session: bstate.session, previousView: bstate.view, image: 'error-unassigned' });
  }

  else if (languages === '') {
    var m = '<h1>Oops! Looks like you don\'t have languages set yet.</h1>' +
            '<h2>Please email us hello@speakbridge.io to choose languages.</h2>';
    dispatch({ type: ERROR, message: m, view: 'message', session: bstate.session, previousView: bstate.view, image: 'error-unassigned' });
  }
  
  else {
    state.extension.projects = projects.slice();
    state.extension.targetlanguages = languages.slice();
    languages.unshift({ id: '', title: 'Auto-Detect' });
    state.extension.sourcelanguages = languages.slice();
    dispatch({ type: type, view: view, session: bstate.session, previousView: 'menu', url: url });
  }
}

export function savePost() {
  return (dispatch, getState) => {
    var state = getState();
    saveObject(dispatch, state, SAVE_POST, 'save_post', '');
  };
}

/*export function saveTranslation() {
  return (dispatch, getState) => {
    var state = getState();
    saveObject(dispatch, state, SAVE_TRANSLATION, 'save_translation', state.extension.url);
  };
}*/

export function submitPost(e) {
  return (dispatch, getState) => {
    disableButton();

    var project_id  = e.target['0'].value,
        language    = e.target['2'].value,
        state       = getState().bridge,
        url         = getState().extension.url,
        information = {};

    if (getState().extension.selection) {
      url = '';
      information = { quote: getState().extension.selection };
    }

    var onFailure = (transaction) => {
      transaction.getError().json().then(function(json) {
        var message = 'Sorry, could not create translation';
        if (json.error) {
          message = json.error;
        }
        dispatch({ type: ERROR, message: '<h2>' + message + '</h2>', view: 'message', session: state.session, previousView: 'save_translation' });
      });
    };

    var onSuccess = (response) => {
      window.storage.set(url + ' annotation', '');
      window.storage.set(url + ' translation', '');
        
      var embed_url = config.bridgeEmbedBase.replace(/^(https?:\/\/)/, '$1' + state.session.current_team.subdomain + '.') + '/project/' + project_id + '/media/' + response.createMedia.media.dbid;

      dispatch({ type: SAVE_POST, message: '<h1>Success!</h1><h2>This post will be available for translators at <a href="' + embed_url + '" target="_blank" class="plain-link">' + embed_url + '</a></h2>', view: 'message', session: state.session, previousView: 'reload', image: 'confirmation-saved' })
    };

    Relay.Store.commitUpdate(
      new CreateMediaMutation({
        media: {
          url: url,
          information: information,
          project_id: parseInt(project_id)
        }
      }),
      { onSuccess, onFailure }
    );
    
    e.preventDefault();
  };
}

export function submitTranslation(e) {
  return (dispatch, getState) => {
    disableButton();

    var form = document.forms[0];

    var project_id  = form.project.value,
        from        = form.from.value,
        to          = form.to.value,
        translation = form.translation.value,
        comment     = form.annotation.value,
        state       = getState().bridge,
        url         = getState().extension.url,
        information = {};

    if (getState().extension.selection) {
      url = '';
      information = { quote: getState().extension.selection };
    }

    if (comment === 'Enter your annotation here') {
      comment = '';
    }

    if (translation === 'Enter your translation here') {
      translation = '';
    }

    if (project_id === '') {
      dispatch({ type: ERROR, message: '<h2>Please choose a project</h2>', view: 'message', session: state.session, previousView: 'save_translation' });
    }

    else if (to === '') {
      dispatch({ type: ERROR, message: '<h2>Target language cannot be blank</h2>', view: 'message', session: state.session, previousView: 'save_translation' });
    }

    else {
      var onFailure = (transaction) => {
        transaction.getError().json().then(function(json) {
          var message = 'Sorry, could not create translation';
          if (json.error) {
            message = json.error;
          }
          dispatch({ type: ERROR, message: '<h2>' + message + '</h2>', view: 'message', session: state.session, previousView: 'save_translation' });
        });
      };

      var onSuccess = (response) => {
        window.storage.set(url + ' annotation', '');
        window.storage.set(url + ' translation', '');

        var embed_url = config.bridgeEmbedBase.replace(/^(https?:\/\/)/, '$1' + state.session.current_team.subdomain + '.') + '/project/' + project_id + '/media/' + response.createMedia.media.dbid;

        dispatch({ type: SAVE_TRANSLATION, message: '<h1>Success! Thank you!</h1><h2>See your translation at</h2><a href="' + embed_url + '" target="_blank" class="plain-link">' + embed_url + '</a>', view: 'message', session: state.session, previousView: 'reload', image: 'confirmation-translated' });
      };

      Relay.Store.commitUpdate(
        new CreateMediaMutation({
          media: {
            translation: { annotation_type: 'translation', translation: translation, from: from, to: to, comment: comment },
            information: information,
            url: url,
            project_id: parseInt(project_id)
          }
        }),
        { onSuccess, onFailure }
      );
    }

    e.preventDefault();
  };
}

function disableButton() {
  var button = document.getElementById('submit');
  if (button) {
    button.disabled = 'disabled';
    button.innerHTML = 'Please wait...';
  }
}

export function myTranslations(step) {
  return (dispatch, getState) => {
    dispatch({ type: LIST_TRANSLATIONS, translation: null, view: 'list_translations', session: getState().bridge.session, previousView: 'login' });
  };
}

export function deleteTranslation() {
  return (dispatch, getState) => {
    var state = getState().bridge,
        extension = getState().extension,
        translation = extension.translations[extension.currentTranslation];
 
    request('del', 'translations/' + translation.id, state.session, {}, LIST_TRANSLATIONS, dispatch, 'list_translations', 'login', function(dispatch, response) {
      if (response.type === 'success') {
        extension.translations.splice(extension.currentTranslation, 1);
        dispatch({ type: LIST_TRANSLATIONS, translation: extension.translations[extension.currentTranslation],
                   view: 'list_translations', session: state.session, previousView: 'login' });
      }
      else {
        window.alert('Could not delete your translation. Please try again later.');
      }
    });
  };
}

export function editTranslation(translation) {
  return (dispatch, getState) => {
    var state = getState().bridge,
        extension = getState().extension;

    extension.translation = translation;

    dispatch({ type: SAVE_TRANSLATION, view: 'save_translation', session: state.session, previousView: 'menu', url: translation.source_url, action: 'edit', translation: translation.content, annotation: translation.annotation });
  };
}

export function updateTranslation(e) {
  return (dispatch, getState) => {
    disableButton();

    var text        = e.target['0'].value,
        comment     = e.target['1'].value,
        state       = getState().bridge,
        extension   = getState().extension,
        translation = extension.translation;
    
    if (comment === 'Enter your annotation here') {
      comment = '';
    }

    if (text === 'Enter your translation here' || text === '') {
      dispatch({ type: ERROR, message: '<h2>Translation cannot be blank</h2>', view: 'message', session: state.session, previousView: 'save_translation' });
    }

    else {
      var url = translation.source_url;
      window.storage.set(url + ' annotation', '');
      window.storage.set(url + ' translation', '');

      var embed_url = translation.embed_url.replace(/\.js$/, '');
      dispatch({ type: SAVE_TRANSLATION, message: '<h1>Success! Thank you!</h1><h2>See your translation at</h2><a href="' + embed_url + '" target="_blank" class="plain-link">' + embed_url + '</a>', view: 'message', session: state.session, previousView: 'reload', image: 'confirmation-translated' })
    }

    e.preventDefault();
  };
}

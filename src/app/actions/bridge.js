import { LOGIN_TWITTER, LOGIN_FACEBOOK, GO_BACK, SAVE_POST, SAVE_TRANSLATION, LIST_TRANSLATIONS, ERROR } from '../constants/ActionTypes';
import superagent from 'superagent';
import util from 'util';
import config from '../config/config.js';

// Request information from the backend, after logged in

var request = function(method, endpoint, session, data, type, dispatch, view, previousView, callback) {
  var headers = {
    'X-Bridge-Token': session.token,
    'X-Bridge-Uuid': session.id,
    'X-Bridge-Provider': session.provider,
    'X-Bridge-Secret': session.secret
  };

  var path = config.bridgeApiBase + '/api/' + endpoint;

  if (method === 'get' && Object.keys(data).length > 0) {
    path += '?'
    for (var key in data) {
      path += key + '=' + data[key] + '&'
    }
  }

  var http = superagent[method](path);

  http.timeout(30000);

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
  superagent.get(config.bridgeApiBase + '/api/users/' + provider + '_info')
  .end(function(err, response) {
    if (err) {
      dispatch({ type: ERROR, message: '<h2>Could not connect to Bridge</h2>', view: 'message', session: null, previousView: 'login' })
    }
    else if (response.text === 'null') {
      var win = window.open(config.bridgeApiBase + '/api/users/auth/' + provider + '?destination=/close.html', provider);
      var timer = window.setInterval(function() {   
        if (win.closed) {  
          window.clearInterval(timer);
          requestAuth(provider, type, dispatch);
        }  
      }, 500);
    }
    else {
      dispatch({ session: JSON.parse(response.text), type: type, provider: provider, view: 'menu', previousView: 'login' });
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

export function savePost() {
  return (dispatch, getState) => {
    var state = getState().bridge;
    request('get', 'projects', state.session, {}, SAVE_POST, dispatch, 'save_post', state.view, function(dispatch, response) {
      var projects = response.data;
      if (projects.length === 0) {
        dispatch({ type: ERROR, message: '<h1>Oops! Looks like you\'re not assigned to a project yet</h1><h2>Please email us hello@speakbridge.io to be assigned to a project.</h2>', view: 'message', session: state.session, previousView: state.view, image: 'error-unassigned' })
      }
      else {
        getState().extension.projects = projects.slice();
        dispatch({ type: SAVE_POST, view: 'save_post', session: state.session, previousView: 'menu' })
      }
    });
  };
}

export function saveTranslation() {
  return (dispatch, getState) => {
    var state = getState().bridge;
    request('get', 'projects', state.session, {}, SAVE_TRANSLATION, dispatch, 'save_translation', state.view, function(dispatch, response) {
      var projects = response.data;
      if (projects.length === 0) {
        dispatch({ type: ERROR, message: '<h1>Oops! Looks like you\'re not assigned to a project yet</h1><h2>Please email us hello@speakbridge.io to be assigned to a project.</h2>', view: 'message', session: state.session, previousView: state.view, image: 'error-unassigned' })
      }
      else {
        getState().extension.projects = projects.slice();
        request('get', 'languages/me', state.session, {}, SAVE_TRANSLATION, dispatch, 'save_translation', state.view, function(dispatch, response) {
          var languages = [];
          
          // FIXME: Get names from server
          var labels = {
            'en_US': 'English',
            'pt_BR': 'Portuguese',
            'es_LA': 'Spanish',
            'ar_AR': 'Arabic'
          };

          for (var value in labels) {
            languages.push({ label: labels[value], value: value });
          }

          /*
          var pairs = response.data;
          for (var i = 0; i < pairs.length; i++) {
            var value = pairs[i].replace(/^[^:]+:/, '');
            languages.push({ label: labels[value], value: value });
          }
          */

          getState().extension.languages = languages.slice();
          dispatch({ type: SAVE_TRANSLATION, view: 'save_translation', session: state.session, previousView: 'menu', url: getState().extension.url })
        });
      }
    });
  };
}

export function submitPost(e) {
  return (dispatch, getState) => {
    disableButton();

    var project_id = e.target['0'].value,
        state      = getState().bridge,
        url        = getState().extension.url;

    request('post', 'posts', state.session, { url: url, project_id: project_id }, SAVE_POST, dispatch, 'message', 'save_post', function(dispatch, response) {
      dispatch({ type: SAVE_POST, message: '<h1>Success!</h1><h2>This post will be available for translators</h2>', view: 'message', session: state.session, previousView: 'reload', image: 'confirmation-saved' })
    });
    e.preventDefault();
  };
}

export function submitTranslation(e) {
  return (dispatch, getState) => {
    disableButton();

    var project_id  = e.target['2'].value,
        lang        = e.target['4'].value,
        translation = e.target['0'].value,
        comment     = e.target['1'].value,
        state       = getState().bridge,
        url         = getState().extension.url;

    if (comment === 'Enter your annotation here') {
      comment = '';
    }

    if (translation === 'Enter your translation here' || translation === '') {
      dispatch({ type: ERROR, message: '<h2>Translation cannot be blank</h2>', view: 'message', session: state.session, previousView: 'save_translation' });
    }

    else if (lang === '') {
      dispatch({ type: ERROR, message: '<h2>Language cannot be blank</h2>', view: 'message', session: state.session, previousView: 'save_translation' });
    }

    else {
      request('post', 'posts', state.session, { url: url, project_id: project_id, translation: translation, comment: comment, lang: lang }, SAVE_TRANSLATION, dispatch, 'message', 'save_translation', function(dispatch, response) {
        window.storage.set(url + ' annotation', '');
        window.storage.set(url + ' translation', '');
        var embed_url = response.data.embed_url;
        dispatch({ type: SAVE_TRANSLATION, message: '<h1>Success! Thank you!</h1><h2>See your translation at</h2><a href="' + embed_url + '" target="_blank" class="plain-link">' + embed_url + '</a>', view: 'message', session: state.session, previousView: 'reload', image: 'confirmation-translated' })
      });
    }

    e.preventDefault();
  };
}

function disableButton() {
  var button = document.getElementById('submit');
  button.disabled = 'disabled';
  button.innerHTML = 'Please wait...';
}

export function myTranslations(step) {
  return (dispatch, getState) => {
    var state = getState().bridge,
        extension = getState().extension,
        params = { 'max-results': 10 };

    var dispatchCurrentTranslation = function() {
      dispatch({ type: LIST_TRANSLATIONS, translation: extension.translations[extension.currentTranslation],
                 view: 'list_translations', session: state.session, previousView: 'login' });
    };

    // Initialization

    if (!extension.translations) {
      extension.translations = [];
    }

    if (!extension.currentTranslation) {
      extension.currentTranslation = 0;
    }

    // Try to get a translation

    var translation = extension.translations[extension.currentTranslation + step];

    // Translation is not loaded yet

    if (translation === undefined) {

      // If going backwards, it's because we reached the first one

      if (step < 0) {
        extension.currentTranslation = 0;
        dispatchCurrentTranslation();
      }

      // Otherwise, we need to load more translations from the backend
      
      else {
        if (extension.translations.length > 0) {
          params['from-id'] = extension.translations[extension.currentTranslation].id;
        }

        // Avoid double click

        var link = step === 0 ? document.getElementById('my-translations-link') : document.getElementById('my-translations-link-next');
        link.onclick = function() { return false; };
        link.innerHTML = 'Loading...';

        request('get', 'translations/me', state.session, params, LIST_TRANSLATIONS, dispatch, 'list_translations', 'login', function(dispatch, response) {
          var translations = response.data;
          for (var i = 0; i < translations.length; i++) {
            var t = translations[i];
            extension.translations.push({
              id: t.id,
              embed_url: t.embed_url + '.js',
              index: extension.translations.length,
              source_url: t.source.link,
              translation: t.text,
              annotation: (t.comments.length > 0 ? t.comments[0].text : '')
            });
          }
          extension.currentTranslation += step;
          link.innerHTML = 'Older';
          dispatchCurrentTranslation();
        });
      }
    }

    // This translation is loaded
    
    else {
      extension.currentTranslation += step;
      dispatchCurrentTranslation();
    }
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

export function editTranslation() {
  return (dispatch, getState) => {
    var state = getState().bridge,
        extension = getState().extension,
        translation = extension.translations[extension.currentTranslation];

    dispatch({ type: SAVE_TRANSLATION, view: 'save_translation', session: state.session, previousView: 'menu', url: translation.source_url, action: 'edit', translation: translation.translation, annotation: translation.annotation });
  };
}

export function updateTranslation(e) {
  return (dispatch, getState) => {
    disableButton();

    var text        = e.target['0'].value,
        comment     = e.target['1'].value,
        state       = getState().bridge,
        extension   = getState().extension,
        translation = extension.translations[extension.currentTranslation];

    if (comment === 'Enter your annotation here') {
      comment = '';
    }

    if (text === 'Enter your translation here' || text === '') {
      dispatch({ type: ERROR, message: '<h2>Translation cannot be blank</h2>', view: 'message', session: state.session, previousView: 'save_translation' });
    }

    else {
      request('put', 'translations/' + translation.id, state.session, { text: text, comment: comment }, SAVE_TRANSLATION, dispatch, 'message', 'save_translation', function(dispatch, response) {
        var url = translation.source_url;
        window.storage.set(url + ' annotation', '');
        window.storage.set(url + ' translation', '');
        if (response.type === 'success') {
          var embed_url = translation.embed_url.replace(/\.js$/, '');
          dispatch({ type: SAVE_TRANSLATION, message: '<h1>Success! Thank you!</h1><h2>See your translation at</h2><a href="' + embed_url + '" target="_blank" class="plain-link">' + embed_url + '</a>', view: 'message', session: state.session, previousView: 'reload', image: 'confirmation-translated' })
        }
        else {
          dispatch({ type: ERROR, message: '<h2>Could not update translation</h2>', view: 'message', session: state.session, previousView: 'save_translation' });
        }
      });
    }

    e.preventDefault();
  };
}

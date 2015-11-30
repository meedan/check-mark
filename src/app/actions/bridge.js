import { LOGIN_TWITTER, LOGIN_FACEBOOK, GO_BACK, SAVE_POST, SAVE_TRANSLATION, ERROR } from '../constants/ActionTypes';
import axios from 'axios';
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
  axios({ method: method, url: config.bridgeApiBase + '/api/' + endpoint, headers: headers, data: data, timeout: 100000 })
  .then(function(response) {
     callback(dispatch, response);
  })
  .catch(function(response) {
    if (response instanceof Error) {
      dispatch({ type: ERROR, message: response.message, view: 'message', session: session, previousView: previousView })
    }
    else {
      var message = 'Error code: ' + response.status;
      if (response.data.data && response.data.data.message) {
        message = response.data.data.message;
      }
      dispatch({ type: ERROR, message: message, view: 'message', session: session, previousView: previousView })
    }
  });
};

// Request auth information from backend

var requestAuth = function(provider, type, dispatch) {
  axios.get(config.bridgeApiBase + '/api/users/' + provider + '_info')
  .then(function(response) {
    if (response.data == null) {
      var win = window.open(config.bridgeApiBase + '/api/users/auth/' + provider + '?destination=/close.html', provider);
      var timer = window.setInterval(function() {   
        if (win.closed) {  
          window.clearInterval(timer);
          requestAuth(provider, type, dispatch);
        }  
      }, 500);
    }
    else {
      dispatch({ session: response.data, type: type, provider: provider, view: 'menu', previousView: 'login' });
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
    var state = getState().bridge;
    dispatch({ type: GO_BACK, view: state.previousView, session: state.session, previousView: 'login' });
  };
}

export function savePost() {
  return (dispatch, getState) => {
    var state = getState().bridge;
    request('get', 'projects', state.session, {}, SAVE_POST, dispatch, 'save_post', state.view, function(dispatch, response) {
      var projects = response.data.data;
      if (projects.length === 0) {
        dispatch({ type: ERROR, message: 'Oops! Looks like you\'re not assigned to a project yet. Please email us hello@speakbridge.io to be assigned to a project.', view: 'message', session: state.session, previousView: state.view, errorType: 'no-project' })
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
      var projects = response.data.data;
      if (projects.length === 0) {
        dispatch({ type: ERROR, message: 'Oops! Looks like you\'re not assigned to a project yet. Please email us hello@speakbridge.io to be assigned to a project.', view: 'message', session: state.session, previousView: state.view, errorType: 'no-project' })
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
          var pairs = response.data.data;
          for (var i = 0; i < pairs.length; i++) {
            var value = pairs[i].replace(/^[^:]+:/, '');
            languages.push({ label: labels[value], value: value });
          }
          getState().extension.languages = languages.slice();
          dispatch({ type: SAVE_POST, view: 'save_translation', session: state.session, previousView: 'menu' })
        });
      }
    });
  };
}

export function submitPost(data) {
  return (dispatch, getState) => {
    var project_id = data.target['0'].value,
        state      = getState().bridge,
        url        = getState().extension.url;

    request('post', 'posts', state.session, { url: url, project_id: project_id }, SAVE_POST, dispatch, 'message', 'save_post', function(dispatch, response) {
      dispatch({ type: SAVE_POST, message: 'Thanks, your post was saved!', view: 'message', session: state.session, previousView: 'save_post' })
    });
  };
}

export function submitTranslation(data) {
  return (dispatch, getState) => {
    var project_id  = data.target['0'].value,
        lang        = data.target['2'].value,
        translation = data.target['4'].value,
        comment     = data.target['5'].value,
        state       = getState().bridge,
        url         = getState().extension.url;

    request('post', 'posts', state.session, { url: url, project_id: project_id, translation: translation, comment: comment, lang: lang }, SAVE_POST, dispatch, 'message', 'save_post', function(dispatch, response) {
      dispatch({ type: SAVE_POST, message: 'Thanks, your translation was saved!', view: 'message', session: state.session, previousView: 'save_post' })
    });
  };
}

import { LOGIN_TWITTER, LOGIN_FACEBOOK, GO_BACK, SAVE_POST, ERROR } from '../constants/ActionTypes';
import axios from 'axios';
import util from 'util';
import config from '../config/config.js';

// Request information from the backend, after logged in

var request = function(method, endpoint, session, type, dispatch, view, previousView, callback) {
  var headers = {
    'X-Bridge-Token': session.token,
    'X-Bridge-Uuid': session.id,
    'X-Bridge-Provider': session.provider,
    'X-Bridge-Secret': session.secret
  };
  axios({ method: method, url: config.bridgeApiBase + '/api/' + endpoint, headers: headers })
  .then(function(response) {
    if (!response.data || !response.data.type) {
      dispatch({ type: ERROR, message: 'Something wrong happened! Please try again.', view: 'message', session: session, previousView: previousView })
    }
    else if (response.status != 200 && response.data.type === 'error') {
      dispatch({ type: ERROR, message: response.data.data.message, view: 'message', session: session, previousView: previousView })
    }
    else if (response.status === 200) {
      callback(dispatch, response.data.data);
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
    request('get', 'projects', state.session, SAVE_POST, dispatch, 'save_post', state.view, function(dispatch, data) {
      if (data.length === 0) {
        dispatch({ type: ERROR, message: 'Oops! Looks like you\'re not assigned to a project yet. Please email us hello@speakbridge.io to be assigned to a project.', view: 'message', session: state.session, previousView: state.view, errorType: 'no-project' })
      }
      else {
        dispatch({ type: ERROR, message: 'Submit post', view: 'message', session: state.session, previousView: state.view })
      }
    });
  };
}

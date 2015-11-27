import { LOGIN_TWITTER, LOGIN_FACEBOOK, GO_BACK } from '../constants/ActionTypes';
import axios from 'axios';
import util from 'util';
import config from '../config/config.js';

// React callback

var callback = function(session, type) {
  return { type: type, session: session };
};

// Request auth information from backend

var request = function(provider, type, dispatch) {
  axios.get(config.bridgeApiBase + '/api/users/' + provider + '_info')
  .then(function(response) {
    if (response.data == null) {
      var win = window.open(config.bridgeApiBase + '/api/users/auth/' + provider + '?destination=/close.html', provider);
      var timer = window.setInterval(function() {   
        if (win.closed) {  
          window.clearInterval(timer);
          request(provider, type, dispatch);
        }  
      }, 500);
    }
    else {
      dispatch(callback(response.data, type));
    }
  });
};

export function loginTwitter() {
  return (dispatch, getState) => {
    const { session } = getState();

    if (session != undefined && session.provider === 'twitter') {
      dispatch(callback(session, LOGIN_TWITTER));
    }

    request('twitter', LOGIN_TWITTER, dispatch);
  };
}

export function loginFacebook() {
  return (dispatch, getState) => {
    const { session } = getState();

    if (session != undefined && session.provider === 'facebook') {
      dispatch(callback(session, LOGIN_FACEBOOK));
    }

    request('facebook', LOGIN_FACEBOOK, dispatch);
  };
}

export function goBack() {
  return (dispatch, getState) => {
    dispatch({ type: GO_BACK, view: 'login' });
  };
}

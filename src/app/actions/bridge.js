import { LOGIN_TWITTER, LOGIN_FACEBOOK } from '../constants/ActionTypes';
import axios from 'axios';
import util from 'util';
import config from '../config/config.js';

var login = function(provider) {
  axios.get(config.bridgeApiBase + '/api/users/' + provider + '_info')
  .then(function(response) {
    if (response.data == null) {
      var win = window.open(config.bridgeApiBase + '/api/users/auth/' + provider + '?destination=/close.html', provider);
      var timer = window.setInterval(function() {   
        if (win.closed) {  
          window.clearInterval(timer);
          return login(provider);
        }  
      }, 500);
    }
    else {
      window.alert('Logged in on ' + provider + ' as ' + response.data.name);
      return response.data;
    }
  });
};

export function loginTwitter() {
  var session = login('twitter');
  return { type: LOGIN_TWITTER, session: session };
}

export function loginFacebook() {
  var session = login('facebook');
  return { type: LOGIN_FACEBOOK, session: session };
}

import superagent from 'superagent';
import util from 'util';
import config from './config';

export function loggedIn(callback) {
  superagent.get(config.checkApiUrl + '/api/me').withCredentials().end(function(err, response) {
    let data = null;
    let error = false;
    
    try {
      if (err) {
        if (err.response) {
          const json = JSON.parse(err.response.text);
          error = json.data.message;
        }
        else {
          error = err;
        }
      }
      else {
        const json = JSON.parse(response.text);
        if (response.status === 200) {
          error = false;
          data = json.data;
        }
        else {
          error = json.data.message;
        }
      }
    }
    catch (e) {
      error = util.inspect(e);
    }

    callback(data, error)
  });
}

export function logout(callback, token) {
  fetch(config.checkApiUrl + '/api/users/logout', { headers: { credentials: 'include', 'X-Check-Token': token } }).then(response => { callback(); });
}

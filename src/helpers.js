import superagent from 'superagent';
import util from 'util';
import config from './config';
import { AsyncStorage } from 'react-native';

export function loggedIn(platform, callback) {
  if (platform === 'mobile') {
    readFromStore(platform, 'userToken', (token) => {
      if (token && token != '') {
        callback({ token }, false);
      }
      else {
        callback(null, false);
      }
    });
  }
  else {
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
}

export function logout(callback) {
  fetch(config.checkApiUrl + '/api/users/logout', { headers: { credentials: 'include' } }).then(response => { callback(); });
}

export async function readFromStore(platform, key, callback) {
  let item = null;
  if (platform === 'mobile') {
    item = await AsyncStorage.getItem(key);
    callback(item);
  }
  else {
    chrome.storage.sync.get(key, (data) => {
      callback(data[key]);
    });
  }
}

export async function writeToStore(platform, key, value, callback) {
  let item = null;
  if (platform === 'mobile') {
    await AsyncStorage.setItem(key, value);
    callback();
  }
  else {
    const set = {};
    set[key] = value;
    chrome.storage.sync.set(set, () => {
      callback();
    });
  }
}

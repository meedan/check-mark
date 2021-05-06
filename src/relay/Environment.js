import {
  Environment,
  Network,
  RecordSource,
  Store
} from 'relay-runtime';
import config from '../config';

function createFetchQuery(token, teamSlug, image, filename) {
  return function fetchQuery(
    operation,
    variables,
  ) {

    let body = JSON.stringify({
      query: operation.text,
      variables,
      team: teamSlug
    });
    const headers = {
      'X-Check-Token': token,
      'X-Check-Client': 'browser-extension',
      credentials: 'include'
    };
    if (image) {
      const formData = new FormData();
      formData.append('query', operation.text);
      formData.append('variables', JSON.stringify(variables));
      formData.append('team', teamSlug);
      formData.append('file', { uri: 'file://' + image, name: (filename || 'file.jpg'), type: 'image/jpeg' });
      body = formData;
    }
    else {
      headers['content-type'] = 'application/json';
    }

    return fetch(config.checkApiUrl + '/api/graphql', {
      method: 'POST',
      headers,
      body,
    }).then(response => {
      return response.text();
    }).then(text => {
      let json = {};
      try {
        json = JSON.parse(text);
        if (json.error) {
          return {
            data: null,
            errors: [json]
          };
        }
        return json;
      }
      catch (e) {
        return {
          data: null,
          errors: [{ error: 'Not a JSON: ' + text }]
        };
      }
    }).catch(error => {
      return {
        data: null,
        errors: [{ error: error.message }]
      };
    });
  };
}

export function createEnvironment(token, teamSlug, image, filename) {
  const network = Network.create(createFetchQuery(token, teamSlug, image, filename));
  const source = new RecordSource();
  const store = new Store(source);
  const environment = new Environment({ network, store });
  return environment;
}

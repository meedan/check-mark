import {
  Environment,
  Network,
  RecordSource,
  Store
} from 'relay-runtime';
import config from '../config';

function createFetchQuery(token) {
  return function fetchQuery(
    operation,
    variables,
    cacheConfig,
    uploadables,
  ) {
    return fetch(config.checkApiUrl + '/api/graphql', {
      method: 'POST',
      headers: {
        'X-Check-Token': token,
        'content-type': 'application/json',
        credentials: 'include'
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    }).then(response => {
      return response.json();
    });
  };
}

export function createEnvironment(token) {
  const network = Network.create(createFetchQuery(token));
  const source = new RecordSource();
  const store = new Store(source);
  const environment = new Environment({ network, store });
  return environment;
}

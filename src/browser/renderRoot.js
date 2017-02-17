import React from 'react';
import { render } from 'react-dom';
import Root from 'app/containers/Root';

function renderRoot(chrome, background, url) {
  var state = background.store.getState();
  state.extension.url = url;
  state.extension.runtime = chrome.runtime;
    
  if (state.bridge.view === 'message') {
    state.bridge.view = 'home';
  }

  window.storage = {
    set: function(key, value) {
      var values = {};
      values[key] = value;
      chrome.storage.sync.set(values, function() {});
    },

    get: function(key, callback) {
      chrome.storage.sync.get(key, function(value) {
        callback(value[key]);
      });
    }
  };

  chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
  }, function(selection) {
    state.extension.selection = selection[0];
  });

  render(
    <Root store={background.store} />,
    document.getElementById('root')
  );
}

export default renderRoot;

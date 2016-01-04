import React from 'react';
import { render } from 'react-dom';
import Root from 'app/containers/Root';
import util from 'util';

chrome.runtime.getBackgroundPage( background => {
  chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
    function(tabs) {
      var url = tabs[0].url;
      var state = background.store.getState();
      state.extension.url = url;
      state.extension.runtime = chrome.runtime;

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

      render(
        <Root store={background.store} />,
        document.getElementById('root')
      );
    }
  );
});

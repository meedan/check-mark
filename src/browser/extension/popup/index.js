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

      render(
        <Root store={background.store} />,
        document.getElementById('root')
      );
    }
  );
});

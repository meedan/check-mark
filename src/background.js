import config from './config';
import { loggedIn } from './helpers';

import createMenu from './context';
createMenu();

const checkUrl = config.checkWebUrl;

function onNavigate(details) {
  if (details.firstTime || (details.url && details.url.startsWith(checkUrl))) {
    loggedIn(function(user, error) {
      if (user && user.name && !error) {
        chrome.browserAction.setIcon({path: `${config.appId}19-in.png`});
      }
      else {
        chrome.browserAction.setIcon({path: `${config.appId}19-out.png`});
      }
    });
  }
}

chrome.tabs.onUpdated.addListener(function(_, details) {
  onNavigate(details);
});

if (chrome.runtime && chrome.runtime.onStartup && chrome.runtime.onInstalled) {
  chrome.runtime.onStartup.addListener(function() { onNavigate({ firstTime: true }); });
  chrome.runtime.onInstalled.addListener(function() { onNavigate({ firstTime: true }); });
}

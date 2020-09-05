import createMenu from './context';

createMenu();

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript( {
      code: "window.getSelection().toString();"
    }, function(selection) {
      const text = (selection ? selection[0] : '');
      const data = JSON.stringify({ message: 'toggle', url: tabs[0].url, text });
      chrome.tabs.sendMessage(tabs[0].id, data);
    });
  });
});

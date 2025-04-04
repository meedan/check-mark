import createMenu from './context';

createMenu();

chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) return;

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      // Using a function to get the current selection
      func: () => window.getSelection().toString()
    },
    (results) => {
      let text = '';
      if (results && results[0] && results[0].result) {
        text = results[0].result;
      }
      const data = JSON.stringify({ message: 'toggle', url: tab.url, text });
      chrome.tabs.sendMessage(tab.id, data);
    }
  );
});

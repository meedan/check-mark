let windows = {app: 0, devtools: 0};

const MENU_APP = 'MENU_APP';

function addToMenu(id, title, contexts, onClick) {
  chrome.contextMenus.create({
    id: id,
    title: title,
    contexts: contexts,
    onclick: function(info, tab) {
      onClick(info, tab);
    }
  });
}

function closeIfExist(type) {
  if (windows[type] > 0) {
    chrome.windows.remove(windows[type]);
    windows[type] = chrome.windows.WINDOW_ID_NONE;
  }
}

function popWindow(info) {
  var action = 'open',
      url = 'popup.html',
      type = 'app';

  closeIfExist(type);
  
  let options = {
    type: 'popup',
    left: 100,
    top: 100,
    width: 388,
    height: 400
  };
  
  if (action === 'open') {
    let key, value;
    if (info.linkUrl && info.linkUrl != '') {
      key = 'url';
      value = info.linkUrl;
    }
    else if (info.selectionText && info.selectionText != '') {
      key = 'text';
      value = encodeURIComponent(info.selectionText);
    }
    options.url = chrome.extension.getURL(url) + '?' + key + '=' + value;
    chrome.windows.create(options, (win) => {
      windows[type] = win.id;
    });
  }
}

function createMenu() {
  var config = require('./config');
  var name = config.appName || 'Check';
  addToMenu(MENU_APP, name, ['all'], popWindow);
}

export default createMenu;

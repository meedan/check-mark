/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*global chrome*/

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

function popWindow(info, tab) {
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
  var config = __webpack_require__(2);
  var name = config.appName || 'Check';
  addToMenu(MENU_APP, name, ['all'], popWindow);
}

/* harmony default export */ __webpack_exports__["a"] = (createMenu);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__context__ = __webpack_require__(0);


__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__context__["a" /* default */])();

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


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
const config = {
  appName: 'Check',
  appId: 'check',
  appEmail: 'check@meedan.com',
  appColor: '#2e77fc',
  appDescription: 'Verify breaking news online',
  checkRelayPath: 'https://check-api.checkmedia.org/relay.json',
  checkApiUrl: 'https://check-api.checkmedia.org',
  checkWebUrl: 'https://checkmedia.org'
};
/* harmony default export */ __webpack_exports__["default"] = (config);


/***/ })
/******/ ]);
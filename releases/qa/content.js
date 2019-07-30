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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ({

/***/ 16:
/***/ (function(module, exports) {

chrome.runtime.onMessage.addListener(function(msg, sender) {
  if (msg === 'toggle') {
    toggle();
  }
});

var paddingRight = 0;
var body = null;

function toggle() {
  var id = 'check-mark-sidebar-978976543245342';
  var iframe = document.getElementById(id);
  var width = 500;

  if (!body) {
    body = document.getElementsByTagName('BODY')[0];
    paddingRight = parseInt(window.getComputedStyle(body, null).getPropertyValue('padding-right').replace('px', ''), 10);
  }

  if (iframe) {
    if (iframe.style.display === 'block') {
      iframe.style.display = 'none';
      body.style.paddingRight = paddingRight + 'px';
    }
    else {
      iframe.style.display = 'block';
      body.style.paddingRight = paddingRight + width + 'px';
    }
  }
  else {
    iframe = document.createElement('iframe'); 
    iframe.style.borderLeft = '1px solid #cbcbcb';
    iframe.style.background = '#fff';
    iframe.style.height = '100%';
    iframe.style.width = width + 'px';
    iframe.style.position = 'fixed';
    iframe.style.top = '0px';
    iframe.style.bottom = '0px';
    iframe.style.right = '0px';
    iframe.style.overflowY = 'auto';
    iframe.style.overflowX = 'none';
    iframe.style.zIndex = '9000000000000000000';
    iframe.style.boxShadow = '0 15px 15px #333';
    iframe.style.display = 'block';
    iframe.frameBorder = 'none';
    iframe.id = id;
    iframe.src = chrome.extension.getURL('popup.html');
    document.body.appendChild(iframe);
    body.style.paddingRight = paddingRight + width + 'px';
  }
}
   
function receiveMessage(event) {
  let task = null;
  try {
    task = JSON.parse(event.data).task;
  } catch (e) {
    // Ignore
  }
  if (task) {
    const selectedText = window.getSelection().toString();
    const response = JSON.stringify({ selectedText, task });
    event.source.postMessage(response, event.origin);
  }
}
window.addEventListener('message', receiveMessage, false);


/***/ })

/******/ });
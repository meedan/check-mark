(()=>{"use strict";var e={766:(e,t,o)=>{o.r(t),o.d(t,{default:()=>r});const r={appName:"Check QA",appId:"checkqa",appEmail:"check@meedan.com",appColor:"#2e77fc",appDescription:"Verify breaking news online",checkRelayPath:"https://qa-check-api.checkmedia.org/relay.json",checkApiUrl:"https://qa-check-api.checkmedia.org",checkWebUrl:"https://qa.checkmedia.org"}}},t={};function o(r){var c=t[r];if(void 0!==c)return c.exports;var n=t[r]={exports:{}};return e[r](n,n.exports,o),n.exports}o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{let e={app:0,devtools:0};function t(t){e.app>0&&(chrome.windows.remove(e.app),e.app=chrome.windows.WINDOW_ID_NONE);let o={type:"popup",left:100,top:100,width:388,height:400};{let r,c;t.linkUrl&&""!=t.linkUrl?(r="url",c=t.linkUrl):t.selectionText&&""!=t.selectionText&&(r="text",c=encodeURIComponent(t.selectionText)),o.url=chrome.extension.getURL("popup.html")+"?"+r+"="+c,chrome.windows.create(o,(t=>{e.app=t.id}))}}var r,c,n;r=o(766).appName||"Check",c=["all"],n=t,chrome.contextMenus.create({id:"MENU_APP",title:r,contexts:c,onclick:function(e,t){n(e,t)}}),chrome.browserAction.onClicked.addListener((function(){chrome.tabs.query({active:!0,currentWindow:!0},(function(e){chrome.tabs.executeScript({code:"window.getSelection().toString();"},(function(t){const o=t?t[0]:"",r=JSON.stringify({message:"toggle",url:e[0].url,text:o});chrome.tabs.sendMessage(e[0].id,r)}))}))}))})()})();
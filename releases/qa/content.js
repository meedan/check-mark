(()=>{chrome.runtime.onMessage.addListener((function(o){var r=JSON.parse(o);"toggle"===r.message&&function(o,r){(n=!n)?(window.addEventListener("message",s,!1),window.addEventListener("mouseup",l,!1),window.addEventListener("keyup",d,!1)):(window.removeEventListener("message",s,!1),window.removeEventListener("mouseup",l,!1),window.removeEventListener("keyup",d,!1));var a="check-mark-sidebar-978976543245342",p=document.getElementById(a);if(t||(t=document.getElementsByTagName("BODY")[0],e=parseInt(window.getComputedStyle(t,null).getPropertyValue("padding-right").replace("px",""),10)),p)p.parentNode.removeChild(p),t.style.paddingRight=e+"px",i=null;else{var u="";r?u="?text="+r:o&&(u="?url="+o),(p=document.createElement("iframe")).style.borderLeft="1px solid #cbcbcb",p.style.background="#fff",p.style.height="100%",p.style.width="500px",p.style.position="fixed",p.style.top="0px",p.style.bottom="0px",p.style.right="0px",p.style.overflowY="auto",p.style.overflowX="none",p.style.zIndex="9000000000000000000",p.style.boxShadow="0 15px 15px #333",p.style.display="block",p.frameBorder="none",p.id=a,p.src=chrome.extension.getURL("popup.html")+u,document.body.appendChild(p),t.style.paddingRight=e+500+"px",i=p}}(r.url,r.text)}));var e=0,t=null,n=!1,o=null,i=null;function s(e){var t=null;try{t=JSON.parse(e.data).task}catch(e){}if(null!==t){o=t;var n=window.getSelection().toString();if(""!==n&&t){var i=JSON.stringify({selectedText:n,task:t});e.source.postMessage(i,e.origin)}}}function r(){var e=window.getSelection().toString();if(""!==e&&o&&i){var t=JSON.stringify({selectedText:e,task:o});i.contentWindow.postMessage(t,"*")}}function l(e){r()}function d(e){16===(e.keyCode||e.which)&&r()}})();
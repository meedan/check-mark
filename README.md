# Bridge Client

## Structure

- `src/app`: React cross-browser application.
- `src/browser`: sources for the extension and Chrome app.

## Included

 - [react](https://github.com/facebook/react)
 - [redux](https://github.com/rackt/redux)
 - [react-redux](https://github.com/gaearon/react-redux)
 - [redux-persist](https://github.com/rt2zz/redux-persist)
 - [redux-devtools](https://github.com/gaearon/redux-devtools)
 - [redux-logger](https://github.com/fcomb/redux-logger)
 - [redbox-react](https://github.com/KeywordBrain/redbox-react)
 - [react-chrome-extension-boilerplate](https://github.com/jhen0409/react-chrome-extension-boilerplate)
 - [webpack](https://github.com/webpack/webpack)
 - [react-transform-hmr](https://github.com/gaearon/react-transform-hmr)
 - [react-transform-catch-errors](https://github.com/gaearon/react-transform-catch-errors)
 - [babel](https://github.com/babel/babel)
 - [babel-plugin-react-transform](https://github.com/gaearon/babel-plugin-react-transform)
 - [gulp](https://github.com/gulpjs/gulp)

## Installation

```bash
# required node.js/io.js
# clone it
npm install
```

#### React/Flux hot reload

```bash
# build files to './build/extension'
npm run build:extension
```

In order to test:

* Go to Google Chrome / Chromium
* Type `chrome://extensions`
* Hit "Load unpacked extension..."
* Choose the `build/extension` directory

## Build app

```bash
# build files to './build/app'
npm run build:app
```

## Build firefox extension

```bash
# build files to './build/firefox'
npm run build:firefox
````
Note that it's [not possible for now to load Firefox extensions from local directories](https://bugzilla.mozilla.org/show_bug.cgi?id=1185460), so use `npm run compress:firefox` instead to generate an xpi file.

## Build & Compress ZIP file

```bash
# compress extension's build folder to extension.zip
npm run compress:extension

# compress app's build folder to app.zip
npm run compress:app

# compress firefox extension's build folder to firefox.xpi
npm run compress:firefox
```

## Load

- [Load the extension to Chrome](https://developer.chrome.com/extensions/getstarted#unpacked).
- [Launch your Chrome app](https://developer.chrome.com/apps/first_app#five).
- Firefox: [Prerequisites](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Prerequisites), [Installing](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Packaging_and_installation#Installing_Your_Extension).

## LICENSE

[MIT](LICENSE)

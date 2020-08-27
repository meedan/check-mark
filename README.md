# Check

[![Travis](https://travis-ci.org/meedan/check-mark.svg?branch=develop)](https://travis-ci.org/meedan/check-mark/)

A browser extension for [Check](https://meedan.com/en/check/).

## Browser Extension

### Download

Available for [Mozilla Firefox](https://addons.mozilla.org/firefox/addon/check/) and [Google Chrome](https://chrome.google.com/webstore/detail/check/afafaiilokmpfmkfjjgfenfneoafojie).

### Development

The JavaScript code lives in `src`. Static files like HTML, Manifest and images live in `public`.

Copy `config.js.example` to `config.js` and define your configurations.

You can compile the code with `npm run build`. It was developed and tested with Node 7. After the code is compiled, it will be under `build`. After you installed the extension (see below how to do it), you don't need to re-install it when you make code changes.

#### Running the extension on Google Chrome

* Visit `chrome://extensions`
* Enable "Developer mode"
* Click "Load unpacked extension..."
* Pick one of the directories:
  * `build`, if you are a developer and has compiled the extension locally in your machine
  * `releases/qa`, to use the QA version
  * `releases/live`, to use the live version
* The extension will appear on the toolbar

If you are not able to login using the browser extension on Chrome, make sure that the option "Block third-party cookies", under your browser configurations, is *disabled*. If you use an extension like AdBlock, you first need to disable the extension, then disable the "Block third-party cookies" option.

#### Running the extension on Mozilla Firefox

* Visit `about:debugging`
* Click "Load Temporary Add-on"
* Pick the `manifest.json` file inside one of the following directories:
  * `build`, if you are a developer and has compiled the extension locally in your machine
  * `releases/qa`, to use the QA version
  * `releases/live`, to use the live version
* The extension will appear on the toolbar

#### Localization

As usual, localization is done on [Transifex](https://www.transifex.com/meedan/check-2/browser-extension/). You must have the `tx` client [installed](http://docs.transifex.com/client/setup/) on your computer and [configured](https://docs.transifex.com/client/client-configuration) to communicate with the Transifex server. You can send new strings to Transifex by running `npm run transifex:upload` and you can download translations from Transifex by running `npm run transifex:download`.

#### Testing

* You need `zip`, `rspec`, `geckodriver` and `chromedriver`.
* Copy `test/config.yml.example` to `test/config.yml` and adjust the configurations.
* Tests can be run with `npm run test`.

### Release

- Edit `public/manifest.json` and increment the version number
- Create a new release via `npm run release:live` which will create the package `releases/live/live.zip`
- Submit the package to Chrome Store and Firefox Store for review and publishing

#### Chrome Store

- Some permissions will require justification:
  * `activeTab`: Send the current URL to Check
  * `tabs`: Send any URL to Check
  * `cookies`: Authenticate user on Check
  * `webRequest`: Make requests to Check API
  * `contextMenus`: Invoke the extension from a link on right-click
  * Host Permission: Render Check application inside a sidebar
  * Remote Code:
    - Embed an iframe from our web application at https://checkmedia.org to show input controls for user annotations
    - Refer to external Google fonts

#### Firefox Store

You will be asked to submit the source code of the extension because we're using `webpack` to bundle the code. You can download a zipped version of the `master` branch for this purpose.

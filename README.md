## Check Mark

[![Travis](https://travis-ci.org/meedan/check-mark.svg?branch=develop)](https://travis-ci.org/meedan/check-mark/)

A browser extension for [Check](https://meedan.com/en/check/).

### Development

The JavaScript and SASS codes live in `src`. Static files like HTML, Manifest and images live in `public`.

Copy `config.js.example` to `config.js` and define your configurations.

You can compile the code with `npm run build`. It was developed and tested with Node 7. After the code is compiled, it will be under `build`. After you installed the extension (see below how to do it), you don't need to re-install it when you make code changes.

#### Running the extension in Google Chrome

* Visit `chrome://extensions`
* Enable "Developer mode"
* Click "Load unpacked extension..."
* Pick the `build` directory
* The extension will appear on the toolbar

#### Running the extension in Firefox

* Visit `about:debugging`
* Click "Load Temporary Add-on"
* Pick the `manifest.json` file inside `build` directory
* The extension will appear on the toolbar

#### Localization

As usual, localization is done on [Transifex](https://www.transifex.com/meedan/check-2/browser-extension/). You must have the `tx` client [installed](http://docs.transifex.com/client/setup/) on your computer and [configured](https://docs.transifex.com/client/client-configuration) to communicate with the Transifex server. You can send new strings to Transifex by running `npm run transifex:upload` and you can download translations from Transifex by running `npm run transifex:download`.

#### Releasing new versions

* QA: `npm run release:qa`
* Live: `npm run release:live`

Releases are available under `releases`.

#### Tests

* You need `zip`, `rspec`, `geckodriver` and `chromedriver`.
* Copy `test/config.yml.example` to `test/config.yml` and adjust the configurations.
* Tests can be run with `npm run test`.

## Check Mark

[![Travis](https://travis-ci.org/meedan/check-mark.svg?branch=develop)](https://travis-ci.org/meedan/check-mark/)

A browser extension for [Check](https://meedan.com/en/check/).

### Download

Available for [Mozilla Firefox](https://addons.mozilla.org/firefox/addon/check/) and [Google Chrome](https://chrome.google.com/webstore/detail/check/afafaiilokmpfmkfjjgfenfneoafojie).

### About

Check, developed by Meedan, is a platform for collaborative verification of digital media. The Check project has worked to build online tools to improve the investigative quality of citizen journalism and help limit the rapid spread of rumors and misinformation online. Using Check you can quickly build a team, add social media links to fact-check them, set key questions for investigating news items gathered amongst your team.

Check’s browser extension allows you to quickly add media items that you come across on the internet to your Check team for investigation. Here’s how you can use it:

Browse the internet, and find a Tweet, YouTube video, Facebook post or an Instagram photo that you want your team to fact-check and investigate. Click the Check icon’, choose one of the projects you want to add this item to, and save it.

You can also highlight text from an article, a web page, or an incoming web whatsapp message. Right click, select the Check icon, and choose one of the projects you want to add this text to.

The extension works on Tweetdeck for web and other tools that operate on the browser.

On Check, you can see this item added as media on your team and you can start the verification process right away. Here’s what you can do on Check for fact-checking:

Add journalists and citizen journalists to your team so that they can contribute to the verification process.

Ask questions about media items, like date, time, location and evidence to help deciding if it’s true or fake.

Add a verification status to each media item you have on your team to reflect the result of the fact-checking process like, verified, false or in progress.

If you work in digital media and want to try out Check as a way to streamline and coordinate your social news gathering and verification workflow, please visit https://meedan.com/en/check.

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

First, you need to edit `public/manifest.json` and increment the version number.

* QA: `npm run release:qa`
* Live: `npm run release:live`

Releases are available under `releases`. After that, you need to upload `releases/live/live.zip` and `releases/qa/qa.zip` to Chrome Store and Firefox Store.

#### Tests

* You need `zip`, `rspec`, `geckodriver` and `chromedriver`.
* Copy `test/config.yml.example` to `test/config.yml` and adjust the configurations.
* Tests can be run with `npm run test`.

#### Screenshots

![Screenshot](screenshots/screenshot1.png?raw=true "Screenshot")

![Screenshot](screenshots/screenshot2.png?raw=true "Screenshot")

![Screenshot](screenshots/screenshot3.png?raw=true "Screenshot")

![Screenshot](screenshots/screenshot4.png?raw=true "Screenshot")

![Screenshot](screenshots/screenshot5.png?raw=true "Screenshot")

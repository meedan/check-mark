# Check

[![Travis](https://travis-ci.org/meedan/check-mark.svg?branch=develop)](https://travis-ci.org/meedan/check-mark/)

A browser extension for [Check](https://meedan.com/en/check/).

## Browser Extension
![Extension_Header](/extension_header.png)
### About
Firefox will ask you for permission to read your browsing history. This allows the browser extension to add your current tab to Check when you click on the browser icon. Meedan does not log any other data on our servers.

Check, developed by Meedan, is a platform for collaborative verification of digital media. The Check project builds online tools to improve the investigative quality of citizen journalism and help limit the rapid spread of rumors and misinformation online. Using Check you can quickly build a team, add social media links to fact-check them, set key questions for investigating news items gathered amongst your team.

Check’s browser extension allows you to quickly add media items that you come across on the internet to your Check team for investigation, and answer tasks concerning these items right from within the extension’s sidebar. Here’s how you can use it:

Browse the internet, and find a Tweet, YouTube video, Facebook post or an Instagram photo that you want your team to fact-check and investigate. Click the Check icon, choose one of the projects you want to add this item to, and save it.

The extension also detects if the item already exists in Check, and shows you the relevant tasks to be answered concerning it in the sidebar. Select a task, then highlight text from the page: the text will automatically populate the task answer.

You can also highlight text from an article, a web page, or an incoming WhatsApp Web message. Right click, select the Check icon, and choose one of the projects you want to add this text to.

The extension works on Tweetdeck for web and other tools that operate on the browser.

On Check, you can see this item added as media on your team and you can start the verification process right away. Here’s what you can do on Check for fact-checking:

Add journalists and citizen journalists to your team so that they can contribute to the verification process.

Ask questions about media items, like date, time, location and evidence to help deciding if it’s true or fake.

Add a verification status to each media item you have on your team to reflect the result of the fact-checking process like, verified, false or in progress.



### Download

Available for [Mozilla Firefox](https://addons.mozilla.org/firefox/addon/check/) and [Google Chrome](https://chrome.google.com/webstore/detail/check/pjfgpbclkfjkfiljlcfehjmpafeoafdi).

### Development

The JavaScript code lives in `src`. Static files like HTML, Manifest and images live in `public`.

Copy `config.js.example` to `config.js` and define your configurations.

You can compile the code with `npm run build`. It was developed and tested with Node 7. After the code is compiled, it will be under `build`. After you installed the extension (see below how to do it), you don't need to re-install it when you make code changes.

#### Running the extension on Google Chrome

Follow the steps below or our [video-tutorial](https://www.youtube.com/watch?v=kp90m3jY7HA).

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
  * `contextMenus`: Invoke the extension from a link on right-click

#### Firefox Store

- Nothing special is needed, just upload the ZIP

#Check-Mark#

Browser extension that allows users to use Check without navigating to the Check webapp itself. 

---

To use the extension, users should:

1. Click on a Facebook/Twitter post they want to import into a Check project
2. Open the extension (the post should automatically load into the extension popup)
3. From the popup, users can import the post into one of their verification projects
4. (Maybe) users can also update the status of verification, annotate, add notes, etc

The interface should look similar to the current Meedan Bridge web extension (will confer on this)

![](screenshots/UI.JPG "UI Diagram")

The extension will also include "Share to Check" buttons on social media posts (need to confer on how exactly injection interface will look like)

![](screenshots/UI2.JPG "UI Diagram 2")



---


## Structure

- `src/app`: React cross-browser application.
- `src/browser`: sources for the extension and Chrome app.

## How to build

* Copy `config.json.example` to `config.json` and define your configurations
* `npm install`
* `npm run build:extension`

## How to develop

* The theme files (SASS files) are under `src/app/styles`
* Other development files are under `src/app/`
* In order to reflect your changes, run `npm run build:extension`

## How to use

* Go to Google Chrome / Chromium
* Type `chrome://extensions`
* Hit "Load unpacked extension..."
* Choose the `build/extension` directory
* An icon will be added to your Google Chrome toolbar

## How to release a new version (edge and live)

* Run `npm run release:extension`, which will bump version number and create zip files under `releases/` directory

## How to publish a new version (edge and live)

* Run `npm run publish:extension`, which will upload and publish the items to Chrome Store
* Alternatively, you can upload the zip files to Chrome Webstore (developer's dashboard)

## How to test

* Run `npm run test` (you need `ruby` and `rubygems`, and need a file `test/config.yml`)




## Check Mark

A browser extension for [Check](https://meedan.com/en/check/).

### Development

The JavaScript and SASS codes live in `src`. Static files like HTML, Manifest and images live in `public`.

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
* Pick the `build` directory
* The extension will appear on the toolbar

global.self = global;

import React from 'react';
import ReactDOM from 'react-dom';
import { AppState, AsyncStorage, View, Text, NativeModules, Platform, AppRegistry, Clipboard, Dimensions, Alert } from 'react-native';
import ReactApp from './src/components/App';
import NoInput from './src/components/NoInput';
import { IntlProvider, addLocaleData, FormattedMessage } from 'react-intl';
import ar from 'react-intl/locale-data/ar';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import pt from 'react-intl/locale-data/pt';
import es from 'react-intl/locale-data/es';
import ShareMenu from 'react-native-share-menu';
import util from 'util';

import asyncToGenerator from 'async-to-generator';
babelHelpers.asyncToGenerator = asyncToGenerator;

if (!global.Intl) {
  global.Intl = require('intl');
}

let locale = 'en';
if (Platform.OS === 'android') {
  locale = NativeModules.I18nManager.localeIdentifier;
}
else {
  locale = NativeModules.SettingsManager.settings.AppleLocale;
}
locale = locale.replace(/_.*/, '');

try {
  const localeData = {
    'en': en,
    'fr': fr,
    'ar': ar,
    'pt': pt,
    'es': es,
  };
  addLocaleData([...localeData[locale]]);
} catch (e) {
  locale = 'en';
}

const rtlLanguages = [
  'ar',  /* 'العربية', Arabic */
  'arc', /* Aramaic */
  'bcc', /* 'بلوچی مکرانی', Southern Balochi */
  'bqi', /* 'بختياري', Bakthiari */
  'ckb', /* 'Soranî / کوردی', Sorani */
  'dv',  /* Dhivehi */
  'fa',  /* 'فارسی', Persian */
  'glk', /* 'گیلکی', Gilaki */
  'he',  /* 'עברית', Hebrew */
  'ku',  /* 'Kurdî / كوردی', Kurdish */
  'mzn', /* 'مازِرونی', Mazanderani */
  'pnb', /* 'پنجابی', Western Punjabi */
  'ps',  /* 'پښتو', Pashto, */
  'sd',  /* 'سنڌي', Sindhi */
  'ug',  /* 'Uyghurche / ئۇيغۇرچە', Uyghur */
  'ur',  /* 'اردو', Urdu */
  'yi',  /* 'ייִדיש', Yiddish */
];
const direction = rtlLanguages.indexOf(locale) > -1 ? 'rtl' : 'ltr';

const translations = {
  en: require('./src/localization/en.json'),
  fr: require('./src/localization/fr.json'),
  ar: require('./src/localization/ar.json'),
  pt: require('./src/localization/pt.json'),
  es: require('./src/localization/es.json'),
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharedText: null,
      sharedImage: null,
      clipboard: null,
      appState: AppState.currentState
    };
  }

  componentWillMount() {
    this.getInput();
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.getInput();
    }
    this.setState({ appState: nextAppState });
  }

  getInput() {
    ShareMenu.getSharedText((text) => {
      if (text && text.length && this.state.sharedText != text) {
        const state = { sharedText: text };
        if (/^content:\/\/media\//.test(text)) {
          const RNGRP = require('react-native-get-real-path');
          RNGRP.getRealPathFromURI(text).then((path) => {
            state.sharedImage = path;
            this.setState(state);
          });
        }
        else {
          this.setState(state);
        }
      }
    });

    Clipboard.getString().then((content) => {
      if (this.state.clipboard != content) {
        this.setState({ clipboard: content });
      }
    });
  }

  render() {
    let input = this.state.sharedText;
    if (!input) {
      input = this.state.clipboard;
    }
    let url = null;
    let text = null;
    let image = null;

    if (input) {
      if (/^https?:\/\//.test(input) && !/ /.test(input)) {
        url = input;
      }
      else if (/^content:\/\/media\//.test(input) && !/ /.test(input)) {
        image = this.state.sharedImage;
      }
      else {
        text = input;
      }
    }

    const store = {
      read: async function(key, callback) {
        const item = await AsyncStorage.getItem(key);
        callback(item);
      },

      write: async function(key, value, callback) {
        await AsyncStorage.setItem(key, value);
        callback();
      }
    };

    const windowHeight = Dimensions.get('window').height;

    return (
      <IntlProvider locale={locale} messages={translations[locale]} textComponent={Text}>
        <View style={{ backgroundColor: 'white', height: windowHeight }}>
          { input ? <ReactApp direction={direction} url={url} text={text} image={image} platform="mobile" store={store} /> : <NoInput /> }
        </View>
      </IntlProvider>
    );
  }
}

AppRegistry.registerComponent('checkmark', () => App);

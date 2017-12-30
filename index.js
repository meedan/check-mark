global.self = global;

import React from 'react';
import ReactDOM from 'react-dom';
import { AsyncStorage, View, Text, NativeModules, Platform, AppRegistry, Clipboard } from 'react-native';
import ReactApp from './src/components/App';
import { IntlProvider, addLocaleData, FormattedMessage } from 'react-intl';
import ar from 'react-intl/locale-data/ar';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import pt from 'react-intl/locale-data/pt';
import ShareMenu from 'react-native-share-menu';
import util from 'util';

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
    'pt': pt
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
  pt: require('./src/localization/pt.json')
};

export default class App extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      sharedText: null,
      clipboard: null
    };
  }

  componentWillMount() {
    ShareMenu.getSharedText((text) => {
      if (text && text.length && this.state.sharedText != text) {
        this.setState({ sharedText: text });
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

    if (input) {
      if (/^https?:\/\//.test(input) && !/ /.test(input)) {
        url = input;
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

    return (
      <IntlProvider locale={locale} messages={translations[locale]} textComponent={Text}>
        <View style={{ marginTop: 30 }}>
          { input ? <ReactApp direction={direction} url={url} text={text} platform="mobile" store={store} /> : <Text>Please invoke this application from the share menu of another application, or copy something to the clipboard and open this application again.</Text> }
        </View>
      </IntlProvider>
    );
  }
}

AppRegistry.registerComponent('checkmark', () => App);

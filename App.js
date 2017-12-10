global.self = global;

import React from 'react';
import ReactDOM from 'react-dom';
import { View, Text, NativeModules, Platform } from 'react-native';
import ReactApp from './src/components/App';
import { IntlProvider, addLocaleData } from 'react-intl';
import ar from 'react-intl/locale-data/ar';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import pt from 'react-intl/locale-data/pt';

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
  render() {
    return (
      <IntlProvider locale={locale} messages={translations[locale]} textComponent={Text}>
        <View style={{ marginTop: 30 }}>
          <ReactApp direction={direction} url={null} text={'Testing'} platform="mobile" />
        </View>
      </IntlProvider>
    );
  }
}

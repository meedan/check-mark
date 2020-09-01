import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import ar from 'react-intl/locale-data/ar';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import pt from 'react-intl/locale-data/pt';
import es from 'react-intl/locale-data/es';
import sw from 'react-intl/locale-data/sw';
import fil from 'react-intl/locale-data/fil';
import App from './components/App';

/* global navigator, global, require, window, document */

let locale = navigator.languages || navigator.language || navigator.userLanguage || 'en';
if (locale.constructor === Array) {
  locale = locale[0];
}
locale = locale.replace(/[-_].*$/, '');

if (!global.Intl) {
  require(['intl'], (intl) => {
    global.Intl = intl;
  });
}

try {
  const localeData = {
    'en': en,
    'fr': fr,
    'ar': ar,
    'pt': pt,
    'es': es,
    'sw': sw,
    'fil': fil,
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

const translations = require(`./localization/${locale}.json`);

const urlParam = window.location.search.match(/^\?url=(.*)/);
const url = urlParam ? decodeURI(urlParam[1]) : null;

const textParam = window.location.search.match(/^\?text=(.*)/);
const text = textParam ? decodeURIComponent(decodeURI(textParam[1])) : '';

ReactDOM.render(
  <IntlProvider locale={locale} messages={translations}>
    { (text || url) ? <App direction={direction} url={url} text={text} /> : null }
  </IntlProvider>,
  document.getElementById('root')
);

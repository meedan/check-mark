import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import App from './components/App';
import colors from './components/colors';

let locale =
  navigator.languages || navigator.language || navigator.userLanguage || 'en';
if (locale.constructor === Array) {
  locale = locale[0];
}
locale = locale.replace(/[-_].*$/, '');

const locales = ['en', 'fr', 'ar', 'pt', 'es', 'sw', 'fil'];
if (locales.indexOf(locale) === -1) {
  locale = 'en';
}

const rtlLanguages = [
  'ar' /* 'العربية', Arabic */,
  'arc' /* Aramaic */,
  'bcc' /* 'بلوچی مکرانی', Southern Balochi */,
  'bqi' /* 'بختياري', Bakthiari */,
  'ckb' /* 'Soranî / کوردی', Sorani */,
  'dv' /* Dhivehi */,
  'fa' /* 'فارسی', Persian */,
  'glk' /* 'گیلکی', Gilaki */,
  'he' /* 'עברית', Hebrew */,
  'ku' /* 'Kurdî / كوردی', Kurdish */,
  'mzn' /* 'مازِرونی', Mazanderani */,
  'pnb' /* 'پنجابی', Western Punjabi */,
  'ps' /* 'پښتو', Pashto, */,
  'sd' /* 'سنڌي', Sindhi */,
  'ug' /* 'Uyghurche / ئۇيغۇرچە', Uyghur */,
  'ur' /* 'اردو', Urdu */,
  'yi' /* 'ייִדיש', Yiddish */,
];
const direction = rtlLanguages.indexOf(locale) > -1 ? 'rtl' : 'ltr';

const translations = require(`./localization/${locale}.json`);

const urlParam = window.location.search.match(/^\?url=(.*)/);
const url = urlParam ? decodeURI(urlParam[1]) : null;

const textParam = window.location.search.match(/^\?text=(.*)/);
const text = textParam ? decodeURIComponent(decodeURI(textParam[1])) : '';

const MuiTheme = {
  palette: {
    type: 'light',
    primary: {
      main: colors.blue,
    },
  },
};

const muiTheme = createMuiTheme({ direction, ...MuiTheme });

ReactDOM.render(
  <MuiThemeProvider theme={muiTheme}>
    <IntlProvider locale={locale} messages={translations}>
      {text || url ? <App direction={direction} url={url} text={text} /> : null}
    </IntlProvider>
  </MuiThemeProvider>,
  document.getElementById('root'),
);

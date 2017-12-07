global.self = global;

import React from 'react';
import ReactDOM from 'react-dom';
import { View, Text } from 'react-native';
import ReactApp from './src/components/App';
import { IntlProvider } from 'react-intl';

if (!global.Intl) {
  global.Intl = require('intl');
}

export default class App extends React.Component {
  render() {
    const locale = 'en';
    return (
      <IntlProvider locale={locale} messages={{}} textComponent={Text}>
        <View style={{ marginTop: 30 }}>
          <ReactApp direction={'ltr'} url={null} text={'Testing'} platform="mobile" />
        </View>
      </IntlProvider>
    );
  }
}

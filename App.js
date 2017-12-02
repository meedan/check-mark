global.self = global;

import React from 'react';
import ReactDOM from 'react-dom';
import { View } from 'react-native';
import ReactApp from './src/components/App';

export default class App extends React.Component {
  render() {
    return (
      <View>
        <ReactApp direction={'ltr'} url={null} text={'Testing'} />
      </View>
    );
  }
}

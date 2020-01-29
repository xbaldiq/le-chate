/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Router from './src/router';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Root } from 'native-base';

import firebase from '@react-native-firebase/app';

// TODO(you): import any additional firebase services that you require for your app, e.g for auth:
//    1) install the npm package: `yarn add @react-native-firebase/auth@alpha` - you do not need to
//       run linking commands - this happens automatically at build time now
//    2) rebuild your app via `yarn run run:android` or `yarn run run:ios`
//    3) import the package here in your JavaScript code: `import '@react-native-firebase/auth';`
//    4) The Firebase Auth service is now available to use here: `firebase.auth().currentUser`

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu'
});

const firebaseCredentials = Platform.select({
  ios: 'https://invertase.link/firebase-ios',
  android: 'https://invertase.link/firebase-android'
});

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#8333e9',
    accent: '#ff7fae',
    surface: '#fff',
    background: '#fff'
    // primary: '#482637',
    // accent: '#7d2941',
    // surface : '#fff',
    // background : '#B3A2A2'
    // background : '#E9E3E3'
  }
};

export default class App extends Component {
  render() {
    return (
      <>
        <PaperProvider theme={theme}>
          <Root>
            <Router />
          </Root>
        </PaperProvider>
      </>
    );
  }
}

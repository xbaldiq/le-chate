import React, { Component } from 'react';
import { View } from 'react-native-animatable';
import { ActivityIndicator, Colors } from 'react-native-paper';
import auth, { firebase } from '@react-native-firebase/auth';

export default class Loading extends Component {
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) this.props.navigation.navigate('Map');
      else this.props.navigation.navigate('Login');
    });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color={Colors.red800} />
      </View>
    );
  }
}

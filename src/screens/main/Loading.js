import React, { Component } from 'react';
import { View } from 'react-native-animatable';
import { ActivityIndicator, Colors } from 'react-native-paper';
// import { Database, Auth } from '../../configs/firebase';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from '@react-native-community/google-signin';

export default class Loading extends Component {
  componentDidMount = async () => {
    // First Open App
    // Auth.onAuthStateChanged(async user => {

    // const isSignedIn = await GoogleSignin.isSignedIn();
    // if (isSignedIn) {
    //   this.props.navigation.navigate('AppStack');
    // } else {
    //   this.props.navigation.navigate('AuthStack');
    // }

    // console.log('isSignedIn', isSignedIn)

    auth().onAuthStateChanged(async user => {
      console.log('onAuthStateChanged');
      if ((await AsyncStorage.getItem('isLogged')) === 'true') {
        this.props.navigation.navigate('AppStack');
      } else {
        this.props.navigation.navigate('AuthStack');
      }
    });

    //   console.log('authChange')
    //   // console.log(this.state.isLogged)

    //   await AsyncStorage.getItem('isLogged')
    //   if (!user && this.state.isLogged) {

    //     console.log('logged out')
    //     await Database.ref('/users/' + await AsyncStorage.getItem('id')).update({
    //       isLogged: false
    //     });
    //     await AsyncStorage.clear().then(() => {
    //       showToast('Signed Out', `success`);
    //     });

    //     this.setState({ id: '' });
    //     Geolocation.clearWatch(this.watchID);

    //     this.props.navigation.navigate('Login');

    //   } else if (!user) {

    //     console.log('please login')
    //     this.props.navigation.navigate('Login');

    //   }
    // });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color='#8333e9' />
      </View>
    );
  }
}

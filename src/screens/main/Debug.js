import React, { Component } from 'react';
import { Text } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
// import auth, { firebase } from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
import { Database, Auth } from '../../configs/firebase';

class Debug extends Component {
  componentDidMount = () => {
    // const user = auth().currentUser;

    Auth.signOut()
      .then(async res => {
        // Sign-out successful.

        this.setState(
          { id: await AsyncStorage.getItem('id') },
        );
        await AsyncStorage.clear().then(() => {
          Alert.alert('sign out');
          // props.navigation.navigate('Login');
        });
        // Alert.alert('sign out')
        // console.log(res)
      })
      .catch(error => {
        // An error happened
      });
  };

  render() {
    return <Text>ini debug</Text>;
  }
}
export default withNavigationFocus(Debug);

import React, { Component } from 'react';
import { Text } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { ActivityIndicator, Colors } from 'react-native-paper';
// import auth, { firebase } from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
import { Database, Auth } from '../../configs/firebase';
import { showToast } from '../components/toast';

class Debug extends Component {
  state = {
    id: ''
  };

  componentDidMount = () => {
    // const user = auth().currentUser;

    console.log('clicked logout')
    // Auth.signOut()
    //   .then(async res => {
        
    //     // Sign-out successful.

    //     // this.setState({ id: await AsyncStorage.getItem('id') }, async () => {
    //     //   console.log('logout: ',this.state.id);

    //     //   await Database.ref('/users/' + this.state.id).update({
    //     //     isLogged: false
    //     //   });
    //     //   await AsyncStorage.clear().then(() => {
    //     //     showToast('Signed Out', `success`);
    //     //   });
    //     // });
    //   })
    //   .catch(error => {
    //     // An error happened
    //   });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color='#8333e9' />
      </View>
    );
  }
}
export default withNavigationFocus(Debug);

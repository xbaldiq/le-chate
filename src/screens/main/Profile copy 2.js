import React, { Component } from 'react';
import { RNCamera, FaceDetector } from 'react-native-camera';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Button,
  StyleSheet,
  Dimensions
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { PermissionsAndroid } from 'react-native';
import ImagePicker from 'react-native-image-picker';
// import { DB, Auth } from '../../configs/firebase';
import auth, { firebase } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

class Profile extends Component {
  componentDidMount = async () => {
    const user = auth().currentUser;
    database().ref('users/').orderByChild('email').equalTo('r13.aero@yahoo.co.id').once('value', async snapshot => {

        const result = snapshot.val()
        let user = Object.values(result);

        console.log(user[0].name)
        console.log(user[0].email)
        console.log(user[0].address)

        // console.log(result.uid.name)
        // console.log(result.name)
        // console.log((await).name)
        // console.log(result.address)

    })


    // name = user.displayName;
    // email = user.email;
    // photoUrl = user.photoURL;
    // emailVerified = user.emailVerified;
    // uid = user.uid;

    // const ref = database().ref(`/users/${uid}`);
    // const currentUsername =  ( await ref.once('value')).val()
    // console.log(currentUsername)

    // const ref = database().ref('/users/')
    // const data = ( await ref.once('value')).val()

    // console.log(Object.keys(data))

    // const snapshot = await (await database().ref(`/users/${uid}`).once('value')).val();

    // await ref.set({
    //     uid,
    //     name: 'Joe Cuk',
    //     role: 'admin',
    //   });

    // console.log('User data: ', snapshot);
    // console.log('User data: ', snapshot.val());
    // console.log(uid)
    // console.log('Profile');
    // console.log('User data: ', snapshot.val());
    // console.log(uid)
    // console.log('uid',uid)

    // const ref = database().ref(`/users/${uid}`);
 
    // await ref.set({
    //   uid,
    //   name: 'Joe Bloggs',
    //   role: 'admin',
    // });
  }

  state = {};

  render() {
    return (
      <>
        <Text>Testing Profile</Text>
      </>
    );
  }
}

const styles = StyleSheet.create({
  body: {}
});

export default withNavigationFocus(Profile);

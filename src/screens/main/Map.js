import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid
} from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

class Map extends Component {
  state = {
    myLocation: ''
  };

  componentDidMount = async () => {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) this.props.navigation.navigate('Login');
    });

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'ReactNativeCode Location Permission',
        message: 'ReactNativeCode App needs access to your location '
      }
    );

    if (granted) {
      Geolocation.getCurrentPosition(
        position => {
          // console.log(JSON.stringify(position));
          console.log(position);
          this.setState({ myLocation: JSON.stringify(position) });
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  render() {
    return (
      <>
        <View style={{flex:1}}>
          <MapView
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            style={{ width: '100%', height: '100%' }}
          />
          <Text>{`Location: ${this.state.myLocation}`}</Text>
        </View>
      </>
    );
  }
}

export default Map;

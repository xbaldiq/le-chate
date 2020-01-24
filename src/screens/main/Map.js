import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid
} from 'react-native';
// import auth, { firebase } from '@react-native-firebase/auth';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigationFocus } from 'react-navigation';
import { Database, Auth } from '../../configs/firebase';

class Map extends Component {
  state = {
    myLocation: '',
    latitude: -7.7584646,
    longitude: 110.3782009
  };

  componentDidMount = async () => {
    const user = Auth.currentUser;
    console.log('map', user.uid);

    Auth.onAuthStateChanged(user => {
      if (!user) this.props.navigation.navigate('Login');
    });

    this.accessMap();

    let changeData = Database.ref('users/' + user.uid);
    changeData.on('value', () => {
      // updateStarCount(postElement, snapshot.val());
      console.log('updated');
    });

    // console.log('name',await AsyncStorage.getItem('name'))
    // console.log('address',await AsyncStorage.getItem('address'))
  };

  accessMap = async () => {
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
          console.log('currentPos', position);
          this.setState({ latitude: position.coords.latitude });
          this.setState({ longitude: position.coords.longitude });
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
        <View style={{ flex: 1 }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            style={{ width: '100%', height: '100%' }}
          >
            <Marker
              coordinate={{
                latitude: this.state.latitude,
                longitude: this.state.longitude
              }}
              title='Lokasi saya'
              description={`${this.state.latitude} ${this.state.longitude}`}
            />
          </MapView>
          <Text>{`Location: ${this.state.myLocation}`}</Text>
        </View>
      </>
    );
  }
}

export default withNavigationFocus(Map);

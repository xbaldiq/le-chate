import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Image
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
    longitude: 110.3782009,
    friendList: [],
    filteredFriendList: [],
    id: 0
  };

  componentDidMount = async () => {
    Auth.onAuthStateChanged(user => {
      if (!user) this.props.navigation.navigate('Login');
    });

    this.setState({ id: await AsyncStorage.getItem('id') }, () => {
      this.grantMapAccess();
      let changeData = Database.ref('users/');

      changeData.on('value', () => {
        this.getFriendLocation();
        console.log('Database updated');
      });
    });
  };

  grantMapAccess = async () => {
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

  getFriendLocation = async () => {
    console.log('getFriendLocation');
    await Database.ref('users/')
      // .orderByChild('email')
      // .equalTo(this.state.email)
      .once('value', async snapshot => {
        const result = snapshot.val();
        // console.log('result',result)
        let friendList = Object.values(result);

        let filteredFriendList = friendList.filter(user => {
          return user.id != this.state.id;
        });

        this.setState({ filteredFriendList }, () => {
          // console.log('friend',this.state.filteredFriendList)
          this.state.filteredFriendList.forEach(user => {
            console.log('user', user);
            // console.log('lat: ', user.name);
          });
        });
      });
  };

  render() {
    return (
      <>
        <View style={{ flex: 1 }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            showsMyLocationButton={true}
            showsIndoorLevelPicker={true}
            showsUserLocation={true}
            zoomControlEnabled={true}
            initialRegion={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            style={{ width: '100%', height: '100%' }}
          >
            {/* <Marker
              coordinate={{
                latitude: this.state.latitude,
                longitude: this.state.longitude
              }}
              title='Lokasi saya'
              description={`${this.state.latitude} ${this.state.longitude}`}
            /> */}
            {this.state.filteredFriendList.map((user, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: user.latitude,
                    longitude: user.longitude
                  }}
                  title={user.name}
                  description={user.bio}
                >
                  <View style={{alignItems: 'center'}}>
                    <Image
                      source={{
                        uri: user.photo
                      }}
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: '#7D2941'
                      }}
                    ></Image>
                    <Image
                      source={require('../../assets/drop-down-arrow.png')}
                      style={{
                        marginTop: -2,
                        height: 20,
                        width: 20,
                        borderRadius: 50,
                        // borderWidth: 1,
                        opacity: 0.5,
                        borderColor: '#7D2941'
                      }}
                    ></Image>
                  </View>
                </Marker>
              );
            })}
          </MapView>
        </View>
      </>
    );
  }
}

export default withNavigationFocus(Map);

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Image
} from 'react-native';
import { Modal, Portal, Button, Provider } from 'react-native-paper';
// import auth, { firebase } from '@react-native-firebase/auth';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigationFocus } from 'react-navigation';
import { Database, Auth } from '../../configs/firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

class Map extends Component {
  state = {
    myLocation: '',
    latitude: -7.7584646,
    longitude: 110.3782009,
    friendList: [],
    filteredFriendList: [],
    id: 0,
    name: '',
    email: '',
    bio: '',
    visible: false
  };
  
  watchID = null;
  componentDidMount = async () => {
    Auth.onAuthStateChanged(async user => {
      if (!user) {
        this.props.navigation.navigate('Login');
        await Database.ref('/users/' + this.state.id)
          // .child('isLogged')
          .update({ isLogged: false });

          
          Geolocation.clearWatch(this.watchID)

        // Database.ref('users/'+this.)
      }
    });

    this.setState({ id: await AsyncStorage.getItem('id') }, async () => {
      this.setState({ name: await AsyncStorage.getItem('name') });
      this.setState({ email: await AsyncStorage.getItem('email') });
      this.setState({ bio: await AsyncStorage.getItem('bio') });
      this.setState({ photo: await AsyncStorage.getItem('photo') });

      // Change Login Status
      await Database.ref('users/' + this.state.id)
        // .child('isLogged')
        .update({ isLogged: true });
    });

    // this.setState({ id: await AsyncStorage.getItem('id') }, () => {
    this.grantMapAccess();
    let changeData = Database.ref('users/');
    changeData.on('value', () => {
      this.getFriendLocation();
      console.log('Database updated');
    });
    // }
    // );
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
        async position => {
          console.log('currentPos', position);
          this.setState({ latitude: position.coords.latitude });
          this.setState({ longitude: position.coords.longitude });

          await Database.ref('users/' + this.state.id).update({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }

    this.watchID = Geolocation.watchPosition( async updatedPos => {
      console.log('position loggedin updated')
      await Database.ref('users/' + this.state.id).update({
        latitude: updatedPos.coords.latitude,
        longitude: updatedPos.coords.longitude
      });
    },
    error => {
      console.log(error.code, error.message);
    },
    { enableHighAccuracy: true, distanceFilter:50, interval: 10000 }
    )
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

  _showModal = () => this.setState({ visible: true });
  _hideModal = () => this.setState({ visible: false });

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
              latitude: -7.7584646,
              longitude: 110.3782009,
              latitudeDelta: 0.0622,
              longitudeDelta: 0.0321
            }}
            style={{ width: '100%', height: '100%' }}
          >
            {this.state.filteredFriendList.map((user, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: user.latitude,
                    longitude: user.longitude
                  }}
                  // title={user.name}
                  // description={user.bio}
                  // opacity={0.8}
                  onCalloutPress={() => {
                    this.props.navigation.navigate('Chat', {
                      friendId: user.id,
                      friendPhoto: user.photo,
                      friendIsLogged: user.isLogged,
                      friendName: user.name
                    });
                  }}
                >
                  {/* <CalloutSubview /> */}

                  {user.isLogged ? (
                    // When user online
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        source={{
                          uri: user.photo
                        }}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 50,
                          borderWidth: 2,
                          borderColor: '#006400'
                        }}
                      ></Image>
                      <Octicons
                        style={{ marginTop: -5, opacity: 0.6, }}
                        name='triangle-down'
                        size={24}
                        color='#008000'
                      />
                    </View>
                  ) : (
                    // When user offline
                    <View style={{ alignItems: 'center', }}>
                      <Image
                        source={{
                          uri: user.photo
                        }}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 50,
                          borderWidth: 2,
                          borderColor: '#999'
                        }}
                      ></Image>
                      <Octicons
                        style={{ marginTop: -5, opacity: 0.6, }}
                        name='triangle-down'
                        size={24}
                        color='#000'
                        
                      />
                    </View>
                  )}

                  {/* <Image
                      source={require('../../assets/drop-down-arrow.png')}
                      style={{
                        marginTop: -2,
                        height: 20,
                        width: 20,
                        borderRadius: 50,
                        // borderWidth: 1,
                        opacity: 0.6,
                        borderColor: '#7D2941'
                      }}
                    ></Image> */}

                  <Callout>
                    <View
                      style={{
                        width: 120,
                        alignItems: 'center',
                        borderRadius: 10
                      }}
                    >
                      <Text style={{ fontWeight: 'bold' }}>{user.name}</Text>
                      <Text>{user.bio}</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <Text
                          style={
                            user.isLogged
                              ? {
                                  fontStyle: 'italic',
                                  fontSize: 12,
                                  paddingRight: 10,
                                  color: 'green'
                                }
                              : {
                                  fontStyle: 'italic',
                                  fontSize: 12,
                                  paddingRight: 10,
                                  color: 'grey'
                                }
                          }
                        >
                          {user.isLogged ? `Online` : `Offline`}
                        </Text>
                        <MaterialCommunityIcons
                          name='chat'
                          size={25}
                          color={user.isLogged ? `green` : `grey`}
                        />
                      </View>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>

          <View
            position='absolute'
            style={{
              top: 10,
              left: 10,
              // width: 2 00,
              height: 70,
              // backgroundColor: '#000',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              // opacity: 0.5,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              // elevation:15
            }}
          >
            <View
              // key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
              }}
            >
              <Image
                source={{ uri: this.state.photo }}
                style={{
                  paddingRight: 15,
                  width: 50,
                  height: 50,
                  borderRadius: 170 / 2,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: '#7D2941'
                }}
              ></Image>
              <View>
                <Text
                  style={{
                    paddingLeft: 15,
                    color: '#FFF',
                    textAlign: 'center',
                    paddingBottom: 5
                  }}
                >
                  {this.state.name}
                </Text>
                <View
                  style={{
                    marginLeft: 15,
                    backgroundColor: 'white',
                    borderRadius: 20
                  }}
                >
                  {true ? (
                    <Text
                      style={{
                        fontSize: 10,
                        paddingHorizontal: 5,
                        color: 'green',
                        letterSpacing: 1,
                        textAlign: 'center'
                      }}
                    >
                      Online
                    </Text>
                  ) : (
                    <Text
                      style={{ fontSize: 10, paddingLeft: 15, color: 'red' }}
                    >
                      Offline
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* <Provider>
            <Portal>
              <Modal visible={this.state.visible} onDismiss={this._hideModal}>
                <View
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                  <View
                    style={{
                      flexDirection: 'column',
                      backgroundColor: '#fff',
                      padding: 20,
                      margin: 20,
                      borderRadius: 10,
                      width: '70%',
                      height: '70%',
                      alignItems: 'center',
                      justifyContent: 'space-around'
                    }}
                  >
                    <Text>Iqbaldhia</Text>
                    <Text>Online</Text>
                    <Text>Ini Statusnya</Text>
                    <Text>Location</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                      }}
                    >
                      <Button mode='contained' style={{ margin: 10 }}>
                        Back
                      </Button>
                      <Button mode='contained' style={{ margin: 10 }}>
                        Chat
                      </Button>
                    </View>
                  </View>
                </View>
              </Modal>
              <Button style={{ marginTop: 30 }} onPress={this._showModal}>
                Show
              </Button>
            </Portal>
          </Provider> */}
        </View>
      </>
    );
  }
}

export default withNavigationFocus(Map);

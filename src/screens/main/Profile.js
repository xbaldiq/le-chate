import React, { Component } from 'react';
import { RNCamera, FaceDetector } from 'react-native-camera';
import {
  PermissionsAndroid,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
// import { DB, Auth } from '../../configs/firebase';
// import auth, { firebase } from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
import defaultProfPict from '../../assets/img/alexander-unsplash.jpg';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Database, Auth } from '../../configs/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

class Profile extends Component {
  componentDidMount = async () => {
    this.setState({ id: await AsyncStorage.getItem('id') });
    console.log('profileID', this.state.id);
    this.getProfile();
  };

  getProfile = () => {
    Database.ref('users/' + this.state.id).on('value', snapshot => {
      const result = snapshot.val();

      this.setState({ name: result.name });
      this.setState({ email: result.email });
      this.setState({ bio: result.bio });
      this.setState({ desc: result.desc });
      this.setState({ phone: result.phone });
      this.setState({ address: result.address });
      this.setState({ photo: result.photo });

      AsyncStorage.setItem('email', result.email);
      AsyncStorage.setItem('photo', result.photo);
      AsyncStorage.setItem('name', result.name);
      AsyncStorage.setItem('bio', result.bio);
    });
  };

  state = {
    name: '',
    email: '',
    phone: '',
    bio: '',
    desc: '',
    editable: false
  };

  cancelEdit = async () => {
    this.getProfile();

    this.setState({ editable: !this.state.editable });
  };

  acceptEdit = async () => {
    console.log('id', this.state.id);

    await Database.ref(`/users/${this.state.id}`).update({
      name: this.state.name,
      email: this.state.email,
      bio: this.state.bio,
      desc: this.state.desc,
      phone: this.state.phone,
      address: this.state.address
    });

    this.setState({ editable: !this.state.editable });

    this.getProfile();
  };

  handleLogout = () => {
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
  }

  render() {
    return (
      <>
        <View
          style={{
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
            backgroundColor: '#8333e9',
            borderBottomWidth: 3,
            borderBottomColor: '#FF7FAE',
            justifyContent: 'space-between'
          }}
        >
          <Ionicons
            name='ios-arrow-back'
            style={{ fontSize: 30, color: '#FFF' }}
          ></Ionicons>
          <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>
            Profile
          </Text>
            <MaterialCommunityIcons
              name='square-edit-outline'
              size={30}
              // color={'#fff'}
              color={'transparent'}
            />


          {/* <Ionicons
            name='ios-arrow-back'
            style={{ color: 'transparent' }}
          ></Ionicons> */}
        </View>
        <ScrollView>
          {/* <View style={{ flex: 1, backgroundColor: '#ff7fae' }}> */}
          <View style={{ flex: 1, backgroundColor: '#ffc6bf' }}>
            <View
              style={{
                flex: 1.5,
                height: 250,
                // backgroundColor: '#ffc68f',
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomRightRadius: 50,
                borderBottomLeftRadius: 50
                // borderTopLeftRadius:50,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('UpdateProfilePhoto');
                }}
              >
                <Image
                  source={{ uri: this.state.photo }}
                  style={{
                    width: 170,
                    height: 170,
                    borderRadius: 170 / 2,
                    overflow: 'hidden',
                    borderWidth: 3,
                    borderColor: '#7D2941'
                  }}
                />
              </TouchableOpacity>
              <Text style={{ paddingTop: 10 }}>{this.state.bio}</Text>

              <TouchableOpacity
                  style={{
                    padding: 10,
                    position:'absolute',
                    top: 20,
                    right: 20,
                    // backgroundColor: 'grey',
                    borderWidth:1,
                    borderColor:'grey',
                    borderRadius: 50,
                    backgroundColor: 'white',
                    // shadowOffset: { width: 10, height: 10 },
                    // shadowColor: 'black',
                    // shadowOpacity: 1,
                    elevation: 8
                    // zIndex:999,  
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('UpdateProfilePhoto');
                  }}
                >
                  <MaterialIcons
                    name='add-a-photo'
                    size={20}
                  />
                </TouchableOpacity>

              {this.state.editable === false ? (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    position:'absolute',
                    top: 80,
                    right: 20,
                    // backgroundColor: 'grey',
                    borderWidth:1,
                    borderColor:'grey',
                    borderRadius: 50,
                    backgroundColor: 'white',
                    // shadowOffset: { width: 10, height: 10 },
                    // shadowColor: 'black',
                    // shadowOpacity: 1,
                    elevation: 8
                    // zIndex:999,  
                  }}
                  onPress={() => {
                    this.setState({ editable: !this.state.editable }, () => {
                      console.log(this.state.editable);
                    });
                  }}
                >
                  <MaterialCommunityIcons
                    name='square-edit-outline'
                    size={20}
                  />
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={{marginHorizontal:10, flexDirection:'row', borderRadius:10, width:80, borderWidth:1, borderColor:'black', justifyContent:'center', alignItems:'center', elevation:1}} onPress={this.cancelEdit}>
                    <Text>Cancel</Text>
                    <MaterialCommunityIcons
                      name='cancel'
                      size={24}
                      color={'red'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={{marginHorizontal:10,  flexDirection:'row', borderRadius:10, width:80, borderWidth:1, borderColor:'black', justifyContent:'center', alignItems:'center', elevation:1}} onPress={this.acceptEdit}>
                  <Text>Apply</Text>
                    <MaterialCommunityIcons
                      name='check-circle-outline'
                      size={24}
                      color={'green'}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View
              style={{
                flex: 2,
                // height: 500,
                width: '100%',
                backgroundColor: '#fff',
                // alignItems: 'center',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                padding: 30
              }}
            >
              <TextInput
                label='Name'
                value={this.state.name}
                editable={this.state.editable}
                style={{ backgroundColor: 'white', elevation: 5, overflow:"hidden", borderTopLeftRadius:20, borderTopRightRadius:20 }}
                onChangeText={name => this.setState({ name })}
              />

              <TextInput
                label='Bio'
                value={this.state.bio}
                editable={this.state.editable}
                style={{ backgroundColor: 'white', elevation: 5 }}
                onChangeText={bio => this.setState({ bio })}
              />

              <TextInput
                label='About'
                value={this.state.desc}
                multiline={true}
                editable={this.state.editable}
                style={{ backgroundColor: 'white', elevation: 5 }}
                onChangeText={desc => this.setState({ desc })}
              />

              <TextInput
                label='Address'
                value={this.state.address}
                editable={this.state.editable}
                style={{ backgroundColor: 'white', elevation: 5 }}
                onChangeText={address => this.setState({ address })}
              />

              <TextInput
                label='Phone'
                value={this.state.phone}
                editable={this.state.editable}
                style={{ backgroundColor: 'white', elevation: 5 }}
                onChangeText={phone => this.setState({ phone })}
              />
              <TextInput
                label='Email'
                value={this.state.email}
                editable={false}
                style={{ backgroundColor: 'white', elevation: 5, borderBottomLeftRadius:20, borderBottomRightRadius:20, borderBottomWidth:0 }}
                onChangeText={email => this.setState({ email })}
              />
              <Button
                // icon='camera'
                raised
                mode='contained'
                onPress={this.handleLogout}
                style={{ elevation: 5, marginTop:20 }}
              >
                Logout
              </Button>
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  body: {}
});

export default withNavigationFocus(Profile);

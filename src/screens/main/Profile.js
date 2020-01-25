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
  Button,
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
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Database, Auth } from '../../configs/firebase';

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

  render() {
    return (
      <>
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: '#4B2637' }}>
            <View
              style={{
                flex: 1.5,
                height: 250,
                backgroundColor: '#E9E3E3',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <TouchableOpacity onPress={() => {this.props.navigation.navigate('UpdateProfilePhoto')}}>
                <Image
                  source={{uri:this.state.photo}}
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

              {this.state.editable === false ? (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ editable: !this.state.editable }, () => {
                      console.log(this.state.editable);
                    });
                  }}
                >
                  <MaterialCommunityIcons
                    name='square-edit-outline'
                    size={24}
                  />
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={this.cancelEdit}>
                    <MaterialCommunityIcons
                      name='cancel'
                      size={24}
                      color={'red'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.acceptEdit}>
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
                backgroundColor: '#B3A2A2',
                // alignItems: 'center',
                padding: 30
              }}
            >
              <TextInput
                label='Name'
                value={this.state.name}
                editable={this.state.editable}
                onChangeText={name => this.setState({ name })}
              />

              <TextInput
                label='Bio'
                value={this.state.bio}
                editable={this.state.editable}
                onChangeText={bio => this.setState({ bio })}
              />

              <TextInput
                label='About'
                value={this.state.desc}
                multiline={true}
                editable={this.state.editable}
                onChangeText={desc => this.setState({ desc })}
              />

              <TextInput
                label='Address'
                value={this.state.address}
                editable={this.state.editable}
                onChangeText={address => this.setState({ address })}
              />

              <TextInput
                label='Phone'
                value={this.state.phone}
                editable={this.state.editable}
                onChangeText={phone => this.setState({ phone })}
              />
              <TextInput
                label='Email'
                value={this.state.email}
                editable={false}
                onChangeText={email => this.setState({ email })}
              />
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

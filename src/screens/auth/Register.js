import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Alert, Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { Database, Auth } from '../../configs/firebase';
import { showToast } from '../components/toast';

class Register extends Component {
  state = {
    email: '',
    name: '',
    password: '',
    latitude: -7.79273,
    longitude: 110.365841,
    errorMessage: null
  };

  getLocation = async () => {
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
          console.log(position);
          this.setState({ latitude: position.coords.latitude });
          this.setState({ longitude: position.coords.longitude });
        },
        error => {
          // console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  handleRegister = async () => {
    Auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(response => {
        Database.ref('users/' + response.user.uid).set({
          name: this.state.name,
          email: this.state.email,
          id: response.user.uid,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          bio: 'What you feeling today?',
          desc: `Please tell us about yourself, don't be shy`,
          phone: 'Please input your phone number',
          address: 'Please input your current address',
          photo:
            'https://firebasestorage.googleapis.com/v0/b/lechate-xbaldiq.appspot.com/o/images%2Fnew-user.png?alt=media&token=cb17e9f2-a115-4f67-9574-a62d62ec37db'
        });

        showToast('Register Success', `success`);

        this.props.navigation.navigate('Login');
      })
      .catch(error => {
        Alert(error.message);
        this.setState({ errorMessage: error.message });
      });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            resizeMode='contain'
            style={{ paddingVertical: 30, width: 500, height: 300 }}
            source={require('../../assets/date-app2.jpg')}
          />
          <Text style={{ paddingTop: 10 }}>
            Please fill the form to register
          </Text>
        </View>
        <View
          style={{
            width: '80%',
            backgroundColor: 'white',
            elevation: 5
          }}
        >
          <TextInput
            label='Name'
            value={this.state.name}
            style={{ backgroundColor: 'white' }}
            onChangeText={name => this.setState({ name })}
          />

          <TextInput
            label='Email'
            value={this.state.email}
            style={{ backgroundColor: 'white' }}
            onChangeText={email => this.setState({ email })}
          />

          <TextInput
            label='Password'
            secureTextEntry={true}
            value={this.state.password}
            style={{ backgroundColor: 'white' }}
            onChangeText={password => this.setState({ password })}
          />

          <Button
            raised
            mode='contained'
            onPress={this.handleRegister}
          >
            Register
          </Button>
        </View>
        <View style={{ marginVertical: 20, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Login');
            }}
          >
            <Text>Already have an account? Login here</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Register;
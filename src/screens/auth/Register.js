import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
// import auth, { firebase } from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { Database, Auth } from '../../configs/firebase';

class Register extends Component {
  state = {
    email: '',
    name: '',
    password: '',
    latitude: -7.792730,
    longitude: 110.365841,
    errorMessage: null
  };

  componentDidMount = async () => {
    Auth.onAuthStateChanged(user => {
      if (!user) this.props.navigation.navigate('Login');
    });

    this.getLocation()
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
          console.log(position)
          this.setState({ latitude: position.coords.latitude });
          this.setState({ longitude: position.coords.longitude });

          // console.log(position.coords.longitude)
        },
        error => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  }

  handleRegister = async () => {
    Auth
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(response => {
        Database.ref('users/' + response.user.uid).set({
          name: this.state.name,
          email: this.state.email,
          id: response.user.uid,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          bio: 'Please update',
          desc: 'Please update',
          phone: 'Please update',
          address: 'Please update',
        });

        Alert.alert("Registered:")
        this.props.navigation.navigate('Login');

      })
      .catch(error => {
        Alert(error.message);
        this.setState({ errorMessage: error.message });
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>Ini Register Screen</Text>
        </View>
        <TextInput
          label='Name'
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
        />

        <View style={{ flex: 1 }}>
          <TextInput
            label='Email'
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />

          <TextInput
            label='Password'
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />

          <Button
            // icon='camera'
            raised
            mode='contained'
            onPress={this.handleRegister}
          >
            Register
          </Button>

          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Login');
              }}
            >
              <Text>Already have an account? Login here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Register;

// DIY button
{
  /* <TouchableOpacity onClick>
<View
style={{
  backgroundColor: '#482637',
  height: 50,
  alignItems: 'center',
  justifyContent: 'center'
}}
>
<Text style={{ color: '#FFF' }}>Login</Text>
</View>
</TouchableOpacity> */
}

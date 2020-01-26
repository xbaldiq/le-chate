import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Image
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
// import auth, { firebase } from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
import { Database, Auth } from '../../configs/firebase';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errorMessage: ''
  };

  componentDidMount = () => {
    Auth.onAuthStateChanged(user => {
      if (!user) this.props.navigation.navigate('Login');
    });
  };

  handleLogin = () => {
    console.log('clicked');
    const { email, password } = this.state;
    Auth.signInWithEmailAndPassword(email, password)
      .then(async response => {
        // console.log(response.user.uid)
        // console.log(response.user.email)
        // database().ref('users/').orderByChild('email').equalTo('r13.aero@yahoo.co.id').once('value', async snapshot => {

        await Database.ref('users/')
          .orderByChild('email')
          .equalTo(this.state.email)
          .once('value', async snapshot => {
            const result = snapshot.val();
            let user = Object.values(result);

            AsyncStorage.setItem('id', response.user.uid);
            AsyncStorage.setItem('email', user[0].email);
            AsyncStorage.setItem('name', user[0].name);
            AsyncStorage.setItem('bio', user[0].bio);
            AsyncStorage.setItem('photo', user[0].photo);
          });

        // database().ref('/users/' + response.user.uid)
        this.props.navigation.navigate('AppStack');
      })
      .catch(error => {
        // Alert(error.message)
        console.log(error.message);
        this.setState({ errorMessage: error.message });
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            style={{ paddingVertical: 30, width: 200 }}
            source={require('../../assets/logo-lechate.png')}
          />
          <Text>Please enter your credentials to continue</Text>
        </View>

        <View style={{ flex: 1, width: '100%' }}>
          <TextInput
            label='Email'
            value={this.state.email}
            // backgroundColor=''
            // backgroundColor='black'
            // style={{backgroundColor:'white'}}
            // placeholderTextColor='black'
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
            onPress={this.handleLogin}
            // style={{ backgroundColor: '#ed4c5f' }}
          >
            Login
          </Button>

          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Register');
              }}
            >
              <Text>Your first visit to Le Chate App? Register here</Text>
            </TouchableOpacity>
          </View>

          <View>
            {/* {this.state.errorMessage.includes('invalid-email') && ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT)} */}
            {this.state.errorMessage.includes('invalid-email') && (
              <Text>Invalid Email format</Text>
            )}
            {this.state.errorMessage.includes('user-not-found') && (
              <Text>Email not registered</Text>
            )}
            {this.state.errorMessage.includes('wrong-password') && (
              <Text>Invalid Password</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default Login;

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

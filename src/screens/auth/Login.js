import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { Database, Auth } from '../../configs/firebase';
import { showToast } from '../components/toast';

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

    if (!this.state.email && !this.state.password) {
      showToast('Please input your email and password', `warning`);
    } else if (!this.state.email) {
      showToast('Please input your email', `warning`);
    } else if (!this.state.password) {
      showToast('Please input your password', `warning`);
    } else {
      const { email, password } = this.state;
      Auth.signInWithEmailAndPassword(email, password)
        .then(async response => {
          showToast('Welcome Back', `success`);
          await Database.ref('users/')
            .orderByChild('email')
            .equalTo(this.state.email)
            .once('value', async snapshot => {

              const result = snapshot.val();
              let user = Object.values(result);
              
              AsyncStorage.setItem('name', user[0].name);
              AsyncStorage.setItem('id', response.user.uid);
              AsyncStorage.setItem('email', user[0].email);
              AsyncStorage.setItem('bio', user[0].bio);
              AsyncStorage.setItem('photo', user[0].photo);
              AsyncStorage.setItem('isLogged', 'true');
            });

          this.props.navigation.navigate('AppStack');
        })
        .catch(error => {
          showToast(error.message, `warning`);
          this.setState({ errorMessage: error.message });
        });
    }
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            style={{ paddingTop: 30, width: 200 }}
            source={require('../../assets/logo-lechate.png')}
          />
          <Text style={{ paddingVertical: 30 }}>
            Please enter your credentials to continue
          </Text>
        </View>

        <View
          style={{
            marginBottom: 30,
            width: '80%',
            backgroundColor: 'white',
            elevation: 5
          }}
        >
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

          <Button raised mode='contained' onPress={this.handleLogin}>
            Login
          </Button>

        </View>
        <View style={{ marginVertical: 50, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Register');
            }}
          >
            <Text>Your first visit to Le Chate App? Register here</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Login;
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import auth, { firebase } from '@react-native-firebase/auth';

class Register extends Component {
  state = {
    username: '',
    password: '',
    errorMessage: null
  };

  handleRegister = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.username, this.state.password)
      .then(() => {
        console.log('handleRegisterClicked');
        this.props.navigation.navigate('AppStack');
      })
      .catch(error => {
        Alert(error.message)
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

        <View style={{ flex: 1 }}>
          <TextInput
            label='Username'
            value={this.state.username}
            onChangeText={username => this.setState({ username })}
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

          <View style={{ marginTop:20, alignItems: 'center' }}>
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

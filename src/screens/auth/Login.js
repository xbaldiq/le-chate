import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Alert, ToastAndroid} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import auth, { firebase } from '@react-native-firebase/auth';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errorMessage: ''
  };

  handleLogin = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('AppStack'))
      .catch(error => {
        // Alert(error.message)
        console.log(error.message)
        this.setState({ errorMessage: error.message });
      });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>Ini Login Screen</Text>
        </View>

        <View style={{ flex: 1, width: '100%' }}>
          <TextInput
            label='Username'
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
            onPress={this.handleLogin}
          >
            Login
          </Button>

          {/* <View>
            <TouchableOpacity>
              <Text>
                Register Here!
              </Text>
            </TouchableOpacity>
          </View> */}
          <View style={{ marginTop:20, alignItems: 'center' }}>
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
            {this.state.errorMessage.includes('invalid-email') && <Text>Invalid Email format</Text>}
            {this.state.errorMessage.includes('user-not-found') && <Text>Email not registered</Text>}
            {this.state.errorMessage.includes('wrong-password') && <Text>Invalid Password</Text>}
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

import React, { Component, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
// import { Database, Auth } from '../../configs/firebase';
import { firebase } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import { showToast } from '../components/toast';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from '@react-native-community/google-signin';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    configureSignIn();
    firebase.auth().onAuthStateChanged(user => {
      if (!user) navigation.navigate('Login');
    });
  }, []);

  const configureSignIn = () => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '964688389099-smel41rk7fs39rr9l70okpgkus4msei2.apps.googleusercontent.com'
    });
  };

  const handleLogin = () => {
    if (!email && !password) {
      showToast('Please input your email and password', `warning`);
    } else if (!email) {
      showToast('Please input your email', `warning`);
    } else if (!password) {
      showToast('Please input your password', `warning`);
    } else {
      // const { email, password } = this.state;
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async response => {
          showToast('Welcome Back', `success`);
          await Database.ref('users/')
            .orderByChild('email')
            .equalTo(email)
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

          // this.props.navigation.navigate('AppStack');
          navigation.navigate('AppStack')
        })
        .catch(error => {
          showToast(error.message, `warning`);
          // this.setState({ errorMessage: error.message });
        });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // add any configuration settings here:
      await GoogleSignin.hasPlayServices();
      const resUserInfo = await GoogleSignin.signIn();
      setUserInfo({ resUserInfo });
      // this.setState({ userInfo: userInfo, loggedIn: true });
      // console.log('dafuq')
      console.log('userInfo', resUserInfo);

      const credential = firebase.auth.GoogleAuthProvider.credential(
        resUserInfo.idToken,
        resUserInfo.accessToken
      );

      
      // login with credential
      await firebase
        .auth()
        .signInWithCredential(credential)
        .then(async response => {
          console.log('response', response);
          showToast('Welcome Back', `success`);
          await database()
            .ref('users/' + response.user.uid)
            // .orderByChild('email')
            // .equalTo(response.user.email)
            .once('value', async snapshot => {
              const result = snapshot.val();
              let user = Object.values(result);

              console.log('user:', user);

              AsyncStorage.setItem('name', user[0].name);
              AsyncStorage.setItem('id', response.user.uid);
              AsyncStorage.setItem('email', user[0].email);
              AsyncStorage.setItem('bio', user[0].bio);
              AsyncStorage.setItem('photo', user[0].photo);
              AsyncStorage.setItem('isLogged', 'true');
            });

          navigation.navigate('AppStack')
        })
        .catch(error => {
          showToast(error.message, `warning`);
          // this.setState({ errorMessage: error.message });
          setErrorMessage({ errorMessage });
        });
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
          value={email}
          style={{ backgroundColor: 'white' }}
          // onChangeText={email => this.setState({ email })}
          onChangeText={email => setEmail({ email })}
        />

        <TextInput
          label='Password'
          secureTextEntry={true}
          value={password}
          style={{ backgroundColor: 'white' }}
          // onChangeText={password => this.setState({ password })}
          onChangeText={password => setPassword({ password })}
        />

        <Button raised mode='contained' onPress={handleLogin}>
          Login
        </Button>
      </View>

      <GoogleSigninButton
        style={{ width: '80%', height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleLogin}
        // disabled={this.state.isSigninInProgress}
      />

      <View style={{ marginVertical: 50, alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Register');
          }}
        >
          <Text>Your first visit to Le Chate App? Register here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

// class Login extends Component {
//   state = {
//     email: '',
//     password: '',
//     errorMessage: ''
//   };

//   componentDidMount = () => {
//     this.configureSignIn();
//     firebase.auth().onAuthStateChanged(user => {
//       if (!user) this.props.navigation.navigate('Login');
//     });
//   };

//   configureSignIn = () => {
//     GoogleSignin.configure({
//       scopes: ['https://www.googleapis.com/auth/drive.readonly'],
//       webClientId:
//         '964688389099-smel41rk7fs39rr9l70okpgkus4msei2.apps.googleusercontent.com'
//     });
//   };

//   handleLogin = () => {
//     if (!this.state.email && !this.state.password) {
//       showToast('Please input your email and password', `warning`);
//     } else if (!this.state.email) {
//       showToast('Please input your email', `warning`);
//     } else if (!this.state.password) {
//       showToast('Please input your password', `warning`);
//     } else {
//       const { email, password } = this.state;
//       firebase
//         .auth()
//         .signInWithEmailAndPassword(email, password)
//         .then(async response => {
//           showToast('Welcome Back', `success`);
//           await database()
//             .ref('users/')
//             .orderByChild('email')
//             .equalTo(this.state.email)
//             .once('value', async snapshot => {
//               const result = snapshot.val();
//               let user = Object.values(result);

//               AsyncStorage.setItem('name', user[0].name);
//               AsyncStorage.setItem('id', response.user.uid);
//               AsyncStorage.setItem('email', user[0].email);
//               AsyncStorage.setItem('bio', user[0].bio);
//               AsyncStorage.setItem('photo', user[0].photo);
//               AsyncStorage.setItem('isLogged', 'true');
//             });

//           this.props.navigation.navigate('AppStack');
//         })
//         .catch(error => {
//           showToast(error.message, `warning`);
//           this.setState({ errorMessage: error.message });
//         });
//     }
//   };

//   handleGoogleLogin = async () => {
//     try {
//       // add any configuration settings here:
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       this.setState({ userInfo: userInfo, loggedIn: true });
//       console.log('userInfo', userInfo);
//       // create a new firebase credential with the token
//       const credential = firebase.auth.GoogleAuthProvider.credential(
//         userInfo.idToken,
//         userInfo.accessToken
//       );
//       // login with credential
//       const firebaseUserCredential = await firebase
//         .auth()
//         .signInWithCredential(credential)
//         .then(async response => {
//           console.log('response', response);
//           showToast('Welcome Back', `success`);
//           await database()
//             .ref('users/' + response.user.uid)
//             // .orderByChild('email')
//             // .equalTo(response.user.email)
//             .once('value', async snapshot => {
//               const result = snapshot.val();
//               let user = Object.values(result);

//               console.log('user:', user);

//               AsyncStorage.setItem('name', user[0].name);
//               AsyncStorage.setItem('id', response.user.uid);
//               AsyncStorage.setItem('email', user[0].email);
//               AsyncStorage.setItem('bio', user[0].bio);
//               AsyncStorage.setItem('photo', user[0].photo);
//               AsyncStorage.setItem('isLogged', 'true');
//             });

//           this.props.navigation.navigate('AppStack');
//         })
//         .catch(error => {
//           showToast(error.message, `warning`);
//           this.setState({ errorMessage: error.message });
//         });
//     } catch (error) {
//       console.log(error);
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         // user cancelled the login flow
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         // operation (f.e. sign in) is in progress already
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         // play services not available or outdated
//       } else {
//         // some other error happened
//       }
//     }
//   };

//   render() {
//     return (
//       <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
//         <View
//           style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
//         >
//           <Image
//             style={{ paddingTop: 30, width: 200 }}
//             source={require('../../assets/logo-lechate.png')}
//           />
//           <Text style={{ paddingVertical: 30 }}>
//             Please enter your credentials to continue
//           </Text>
//         </View>

//         <View
//           style={{
//             marginBottom: 30,
//             width: '80%',
//             backgroundColor: 'white',
//             elevation: 5
//           }}
//         >
//           <TextInput
//             label='Email'
//             value={this.state.email}
//             style={{ backgroundColor: 'white' }}
//             onChangeText={email => this.setState({ email })}
//           />

//           <TextInput
//             label='Password'
//             secureTextEntry={true}
//             value={this.state.password}
//             style={{ backgroundColor: 'white' }}
//             onChangeText={password => this.setState({ password })}
//           />

//           <Button raised mode='contained' onPress={this.handleLogin}>
//             Login
//           </Button>
//         </View>

//         <GoogleSigninButton
//           style={{ width: '80%', height: 48 }}
//           size={GoogleSigninButton.Size.Wide}
//           color={GoogleSigninButton.Color.Dark}
//           onPress={this.handleGoogleLogin}
//           disabled={this.state.isSigninInProgress}
//         />

//         <View style={{ marginVertical: 50, alignItems: 'center' }}>
//           <TouchableOpacity
//             onPress={() => {
//               this.props.navigation.navigate('Register');
//             }}
//           >
//             <Text>Your first visit to Le Chate App? Register here</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }
// }

// export default Login;

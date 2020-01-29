import React from 'react';
import { Login, Register, Map, Chat, Debug, ChatList, Profile, Loading, UpdateProfilePhoto  } from '../screens/';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

const AuthStack = createStackNavigator(
  {
    Login,
    Register
  },
  {
    headerMode: 'none',
    initialRouteName: 'Login'
  }
);

const BottomStack = createMaterialBottomTabNavigator(
  {
    Map: {
      screen: Map,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name='map' size={24} color={tintColor} />
        ),
        tabBarLabel: 'Map'
      }
    },

    ChatList: {
      screen: ChatList,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name='chat' size={24} color={tintColor} />
        ),
        tabBarLabel: 'Chat'
      }
    },

    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name='account-box' size={24} color={tintColor} />
        ),
        tabBarLabel: 'Profile'
      }
    },

    // Debug: {
    //   screen: Debug,
    //   navigationOptions: {
    //     tabBarIcon: ({ tintColor }) => (
    //       <Feather name='log-out' size={24} color={tintColor} />
    //     ),
    //     tabBarLabel: 'Debug'
    //   }
    // }
  },
  {
    initialRouteName: 'Map',
    // activeColor: '#FFF',
    // inactiveColor: '#3e2465',
    // inactiveColor: '#EDEDED',
    // barStyle: { backgroundColor: '#482637' }
    barStyle: { backgroundColor: '#8333e9', borderTopWidth:4, borderTopColor:'#ff7fae'},
    headerMode: 'none',
  }
);


const AppStack = createStackNavigator(
  {
    BottomStack,
    Chat
    // UpdateProfilePhoto,
  },
  {
    headerMode: 'none',
    initialRouteName: 'BottomStack'
  }
);
const Router = createSwitchNavigator(
  {
    Loading,
    AppStack,
    AuthStack,
  },
  {
    initialRouteName: 'Loading'
  }
);

export default createAppContainer(Router);

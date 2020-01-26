import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
// import auth, { firebase } from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
import { Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { GiftedChat } from 'react-native-gifted-chat';
import FireChat from '../../configs/FireChat';
import { Database, Auth } from '../../configs/firebase';
import { List } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

class ChatList extends Component {
  state = {
    chattedFriend: [],
    id: ''
  };

  componentDidMount = async () => {
    this.setState({ id: await AsyncStorage.getItem('id') });
    Database.ref('/users/').on('child_added', user => {
      let chatted = user.val();
      // console.log(chatted);
      if (chatted.id != this.state.id) {
        this.setState(prevState => {
          return { chattedFriend: [...prevState.chattedFriend, chatted] };
        });
      }
    });
  };

  render() {
    return (
      <>
        <TouchableOpacity>
          <View
            style={{
              height: 50,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
              backgroundColor: '#8333e9',
              borderBottomWidth: 4,
              borderBottomColor: '#FF7FAE',
              justifyContent: 'space-between'
            }}
          >
            <Ionicons
              name='ios-arrow-back'
              style={{ fontSize: 30, color: '#FFF' }}
            ></Ionicons>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
              Chat List
            </Text>
            <Ionicons
              name='ios-arrow-back'
              style={{ color: 'transparent' }}
            ></Ionicons>
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1, height: '100%', margin: 10, }}>
          {this.state.chattedFriend.map((friend, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  this.props.navigation.navigate('Chat', {
                    friendId: friend.id,
                    friendPhoto: friend.photo,
                    friendIsLogged: friend.isLogged,
                    friendName: friend.name
                  })
                }
              >
                <View
                  // key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 15,
                    borderColor: '#CCCCCC',
                    borderBottomWidth: 1,
                    backgroundColor: '#fff',
                    elevation: 3,
                    borderRadius:10
                  }}
                >
                  <Image
                    source={{ uri: friend.photo }}
                    style={{
                      paddingRight: 15,
                      width: 50,
                      height: 50,
                      borderRadius: 170 / 2,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: '#7D2941'
                    }}
                  />
                  <View>
                    <Text style={{ paddingLeft: 15 }}>{friend.name}</Text>
                    {friend.isLogged ? (
                      <Text
                        style={{
                          fontSize: 10,
                          paddingLeft: 15,
                          color: 'green'
                        }}
                      >
                        Online
                      </Text>
                    ) : (
                      <Text
                        style={{ fontSize: 10, paddingLeft: 15, color: 'red' }}
                      >
                        Offline
                      </Text>
                    )}
                  </View>
                  {/* <Text style={{justifyContent:'flex-start'}} >test</Text> */}
                </View>
              </TouchableOpacity>
            );
            // return <Text>{friend.name}</Text>;
          })}
        </View>
      </>
    );
  }
}

export default withNavigationFocus(ChatList);

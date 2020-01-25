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

class ChatList extends Component {
  state = {
    chattedFriend: [],
    id: ''
  };

  componentDidMount = async () => {
    this.setState({ id: await AsyncStorage.getItem('id') });
    Database.ref('/users/').on('child_added', user => {
      let chatted = user.val();
      console.log(chatted);

      if (chatted.id != this.state.id) {
        this.setState(prevState => {
          return { chattedFriend: [...prevState.chattedFriend, chatted] };
        });
      }
    });
  };

  render() {
    return (
      <View style={{ flex: 1, height: '100%' }}>
        {this.state.chattedFriend.map((friend, index) => {
          return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat', {friendId:friend.id})}>
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  borderColor: '#CCCCCC',
                  borderBottomWidth: 1
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
                  {friend.loggedin ? (
                    <Text
                      style={{ fontSize: 10, paddingLeft: 15, color: 'green' }}
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
              </View>
            </TouchableOpacity>
          );
          // return <Text>{friend.name}</Text>;
        })}
      </View>
    );
  }
}

export default withNavigationFocus(ChatList);

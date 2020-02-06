import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { withNavigationFocus, ScrollView } from 'react-navigation';
// import auth, { firebase } from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { GiftedChat } from 'react-native-gifted-chat';
// import FireChat from '../../configs/FireChat';
// import { Database, Auth } from '../../configs/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

class Chat extends Component {
  state = {
    messages: [],
    id: '',
    name: '',
    friendId: this.props.navigation.getParam('friendId'),
    friendName: this.props.navigation.getParam('friendName'),
    friendPhoto: this.props.navigation.getParam('friendPhoto'),
    friendStatus: this.props.navigation.getParam('friendIsLogged')
  };

  componentDidMount = async () => {
    this.setState({ id: await AsyncStorage.getItem('id') });
    this.setState({ name: await AsyncStorage.getItem('name') });

    // const user = auth().currentUser;

    // this.getFriendProfile()

    console.log('name', this.state.name);
    this.on(message => {
      //   let filteredMsg = message.filter((msg) => {
      //     return msg.name === 'iqbal'
      //   })

      //   const loggedUser = this.state.id;

      if (message.user._id == this.state.id) {
        if (message.user.resp == this.state.friendId) {
          this.setState(previousState => ({
            // messages: GiftedChat.append(previousState.messages, filteredMsg)
            messages: GiftedChat.append(previousState.messages, message)
          }));
        }
      } else if (message.user._id == this.state.friendId) {
        if (message.user.resp == this.state.id) {
          this.setState(previousState => ({
            // messages: GiftedChat.append(previousState.messages, filteredMsg)
            messages: GiftedChat.append(previousState.messages, message)
          }));
        }
      }
    });
  };

  getFriendProfile = () => {
    // let friendID = this.props.navigation.getParam('friendId')
    // console.log('friendID',friendID)
    // Database.ref('users/'+ friendID).on('value'), snapshot => {
    //   let friend = snapshot.val();
    //   console.log(friend.name)
    // }
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

  get ref() {
    return database().ref('messages');

    // return Database.ref('messages/').orderByChild('user/name').equalTo('Si Otong');
  }

  get user() {
    return {
      name: this.state.name,
      _id: this.state.id,
      resp: this.state.friendId
    };
  }

  parse = snapshot => {
    const { timestamp: numberStamp, createdAt, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    // const createdAt = new Date(created_at);;
    const message = {
      _id,
      timestamp,
      createdAt,
      text,
      user
    };
    return message;
  };

  componentWillUnmount() {
    this.off();
  }

  off = () => {
    this.ref.off();
  };

  onSend = async (messages = []) => {
    await this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    console.log(this.state.messages);
  };

  get timestamp() {
    return database().ServerValue.TIMESTAMP;
  }

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: Date.now(),
        createdAt: Date.now()
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  render() {
    return (
      <>
        <TouchableOpacity>
          <View
            style={{
              height: 70,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
              borderBottomWidth: 4,
              borderBottomColor: '#FF7FAE',
              backgroundColor: '#8333e9'
            }}
          >
            <Ionicons
              name='ios-arrow-back'
              style={{ fontSize: 30, color: '#FFF', paddingRight: 15 }}
            ></Ionicons>
            <Image
              source={{ uri: this.state.friendPhoto }}
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
            <View style={{ justifyContent: 'flex-start' }}>
              <Text style={{ paddingLeft: 15, marginBottom: 5, color: '#FFF' }}>
                {this.state.friendName}
              </Text>
              <View
                style={{
                  marginLeft: 15,
                  backgroundColor: 'white',
                  borderRadius: 20
                }}
              >
                {this.state.friendStatus ? (
                  <Text
                    style={{
                      fontSize: 10,
                      color: 'green',
                      textAlign: 'center'
                    }}
                  >
                    Online
                  </Text>
                ) : (
                  <Text
                    style={{ fontSize: 10, color: 'red', textAlign: 'center' }}
                  >
                    Offline
                  </Text>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {/* <View> */}
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
          <GiftedChat
            renderAvatar={null}
            scrollToBottom={true}
            // renderAvatarOnTop={true}
            messages={this.state.messages}
            onSend={this.send}
            user={this.user}
          />
        </View>
        {/* </View> */}
      </>
    );
  }
}

export default withNavigationFocus(Chat);

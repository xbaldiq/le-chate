import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
// import auth, { firebase } from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { GiftedChat } from 'react-native-gifted-chat';
// import FireChat from '../../configs/FireChat';
import { Database, Auth } from '../../configs/firebase';

class Chat extends Component {
  state = {
    messages: [],
    id: '',
    name: '',
    friendId: this.props.navigation.getParam('friendId')
  };

  componentDidMount = async () => {
    this.setState({ id: await AsyncStorage.getItem('id') });
    this.setState({ name: await AsyncStorage.getItem('name') });
    // const user = auth().currentUser;

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

      //   if (message.user._id === this.state.id) {
      //     console.log('true loggedin id');
      //     this.setState(previousState => ({
      //       // messages: GiftedChat.append(previousState.messages, filteredMsg)
      //       messages: GiftedChat.append(previousState.messages, message)
      //     }));
      //   } else if (message.user._id === this.state.friendId) {
      //     console.log('true recipient');
      //     this.setState(previousState => ({
      //       // messages: GiftedChat.append(previousState.messages, filteredMsg)
      //       messages: GiftedChat.append(previousState.messages, message)
      //     }));
      //   }
    });
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

  get ref() {
    return Database.ref('messages');

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
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
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

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        // timestamp: this.timestamp
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  render() {
    return (
      <View style={{ flex: 1, height: '100%' }}>
        <GiftedChat
          messages={this.state.messages}
          // onSend={messages => this.onSend(messages)}
          onSend={this.send}
          user={this.user}
        />
      </View>
    );
  }
}

export default withNavigationFocus(Chat);

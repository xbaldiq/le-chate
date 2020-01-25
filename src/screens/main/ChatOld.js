import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import auth, { firebase } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { GiftedChat } from 'react-native-gifted-chat';
import FireChat from '../../configs/FireChat';

class ChatList extends Component {
  state = {
    messages: [],
    id: '',
    name: ''
  };

  componentDidMount = async () => {
    this.setState({ id: await AsyncStorage.getItem('id') });
    this.setState({ name: await AsyncStorage.getItem('name') });
    // const user = auth().currentUser;

    console.log('name', this.state.name);

    FireChat.shared.on(message => {

      // let filteredMsg = message.filter((msg) => {
      //   return msg.name === 'iqbal'
      // })
      console.log(message)
      this.setState(previousState => ({
        // messages: GiftedChat.append(previousState.messages, filteredMsg)
        messages: GiftedChat.append(previousState.messages, message)
      }));
    });
  };

  componentWillUnmount() {
    FireChat.shared.off();
  }

  get user() {
    return {
      name: this.state.name,
      _id: this.state.id
    };
  }

  onSend = async (messages = []) => {
    await this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    console.log(this.state.messages);
  };

  render() {
    return (
      <View style={{ flex: 1, height: '100%' }}>
        <GiftedChat
          messages={this.state.messages}
          // onSend={messages => this.onSend(messages)}
          onSend={FireChat.shared.send}
          user={this.user}
        />
      </View>
    );
  }
}

export default withNavigationFocus(ChatList);

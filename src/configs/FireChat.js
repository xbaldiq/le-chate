import { Database, Auth } from './firebase';
// import firebase from 'firebase';

class FireChat {
  constructor() {
    // this.init();
    // this.observeAuth();
  }

  // init = () => {
  //   if (!firebase.apps.length) {
  //     firebase.initializeApp({
  //       apiKey: 'AIzaSyDLgW8QG1qO8O5WZLC1U8WaqCr5-CvEVmo',
  //       authDomain: 'chatter-b85d7.firebaseapp.com',
  //       databaseURL: 'https://chatter-b85d7.firebaseio.com',
  //       projectId: 'chatter-b85d7',
  //       storageBucket: '',
  //       messagingSenderId: '861166145757',
  //     });
  //   }
  // };

  // observeAuth = () =>
  //   firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  // onAuthStateChanged = user => {
  //   if (!user) {
  //     try {
  //       firebase.auth().signInAnonymously();
  //     } catch ({ message }) {
  //       alert(message);
  //     }
  //   }
  // };

  get uid() {
    return (Auth.currentUser || {}).uid;
  }

  get ref() {
    return Database.ref('messages');
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

  get timestamp() {
    return Database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        // timestamp: this.timestamp,Z
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  // close the connection to the Backend
  off() {
    this.ref.off();
  }
}

FireChat.shared = new FireChat();
export default FireChat;

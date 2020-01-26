import React, { Component } from 'react';
import { RNCamera, FaceDetector } from 'react-native-camera';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  StyleSheet,
  Dimensions
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { PermissionsAndroid } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions
} from 'react-native/Libraries/NewAppScreen';
import RNFetchBlob from 'react-native-fetch-blob';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'react-native-paper';
import { Database, Auth, Storage } from '../../configs/firebase';

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

class UpdateProfilePhoto extends Component {
  state = {
    filepath: {
      data: '',
      uri: ''
    },
    fileData: '',
    fileUri: '',
    currentPhoto: '',
    isUpdated: false,
    applyChanges: false
  };

  componentDidMount = async () => {
    this.setState({ id: await AsyncStorage.getItem('id') });
    this.setState({ currentPhoto: await AsyncStorage.getItem('photo') }, () =>
      console.log(this.state.currentPhoto)
    );
  };

  chooseImage = () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' }
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;

        let uploadBob = null;

        const source = { uri: response.uri };
        this.uploadImage(source);

        console.log('source', source);

        // Convert Blob
        const imageRef = Storage.ref('images/' + this.state.id);
        // .child('photo');
        fs.readFile(response.path, 'base64')
          .then(data => {
            // return Blob.build(data, {type: `${response.mime};BASE64`});
            return Blob.build(data, { type: `;BASE64` });
          })
          .then(blob => {
            uploadBob = blob;
            return imageRef.put(blob, { contentType: `image/jpeg` });
          })
          .then(() => {
            uploadBob.close();
            return imageRef.getDownloadURL();
          })
          .then(url => {
            // ToastAndroid.show(
            //   'Your cool avatar is being uploaded, its going back to your phone now',
            //   ToastAndroid.LONG,
            // );
            Database.ref('users/' + this.state.id).update({ photo: url });

            Alert.alert('Profile Pict Updated');
            // this.setState({userAvatar: url});
            // AsyncStorage.setItem('user.photo', this.state.userAvatar);
          });

        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
          isUpdated: true
        });
      }
    });
  };

  launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.launchCamera(options, response => {
      console.log('Response = ', response);
      console.log('mime', response.mime);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // Finish take a picture

        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;

        let uploadBob = null;

        const source = { uri: response.uri };
        this.uploadImage(source);

        console.log('source', source);

        // Convert Blob
        const imageRef = Storage.ref('images/' + this.state.id);
        // .child('photo');
        fs.readFile(response.path, 'base64')
          .then(data => {
            // return Blob.build(data, {type: `${response.mime};BASE64`});
            return Blob.build(data, { type: `;BASE64` });
          })
          .then(blob => {
            uploadBob = blob;
            return imageRef.put(blob, { contentType: `image/jpeg` });
          })
          .then(() => {
            uploadBob.close();
            return imageRef.getDownloadURL();
          })
          .then(url => {
            // ToastAndroid.show(
            //   'Your cool avatar is being uploaded, its going back to your phone now',
            //   ToastAndroid.LONG,
            // );
            Database.ref('users/' + this.state.id).update({ photo: url });

            Alert.alert('Profile Pict Updated');
            // this.setState({userAvatar: url});
            // AsyncStorage.setItem('user.photo', this.state.userAvatar);
          });

        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
          isUpdated: true
        });
      }
    });
  };

  uploadImage = (uri, mime = 'application/octet-stream') => {
    return dispatch => {
      return new Promise((resolve, reject) => {});
    };
  };

  launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // Finish take a picture

        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;

        let uploadBob = null;

        const source = { uri: response.uri };
        this.uploadImage(source);

        console.log('source', source);

        // Convert Blob
        const imageRef = Storage.ref('images/' + this.state.id);
        // .child('photo');
        fs.readFile(response.path, 'base64')
          .then(data => {
            // return Blob.build(data, {type: `${response.mime};BASE64`});
            return Blob.build(data, { type: `;BASE64` });
          })
          .then(blob => {
            uploadBob = blob;
            return imageRef.put(blob, { contentType: `image/jpeg` });
          })
          .then(() => {
            uploadBob.close();
            return imageRef.getDownloadURL();
          })
          .then(url => {
            // ToastAndroid.show(
            //   'Your cool avatar is being uploaded, its going back to your phone now',
            //   ToastAndroid.LONG,
            // );
            Database.ref('users/' + this.state.id).update({ photo: url });

            Alert.alert('Profile Pict Updated');
            // this.setState({userAvatar: url});
            // AsyncStorage.setItem('user.photo', this.state.userAvatar);
          });

        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
          isUpdated: true
        });
      }
    });
  };

  renderFileData() {
    if (this.state.fileData) {
      return (
        <Image
          source={{ uri: 'data:image/jpeg;base64,' + this.state.fileData }}
          style={styles.images}
        />
      );
    } else if (this.state.currentPhoto) {
      return (
        <Image
          source={{ uri: this.state.currentPhoto }}
          style={styles.images}
        />
      );
    } else {
      return (
        <Image source={require('../../img/dummy.png')} style={styles.images} />
      );
    }
  }

  renderFileUri() {
    if (this.state.fileUri) {
      return (
        <Image source={{ uri: this.state.fileUri }} style={styles.images} />
      );
    } else {
      return (
        <Image
          source={require('../../img/galeryImages.jpg')}
          style={styles.images}
        />
      );
    }
  }

  render() {
    return (
      <>
        <View style={styles.body}>
          <Text
            style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }}
          >
            Choose Image Source
          </Text>
          <View style={styles.ImageSections}>
            <View>
              {this.renderFileData()}
              <Text style={{ textAlign: 'center' }}>Profile Picture</Text>
            </View>
            {/* <View>
              {this.renderFileUri()}
              <Text style={{ textAlign: 'center' }}>File Uri</Text>
            </View> */}
          </View>

          <View style={styles.btnParentSection}>
            {/* <TouchableOpacity
              onPress={this.chooseImage}
              style={styles.btnSection}
            >
              <Text style={styles.btnText}>Choose File</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={this.launchCamera}
              style={styles.btnSection}
            >
              <Text style={styles.btnText}>Directly Launch Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.launchImageLibrary}
              style={styles.btnSection}
            >
              <Text style={styles.btnText}>Directly Launch Image Library</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter
  },

  body: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('screen').height - 20,
    width: Dimensions.get('screen').width
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center'
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3
  },
  btnParentSection: {
    alignItems: 'center',
    marginTop: 10
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: '#8333e9',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginBottom: 10
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default withNavigationFocus(UpdateProfilePhoto);

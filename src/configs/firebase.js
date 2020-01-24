import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAL8sv_pwm-Mlq8VKuJbJD03YlxlnQhyqQ",
    authDomain: "lechate-xbaldiq.firebaseapp.com",
    databaseURL: "https://lechate-xbaldiq.firebaseio.com",
    projectId: "lechate-xbaldiq",
    storageBucket: "lechate-xbaldiq.appspot.com",
    messagingSenderId: "964688389099",
    appId: "1:964688389099:web:d5693408fb87c6e40eefae"
};

if (!firebase.apps.length) {
    var app = firebase.initializeApp(firebaseConfig);
}

export const Database = app.database();
export const Auth = app.auth();

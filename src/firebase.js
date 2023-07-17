import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBYZRYBZv3SqI3iLexbRbKHp64ll0rBpfk",
  authDomain: "netflix-clone-308f4.firebaseapp.com",
  projectId: "netflix-clone-308f4",
  storageBucket: "netflix-clone-308f4.appspot.com",
  messagingSenderId: "418397188605",
  appId: "1:418397188605:web:7cea754511aab64f256994",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth };
export default db;

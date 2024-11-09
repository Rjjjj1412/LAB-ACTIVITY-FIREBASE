import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDJO8b4b7AMYYffScfsj5By6KnigyYHP98",
  authDomain: "my-react-app-firebase-f9ba9.firebaseapp.com",
  projectId: "my-react-app-firebase-f9ba9",
  storageBucket: "my-react-app-firebase-f9ba9.firebasestorage.app",
  messagingSenderId: "355192121459",
  appId: "1:355192121459:web:68a69dc98e4a52ca8f2206"
};

  initializeApp(firebaseConfig);

  const db = getFirestore();

  export {db}
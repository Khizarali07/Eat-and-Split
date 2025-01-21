import {initializeApp} from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDiFVQ9mfmrDWPSTtspqyZrPrumPn6oCv0',
  authDomain: 'priceoye-66ee0.firebaseapp.com',
  projectId: 'priceoye-66ee0',
  storageBucket: 'priceoye-66ee0.firebasestorage.app',
  messagingSenderId: '429937219163',
  appId: '1:429937219163:web:7c19a173e1485c7a90d17e',
  measurementId: 'G-5P1WE6LV5Q',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;

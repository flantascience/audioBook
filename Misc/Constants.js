import { Platform } from 'react-native'
const OS = Platform.OS;
export const firebaseConfig = {
    apiKey: OS === 'android' ? process.env.FIREBASE_ANDROID_API_KEY : process.env.FIREBASE_IOS_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_SENDER_MESSAGING_ID,
    appId: OS === 'android'? process.env.FIREBASE_ANDROID_APP_ID : process.env.FIREBASE_IOS_APP_ID
};
export const SLOW_CONNECTION_TIMER = 5000;
export const TOAST_TIMEOUT = 1500;
export const NEXT_TRACK_TIMEOUT = 500;
export const POST_SEEK_TIMEOUT = 100;
export const emailregex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

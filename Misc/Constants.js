import { Platform } from 'react-native';
import {
    FIREBASE_ANDROID_API_KEY,
    FIREBASE_ANDROID_APP_ID,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL,
    FIREBASE_IOS_API_KEY,
    FIREBASE_IOS_APP_ID,
    FIREBASE_PROJECT_ID,
    FIREBASE_SENDER_MESSAGING_ID,
    FIREBASE_STORAGE_BUCKET
} from 'react-native-dotenv';
const OS = Platform.OS;

export const firebaseConfig = {
    apiKey: OS === 'android' ? FIREBASE_ANDROID_API_KEY : FIREBASE_IOS_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_SENDER_MESSAGING_ID,
    appId: OS === 'android'? FIREBASE_ANDROID_APP_ID : FIREBASE_IOS_APP_ID
};
export const TIPS = [5,20,50, 120, 240, 333];
export const SLOW_CONNECTION_TIMER = 5000;
export const TOAST_TIMEOUT = 1500;
export const LONG_TOAST_TIMEOUT = 2000;
export const NEXT_TRACK_TIMEOUT = 500;
export const POST_SEEK_TIMEOUT = 100;
export const REDIRECT_TIMER = 300;
export const emailregex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

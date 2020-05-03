import {
    STORE_INPUT,
    SET_USER_TYPE
} from './types';
import AsyncStorage from '@react-native-community/async-storage';

export const storeInput = input => {
    return {
        type: STORE_INPUT,
        payload: input
    }
}

export const setUserType = userType => {
    if (userType) AsyncStorage.setItem('userType', userType);
    return {
        type: SET_USER_TYPE,
        payload: userType
    }
}
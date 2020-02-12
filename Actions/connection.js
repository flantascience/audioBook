import { SLOW_CONNECTION, NO_CONNECTION, CONNECTED } from './types';

export const slowConnectionDetected = () => {
  return {
    type: SLOW_CONNECTION
  }
}

export const connected = type => {
  return {
    type: CONNECTED,
    payload: type
  }
}

export const noConnectionDetected = () => {
  return {
    type: NO_CONNECTION
  }
}
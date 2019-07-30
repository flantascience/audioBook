import { STORE_INPUT } from './types';

export const storeInput = input => {
  return {
    type: STORE_INPUT,
    payload: input
  }
}
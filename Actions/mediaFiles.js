import { STORE_MEDIA } from './types';

export const storeMedia = media => {
  return {
    type: STORE_MEDIA,
    payload: media
  }
}
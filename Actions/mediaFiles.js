import { STORE_MEDIA, UPDATE_AUDIO_FILES } from './types';

export const storeMedia = media => {
  return {
    type: STORE_MEDIA,
    payload: media
  }
}

export const updateAudio = audioFiles => {
  return {
    type: UPDATE_AUDIO_FILES,
    payload: audioFiles
  }
}
/* eslint-disable prettier/prettier */
import {
  STORE_MEDIA,
  UPDATE_AUDIO_FILES,
  TOGGLE_QUESTIONNAIRE,
  SET_START_TRACKS,
} from './types';

export const storeMedia = media => {
  return {
    type: STORE_MEDIA,
    payload: media,
  };
};

export const changeQuestionnaireVew = payload => {
  return {
    type: TOGGLE_QUESTIONNAIRE,
    payload,
  };
};

export const toggleStartTracks = payload => {
  return {
    type: SET_START_TRACKS,
    payload,
  };
};

export const updateAudio = audioFiles => {
  return {
    type: UPDATE_AUDIO_FILES,
    payload: audioFiles,
  };
};

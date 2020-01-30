import { STORE_MEDIA, UPDATE_AUDIO_FILES, TOGGLE_QUESTIONNAIRE } from '../Actions/types';

const initialState = {
  emails: undefined,
  mediaFiles: [],
  trackPlayer: null,
  selectedTrack: null,
  currentlyPlaying: null,
  initCurrentlyPlaying: false,
  currentlyPlayingName: "",
  audioFiles: [],
  audioFilesCloud: [],
  loaded: false,
  paused: true,
  totalLength: 1,
  totalLengthFormatted: "00:00",
  currentPosition: 0,
  trackDuration: 0,
  currentTime: 0,
  repeatOn: false,
  shuffleOn: false,
  screen: "Intro",
  buttonsActive: false,
  showOverview: false,
  showTextinput: false,
  volume: 0.5,
  showToast: false,
  showMessage: false,
  message: "",
  toastText: null,
  hideMenu: false,
  showQuestionnaire: false,
  questionnaire: { trackName: null, confusing: null, question: null, comment: null },
};

const mediaReducer = (state = initialState, action) => {
  switch(action.type) {
    case STORE_MEDIA:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_AUDIO_FILES:
      return {
        ...state,
        audioFiles: [...action.payload]
      };
    case TOGGLE_QUESTIONNAIRE:
      return {
        ...state,
        showQuestionnaire: action.payload
      }
    default:
      return state;
  }
}

export default mediaReducer;
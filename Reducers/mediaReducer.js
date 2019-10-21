import { STORE_MEDIA, UPDATE_AUDIO_FILES } from '../Actions/types';

const initialState = {
  emails: undefined,
  mediaFiles: [],
  selectedTrack: null,
  currentlyPlaying: null,
  initCurrentlyPlaying: false,
  currentlyPlayingName: "",
  audioFiles: [
    /*{
      id: "0",
      title: "Sample 1 local",
      url: require("../Components/Tracks/tracks/sample_claps.mp3"),
      artist: "Jim Flannery",
      artwork: "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/images%2Fcrzy-head-shot.png?alt=media&token=ee67e620-514d-446f-9f98-1a2e0875ec67",
      formattedDuration: "00:27",
      references: [1,2,3,4],
      duration: 27,
      type: "local"
    }, 
    {
      id: "1",
      title: "Sample 2 local",
      url: require("../Components/Tracks/tracks/sample_noise.mp3"),
      artist: "Jim Flannery",
      artwork: "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/images%2Fcrzy-head-shot.png?alt=media&token=ee67e620-514d-446f-9f98-1a2e0875ec67",
      formattedDuration: "00:45",
      references: [],
      duration: 45,
      type: "local"
    }*/
  ],
  audioFilesCloud: [],
  loaded: false,
  paused: true,
  totalLength: 1,
  totalLengthFormatted: "00:00",
  currentPosition: 0,
  currentTime: 0,
  repeatOn: false,
  shuffleOn: false,
  screen: "Home",
  buttonsActive: false,
  showOverview: false,
  showTextinput: false,
  volume: 0.5,
  showToast: false,
  showMessage: false,
  message: "",
  toastText: null,
  hideMenu: false,
  questionnaire: { trackName: null, confusing: null, question: null  },
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
      }
    default:
      return state;
  }
}

export default mediaReducer;
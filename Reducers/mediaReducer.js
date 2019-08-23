import { STORE_MEDIA } from '../Actions/types';

const initialState = {
  emails: undefined,
  mediaFiles: [],
  selectedTrack: null,
  currentlyPlaying: null,
  initCurrentlyPlaying: false,
  currentlyPlayingName: "",
  audioFiles: [
    {
      id: "0",
      title: "Sample 1 local",
      url: require("../Components/Tracks/tracks/sample_claps.mp3"),
      artist: "Jim Flannery",
      artwork: "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/images%2Fpart2-unschooling.jpg?alt=media&token=955a541e-cbcb-4388-a3cb-f4fc80a4939c",
      formattedDuration: "00:27",
      duration: 27,
      type: "local"
    }, 
    {
      id: "1",
      title: "Sample 2 local",
      url: require("../Components/Tracks/tracks/sample_noise.mp3"),
      artist: "Jim Flannery",
      artwork: "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/images%2Fpart2-unschooling.jpg?alt=media&token=955a541e-cbcb-4388-a3cb-f4fc80a4939c",
      formattedDuration: "00:45",
      duration: 45,
      type: "local"
    },
    {
      id: "2",
      title: "Sample 3 cloud",
      url: "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/audioFiles%2F10%20Calico.mp3?alt=media&token=a14104e0-8909-4ae8-80bf-dbf590b82af2",
      artist: "Jim Flannery",
      artwork: "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/images%2Fpart2-unschooling.jpg?alt=media&token=955a541e-cbcb-4388-a3cb-f4fc80a4939c",
      formattedDuration: "04:10",
      duration: 250,
      type: "cloud"
    }, 
    {
      id: "3",
      title: "Sample 4 cloud",
      url: "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/audioFiles%2FEp%2006%20-%20Education_mixdown.mp3?alt=media&token=95cebb59-b254-4f3e-87ae-36c7c18a54e1",
      artist: "Jim Flannery",
      artwork: "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/images%2Fpart2-unschooling.jpg?alt=media&token=955a541e-cbcb-4388-a3cb-f4fc80a4939c",
      formattedDuration: "01:55:25",
      duration: 6950,
      type: "cloud"
    }
  ],
  loaded: false,
  paused: true,
  totalLength: 1,
  totalLengthFormatted: "00:00",
  currentPosition: 0,
  currentTime: 0,
  repeatOn: false,
  shuffleOn: false,
  screen: null,
  buttonsActive: false,
  showOverview: false,
  showTextinput: false,
  volume: 0.5
};

const mediaReducer = (state = initialState, action) => {
  switch(action.type) {
    case STORE_MEDIA:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default mediaReducer;
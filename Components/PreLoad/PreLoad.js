import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Dimensions,
  ActivityIndicator,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import NetInfo from "@react-native-community/netinfo";
import { storeMedia } from '../../Actions/mediaFiles';
import TrackPlayer from 'react-native-track-player';
import { storeRefs, fetchingRefs } from '../../Actions/references';
import { slowConnectionDetected, noConnectionDetected, connected } from '../../Actions/connection';
import { REDIRECT_TIMER } from '../../Misc/Constants';
import { navInfo } from '../../Misc/Strings';
import firebase from 'react-native-firebase';
import { withNavigationFocus } from 'react-navigation'
import { styles } from './styles';
import { eventEmitter } from 'react-native-dark-mode';

const tracksRef = firebase.database().ref("/tracks");
const versionsRef = firebase.database().ref("/versions");
const referencesRef = firebase.database().ref("/references");
const Android = Platform.OS === 'android';

class PreLoad extends React.Component {

  static navigationOptions = () => ({
    headerLeft: <Header pre={true} />,
    headerTitleStyle: {
        textAlign: 'center',
        justifyContent: 'center',
        color: '#FF6D00',
        alignItems: 'center'
    },
    headerStyle: {
        backgroundColor: eventEmitter.currentMode === 'dark' ? '#212121' : '#EBEAEA',
        height: 80,
    },
  });

  componentDidMount(){
    const { navigation: { navigate }, reportConnection, reportNoConnection, reportSlowConnection, loadedFromMemory, screen, storeMedia } = this.props;
    this.fetchAndStoreMedia();
    this.fetchAndStoreRefs();
    NetInfo.isConnected.addEventListener('connectionChange', () => {
      NetInfo.getConnectionInfo().then(info => {
        const {type, effectiveType} = info;
        if (type === 'none') reportNoConnection();
        else if ( type === 'wifi' )  reportConnection('fast');
        else if (type === 'cellular' && effectiveType === '4g' || type === 'cellular' && effectiveType === 'unknown' ) reportConnection('normal');
        else if ( type === 'cellular' && effectiveType === '3g' || type === 'cellular' && effectiveType === '2g' ) reportSlowConnection();
      });
    });
    eventEmitter.on('currentModeChanged', newMode => {
      // console.log('Switched to', newMode, 'mode');
      this.props.navigation.setParams({
        headerStyle:{
          backgroundColor: newMode === 'dark' ? '#212121' : '#EBEAEA',
          height: 80,
        }
      });
      this.forceUpdate();
    });

    if (!loadedFromMemory) {
      AsyncStorage.getItem('media').then( res => {
        if (res) {
          const objMedia = JSON.parse(res);
          const {
            screen,
            audioFiles,
            selectedTrack,
            currentPosition,
            currentTime,
            selectedTrackId,
            showOverview,
            currentlyPlaying,
            currentlyPlayingName,
            initCurrentlyPlaying,
            buttonsActive,
            trackDuration, 
            stopped,
            loaded, 
            totalLength, 
            formattedDuration
          } = objMedia;
          storeMedia({
            screen: !Android ? 'Intro' : screen,
            selectedTrack,
            currentPosition,
            currentTime,
            selectedTrackId,
            currentlyPlaying,
            currentlyPlayingName,
            initCurrentlyPlaying,
            buttonsActive,
            showOverview,
            trackDuration, 
            stopped,
            loaded, 
            totalLength, 
            formattedDuration,
            loadedFromMemory: true
          });
          if (Android && TrackPlayer) {
            // track 0 always returns falsey
            if (audioFiles.length > 0 && currentlyPlaying !== null && currentlyPlaying !== undefined) {
              TrackPlayer.add([audioFiles[parseInt(currentlyPlaying)]]).then(res => {
                // track loaded
                console.log('track loaded')
              });
            }
          }
          setTimeout(() => {
            Android ? navigate(navInfo[screen]) : navigate('Second');
          }, REDIRECT_TIMER);
        }
        else {
          storeMedia({loadedFromMemory:true});
          setTimeout(() => {
            navigate(navInfo[screen]);
          }, REDIRECT_TIMER);
        }
      });
    }
  }

  fetchTracksVersion = () => {
    return new Promise(resolve => {
      let newVersion = false;
      this._getStoredData("versions").then(val => {
        let oldVersion = val;
        //version control to keep track of the track updates
        versionsRef.once('value', data => {
          data.forEach(spec => {
            let key = spec.key;
            let value = spec.val();
            //check if data versions match
            if (key === "tracks" && oldVersion !== value) {
              newVersion = true;
              AsyncStorage.setItem("versions", value);
              //resolve(newVersion);
            }
          });
        }).catch(error => {
          console.log(error);
        });
      });
      resolve(newVersion);
    });
  }

  fetchFromFirebase = (fixOnlyCloud = true) => {
    let cloudAudio = [];
    tracksRef.once('value', data => {
      data.forEach(trackInf => {
        //console.log(trackInf);
        let track = trackInf.val();
        if (track) cloudAudio.push(track);
      });
      let newAudioFiles = [...cloudAudio];
      if (fixOnlyCloud) this.props.storeMedia({audioFilesCloud: newAudioFiles});
      else {
        this.props.storeMedia({audioFiles: newAudioFiles, audioFilesCloud: newAudioFiles});
        this._storeAudioFilesData(newAudioFiles);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  fetchAndStoreMedia = () => {
    let dataIntact = true;
    NetInfo.fetch().then(state => {
      let conType = state.type;
      let haveNet = conType === "wifi" || conType === "cellular" ? true : false;
      if (haveNet) {
        this.fetchTracksVersion().then(newVersion => {
          if (newVersion) this.fetchFromFirebase(false);
          else {
            // this.fetchFromFirebase();
            this._getStoredData("audioFiles").then(res => {
              if (res) {
                let storedAudioFiles = JSON.parse(res);
                this.fetchFromFirebase();
                for(var i = 0; i < storedAudioFiles.length; i++){
                  if (!storedAudioFiles[i]) {
                    dataIntact = false;
                    break;
                  }
                }
                if (dataIntact) {
                  this.props.storeMedia({audioFiles: storedAudioFiles});
                  this.fetchFromFirebase();
                } 
                else this.fetchFromFirebase(false);
              }
              else this.fetchFromFirebase(false);
            });
          }
        });
      } 
      else {
        this._getStoredData("audioFiles").then(res => {
          if (res) {
            let storedAudioFiles = JSON.parse(res);
            for (var i = 0; i < storedAudioFiles.length; i++) {
              if (!storedAudioFiles[i]) {
                dataIntact = false;
                break;
              }
            }
            if (dataIntact) this.props.storeMedia({audioFiles: storedAudioFiles})
            else {
              let filteredData = storedAudioFiles.filter( e => {
                return e != null;
              });
              this.props.storeMedia({audioFiles: filteredData})
            }
          }
          else this.props.storeMedia({audioFiles: []});
        });
      }
    });
  }

  fetchAndStoreRefs = () => {
    let cloudRefs = [];
    //this._getStoredData("audioFiles");
    this.props.startFetchingRefs();
    referencesRef.once('value', data => {
      data.forEach(refInfo => {
        let key = refInfo.key;
        let ref = refInfo.val();
        cloudRefs[key] = ref;
      });
      //console.log(cloudRefs)
      this.props.storeReferences(cloudRefs);
    });
  }

  _getStoredData = key => {
    return new Promise(async resolve => {
      await AsyncStorage.getItem(key).then(res => {
        //console.log(res)
        resolve(res);
      });
    });
  }

  _storeAudioFilesData = async audioFiles => {
    try {
      let stringAudioFiles = JSON.stringify(audioFiles);
      await AsyncStorage.setItem('audioFiles', stringAudioFiles);
      this.props.storeMedia({audioFiles});
    } catch (error) {
      console.log(error);
    }
  };
  
  render(){
    let {
      navigation,
      currentlyPlayingName,
    } = this.props;
    let mode = eventEmitter.currentMode;
    let dark = mode === 'dark';

    let height = Dimensions.get('window').height;
    return (
      <View style={ styles.Home }>
        <View style={ styles.homeMid}>
          <ActivityIndicator 
            size="large" 
            color="#D4D4D4"
            style={{ marginTop: "10%" }}
          />
        </View>
        <View 
            style = { currentlyPlayingName && height < 570 ? 
            !dark ? styles.altHomeFooter : styles.altHomeFooterDark :
            !dark ? styles.homeFooter : styles.homeFooterDark
          }>
          <Footer navigation={ navigation } />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return{
    screen: state.media.screen,
    currentlyPlaying: state.media.currentlyPlaying,
    currentlyPlayingName: state.media.currentlyPlayingName,
    initCurrentlyPlaying: state.media.initCurrentlyPlaying,
    audioFiles: state.media.audioFiles,
    references: state.refs.references,
    buttonsActive: state.media.buttonsActive,
    showOverview: state.media.showOverview,
    selectedTrackId: state.media.selectedTrackId,
    loaded: state.media.loaded,
    selectedTrack: state.media.selectedTrack,
    currentPostion: state.media.currentPostion,
    showTextinput: state.media.showTextinput,
    connectionInfo: state.connectionInfo,
    loadedFromMemory: state.media.loadedFromMemory,
    paused: state.media.paused,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    storeMedia: media => {
      dispatch(storeMedia(media));
    },
    startFetchingRefs: () => {
      dispatch(fetchingRefs());
    },
    reportSlowConnection: () => {
      dispatch(slowConnectionDetected());
    },
    reportNoConnection: () => {
      dispatch(noConnectionDetected());
    },
    reportConnection: type => {
      dispatch(connected(type));
    },
    storeReferences: refs => {
      dispatch(storeRefs(refs));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(PreLoad));

import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import TrackPlayer from 'react-native-video';
import { connect } from 'react-redux';
import { 
  Toast,
  Audio,
  Header,
  Footer
} from '../';
import Icon from 'react-native-vector-icons/Ionicons';
import ProgressCircle from 'react-native-progress-circle';
import firebase from 'react-native-firebase';
import RNFS from 'react-native-fs';
import { formatTime } from '../../Misc/helpers';
import { tracks, connectionFeedback } from '../../Misc/Strings';
import { SLOW_CONNECTION_TIMER, TOAST_TIMEOUT } from '../../Misc/Constants';
import { styles } from './style';
import { storeMedia, updateAudio, changeQuestionnaireVew, toggleStartTracks } from '../../Actions/mediaFiles';
import { slowConnectionDetected, noConnectionDetected } from '../../Actions/connection';
import { changeRefsView } from '../../Actions/references';
import { eventEmitter } from 'react-native-dark-mode';

const Analytics = firebase.analytics();
const tracksRef = firebase.database().ref("/tracks");
const Android = Platform.OS === 'android';

class Tracks extends React.Component {
  constructor(props){
    super(props);
    let { audioFiles } = props;
    let currentAction = [];

    audioFiles.forEach(file=>{
      let { id } = file;
      currentAction.push({ 
        id, 
        action: "stop", 
        percentage: 1,
        error: null
      });
    });
    this.state = {
      currentAction,
      currentTime: null,
      autoPlayStarted: false,
      referencesInfo: []
    }
  }

  static navigationOptions = () => {
    return {
      headerLeft: <Header />,
      headerTitleStyle: {
          textAlign: 'center',
          justifyContent: 'center',
          color: '#FF6D00',
          alignItems: 'center'
      },
      headerStyle: {
        backgroundColor: eventEmitter.currentMode === 'dark' ? '#212121' : '#EBEAEA',
        height: 80,
        borderBottomWidth: Android ? 0 : 1,
        borderBottomColor: eventEmitter.currentMode === 'dark' ? '#525253' : '#C7C6C6'
      }
    }
  };

  componentDidMount(){
    Analytics.setCurrentScreen('Tracks_prod');
    const { connectionInfo: { connected } } = this.props;
    if (!connected) {
      let showMessage = true;
      this.props.store({showMessage, message: tracks.noInternetConnection });
    }
    else this.props.store({showMessage: false, message: null });
  }

  componentDidUpdate(){
    // console.log(this.props.trackPlayer)
    const { connectionInfo: { connected, startTracks }, showMessage, audioFiles, changeStartTracks } = this.props;
    const audioFilesLoaded = audioFiles.length > 0;
    if (startTracks && audioFilesLoaded && !this.state.autoPlayStarted) {
      this.setState({autoPlayStarted: true});
      this.toggleNowPlaying("0", true);
      changeStartTracks(false);
    }
    if (!connected) {
      let showMessage = true;
      this.props.store({showMessage, message: tracks.noInternetConnection });
    }
    else if (connected && showMessage) this.props.store({showMessage: false, message: null });
  }

  foldAccordions = () => {
    const { updateShowRefs, updateShowQuestionnaire } = this.props;
    let val = false;
    updateShowRefs(val);
    updateShowQuestionnaire(val);
  }

  toggleNowPlaying = (pos, prog = false) => {
    let { audioFiles, selectedTrack, audioFilesCloud, references, trackDuration, connectionInfo: { connected } } = this.props;
    let { currentAction } = this.state;
    let currPos = audioFiles ? audioFiles[pos] : null;
    this.foldAccordions();
    if (currPos !== null && pos !== selectedTrack) {
      //console.log(res)
      const mediaType = audioFiles[pos].type;
      const title = audioFiles[pos].title;
      /**If track is cloud based one needs an internet connection*/
      //console.log(currPos)
      let playable = mediaType === "local" ?
      true:
      mediaType === "cloud" && connected ?
      true:
      false;
      if (playable) {
        Analytics.logEvent('tracks_played_prod', {tracks: title});
        // console.log(audioFiles[pos].title)
        this.updateReferenceInfo(audioFiles[pos].id, audioFiles, references);
        if (mediaType === "local") {
          RNFS.exists(audioFiles[pos].url).then(res => {
            if (res) {
              //console.log(trackDuration)
              if(trackDuration > 0 ){
                let formattedDuration = formatTime(trackDuration);
                this.props.store({
                  selectedTrack: pos,
                  currentPostion: 0,
                  currentTime:0,
                  selectedTrackId: audioFiles[pos].id,
                  currentlyPlaying: audioFiles[pos].id,
                  currentlyPlayingName: audioFiles[pos].title,
                  initCurrentlyPlaying: true,
                  buttonsActive: true,
                  showOverview: prog ? false : true,
                  trackDuration, 
                  paused: false, 
                  loaded: true, 
                  totalLength: trackDuration, 
                  formattedDuration
                });
              }
              else {
                trackDuration = audioFiles[pos].duration;
                let formattedDuration = formatTime(trackDuration);
                this.props.store({
                  selectedTrack: pos,
                  currentPostion: 0,
                  currentTime:0,
                  selectedTrackId: audioFiles[pos].id,
                  currentlyPlaying: audioFiles[pos].id,
                  currentlyPlayingName: audioFiles[pos].title,
                  initCurrentlyPlaying: true,
                  buttonsActive: true,
                  showOverview: prog ? false : true,
                  trackDuration, 
                  paused: false, 
                  loaded: true, 
                  totalLength: trackDuration, 
                  formattedDuration
                });
              }
              //alert that track is streaming
              currentAction[pos].action = "streaming";
            }
            else {
              let showToast = true;
              let newAudioFiles;
              this.props.store({showToast, toastText: tracks.redownloadTrack });
              setTimeout(() => {
                this.props.store({showToast: !showToast, toastText: null });
              }, TOAST_TIMEOUT);
              if (audioFilesCloud.length > 0) {
                newAudioFiles = [...audioFilesCloud];
                this._storeData(newAudioFiles);
              }
              else this.fetchFromFirebase();
            }
          });
        }
        else {
          //console.log(trackDuration)
          if (trackDuration > 0) {
            let formattedDuration = formatTime(trackDuration);
            this.props.store({
              selectedTrack: pos,
              currentPostion: 0,
              currentTime:0,
              selectedTrackId: audioFiles[pos].id,
              currentlyPlaying: audioFiles[pos].id,
              currentlyPlayingName: audioFiles[pos].title,
              initCurrentlyPlaying: true,
              buttonsActive: true,
              showOverview: prog ? false : true,
              trackDuration, 
              paused: false, 
              loaded: true, 
              totalLength: trackDuration, 
              formattedDuration
            });
          }
          else {
            trackDuration = audioFiles[pos].duration;
            let formattedDuration = formatTime(trackDuration);
            this.props.store({
              selectedTrack: pos,
              currentPostion: 0,
              currentTime:0,
              selectedTrackId: audioFiles[pos].id,
              currentlyPlaying: audioFiles[pos].id,
              currentlyPlayingName: audioFiles[pos].title,
              initCurrentlyPlaying: true,
              buttonsActive: true,
              showOverview: prog ? false : true,
              trackDuration, 
              paused: false, 
              loaded: true, 
              totalLength: trackDuration, 
              formattedDuration
            });
          }
          //log streamed audio if title available
          audioFiles[pos].title ? Analytics.logEvent('consumption_type_prod', {streaming: audioFiles[pos].title}) : null;
          //alert that track is streaming
          currentAction[pos].action = "streaming";
          this.setState({currentAction});
        }
      }
      else {
        let showToast = true;
        this.props.store({showToast, toastText: tracks.noInternetConnection });
        setTimeout(()=>{
          this.props.store({showToast: !showToast, toastText: null });
        }, TOAST_TIMEOUT);
      }
    }
    else {
      console.log('currpos be null')
      if (!currPos) {
        let showToast = true;
        let newAudioFiles = [...audioFiles];
        newAudioFiles[pos] = audioFilesCloud[pos];
        this.props.store({showToast, toastText: tracks.redownloadTrack});
        this._storeData(newAudioFiles);
        setTimeout(()=>{
          this.props.store({showToast: !showToast, toastText: null });
        }, TOAST_TIMEOUT);
      } else {
        let showOverview = !this.props.showOverview;
        this.props.store({showOverview});
      }
    }
  }

  downloadTrack = pos => {
    const { connectionInfo: { connected } } = this.props;
    if (connected) {
      let { audioFiles } = this.props;
      let { currentAction } = this.state;
      let { url, id } = audioFiles[pos];
      let path = RNFS.DocumentDirectoryPath + '/' + id + ".mp3";
      let DownloadFileOptions = {
        fromUrl: url,
        toFile: path,
        //headers: Headers,
        background: true,
        cacheable: true,
        progressDivider: 1,
        discretionary: true,
        begin: res => { 
          let { statusCode } = res;
          if (statusCode !== 200) {
            currentAction[pos].action = "stop";
            currentAction[pos].error = true;
            this.setState({currentAction});
          }
          else {
            // console.log(audioFiles[pos].title)
            audioFiles[pos].title ? Analytics.logEvent('consumption_type_prod', {downloading: audioFiles[pos].title}) : null;
            currentAction[pos].action = "downloading";
            this.setState({currentAction});
          }
        },
        progress: prog => {
          let { bytesWritten, contentLength } = prog;
          let percentage = (bytesWritten/contentLength)*100;
          currentAction[pos].percentage = percentage
          this.setState({currentAction});
        }
      };
      if (currentAction.length > 0) {
        RNFS.downloadFile(DownloadFileOptions).promise.then(()=>{
          let newPath = Platform.OS === 'ios' ? "file:////" + path : path;
          let newAudioFiles = [...audioFiles];
          currentAction[pos].action = "downloaded";
          newAudioFiles[pos].url = newPath;
          newAudioFiles[pos].type = "local";
          //console.log(audioFiles);
          this._storeData(newAudioFiles);
          this.setState({currentAction});
          this.forceUpdate();
        }).catch(err=>{
          console.log(err);
          let showToast = true;
          this.props.store({showToast, toastText: tracks.restartApp });
          setTimeout(() => {
            this.props.store({showToast: !showToast, toastText: null });
          }, TOAST_TIMEOUT);
        });
      }
    }
    else {
      console.log('no interent')
      let showToast = true;
      this.props.store({showToast, toastText: tracks.noInternetConnection });
      setTimeout(() => {
      this.props.store({showToast: !showToast, toastText: null });
      }, TOAST_TIMEOUT);
    }
  }

  updateReferenceInfo = (currentlyPlaying, audioFiles, references) => {
    return new Promise(resolve => {
        let currentReferences = [];
        let referencesInfo = [];
        audioFiles.forEach(file => {
          // console.log(file)
          let id = file.id;
          if(id === currentlyPlaying){
              currentReferences = file.references;
          }
        });
        if (currentReferences && currentReferences.length > 0) {
            currentReferences.forEach(ref => {
                referencesInfo.push(references[ref]);
            });
            this.setState({referencesInfo});
            resolve("has");
        }
        else {
            this.setState({referencesInfo: []});
            resolve("doesnt");
        }
  });
  } 

_storeData = async audioFiles => {
  try{
    let stringAudioFiles = JSON.stringify(audioFiles);
    await AsyncStorage.setItem('audioFiles', stringAudioFiles);
    this.props.store({audioFiles});
    setTimeout(() => {
      this.forceUpdate();
    }, 100);
  }catch(error){
    console.log(error);
  }
};

fetchFromFirebase = () => {
  let { connectionInfo: { connected } } = this.props;
  let cloudAudio = [];
  if (connected ) {
    tracksRef.once('value', data => {
      data.forEach(trackInf => {
        //console.log(trackInf);
        let track = trackInf.val();
        if (track) cloudAudio.push(track);
      });
      let newAudioFiles = [...cloudAudio];
      this.props.store({audioFiles: newAudioFiles, audioFilesCloud: newAudioFiles});
      this._storeAudioFilesData(newAudioFiles);
    }).catch(err => {
      console.log(err)
      let showToast = true;
      this.props.store({showToast, toastText: tracks.downloadError });
      setTimeout(() => {
        this.props.store({showToast: !showToast, toastText: null });
      }, TOAST_TIMEOUT);
      });
  }
  else {
    let showToast = true;
    this.props.store({showToast, toastText: tracks.noInternetConnection });
    setTimeout(() => {
      this.props.store({showToast: !showToast, toastText: null });
    }, TOAST_TIMEOUT);
  }
}

render(){
    let {
      navigation, 
      paused, 
      selectedTrack,
      initCurrentlyPlaying,
      audioFiles,
      currentlyPlayingName,
      showOverview,
      toastText,
      showToast,
      connectionInfo: {
        connection,
        connected
      },
      reportSlowConnection
    } = this.props;
    let { referencesInfo } = this.state;
    let height = Dimensions.get('window').height;

    //console.log(audioFiles);

    let audioSource = selectedTrack ? {uri: audioFiles[selectedTrack].url} : "" ;

    let mode = eventEmitter.currentMode;
    let dark = mode === 'dark';

    let loading = audioFiles.length === 0;
    // set timeout to determine whether the connection is slow
    setTimeout(() => {
      if (loading) reportSlowConnection();
    }, SLOW_CONNECTION_TIMER);

    const audioControls =
      <Audio
        navigate = {navigation.navigate}
        audioSource={ audioSource } // Can be a URL or a local file
        originScreen={'Tracks'}
        referencesInfo={referencesInfo}
        pos={selectedTrack}
        initCurrentlyPlaying = {initCurrentlyPlaying}
        style={ dark ? styles.audioElementDark : styles.audioElement }
      />;

    return (
      <View style={ styles.Home }>
          { !showOverview ?
              <View style = { dark ? styles.homeMidDark : styles.homeMid }>
                { showToast?
                  <View style={ styles.toastContainer }>
                    <Toast dark={dark} text={ toastText } /></View> : 
                  null
                }
                { !loading ?
                <ScrollView style={styles.scrollView}>{ 
                  Object.keys(audioFiles).map(key => {
                    if (audioFiles[key]) { 
                      const { title, type, formattedDuration } = audioFiles[key];
                      const { currentAction } = this.state;
                      /**Set default action */
                      let action = currentAction[key] ? currentAction[key].action : "stop";
                      /**set default percentage */
                      let percentage = currentAction[key] ? Math.floor(currentAction[key].percentage) : 1;
                      let playIcon = key !== selectedTrack ?
                      "play-circle" : 
                      key === selectedTrack && !paused ? "pause" :
                      "play-circle";
                      let downlaodIcon = "cloud-download";

                      return(
                        <View key={key} style={ styles.trackContainer }>
                          <TouchableOpacity onPress={ () => this.toggleNowPlaying(key) } style={ dark ? styles.trackDark : styles.track }> 
                            <View style={ styles.trackTextWrapper }>
                              <Text style={ dark ? styles.trackTitleDark : styles.trackTitle }>{ title }</Text>
                              <Text style={ dark ? styles.trackLengthDark : styles.trackLength }>{ formattedDuration }</Text>
                            </View>
                            <TouchableOpacity onPress={ () => this.toggleNowPlaying(key) } style={ styles.trackIcon }>
                              { playIcon !== "pause" ? 
                              <Icon
                                color={ dark ? '#fff' : '#000' }
                                name={ Platform.OS === "ios" ? `ios-${playIcon}` : `md-${playIcon}`}
                                size={ 40 }
                              /> :
                              <Text style={ dark ? styles.nowPlayingTextDark : styles.nowPlayingText }>...</Text> }
                            </TouchableOpacity>

                            { type === "cloud" && action !== "downloading" ?
                            <TouchableOpacity onPress={ () => this.downloadTrack(key) } style={ styles.trackIcon }>
                              <Icon 
                                color={ dark ? '#fff' : '#000' }
                                name={ Platform.OS === "ios" ? `ios-${downlaodIcon}` : `md-${downlaodIcon}` }
                                size={ 35 }
                              />
                            </TouchableOpacity> :
                            type === "cloud" && action === "downloading" ?
                            <View style={{marginLeft: 20}}>
                              <ProgressCircle
                                percent={percentage}
                                radius={14}
                                borderWidth={2}
                                color="#3399FF"
                                shadowColor="#999"
                                bgColor="#fff"
                              >
                                <Text style={{ fontSize: 8 }}>{ percentage + '%'}</Text>
                              </ProgressCircle>
                            </View> : 
                            null 
                            }
                          </TouchableOpacity>
                        </View>
                      )
                    }
                  })
                }
                </ScrollView> :
                <View>
                  { connected ? 
                    <View>
                      <ActivityIndicator 
                        size="large" 
                        color="#D4D4D4"
                        style={{ marginTop: "10%" }}
                      />
                      { connection === 'slow' ? <Text style={ styles.text }>{ connectionFeedback.slowConnection }</Text> : null }
                    </View> : 
                    <Text style={ styles.text }>{ connectionFeedback.needConnectionToFetchTracks }</Text> 
                  }
                </View>
                }
              </View> : 
              null }
            { selectedTrack ?
            <View 
              style={ showOverview?styles.overviewContainer:
                height < 570?styles.altAltOverviewContainer:
                height > 700 && height < 800?styles.longAltOverviewContanier:
                height > 800?styles.longerAltOverviewContanier:
                styles.altOverviewContainer 
              } 
            >
              { audioControls }
            </View> : null }
          <View style = { currentlyPlayingName && height < 570 ? 
            mode === 'light' ? styles.altHomeFooter : styles.altHomeFooterDark :
            mode === 'light' ? styles.homeFooter : styles.homeFooterDark
          }>
            <Footer navigation={ navigation } />
          </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentlyPlayingName: state.media.currentlyPlayingName,
    initCurrentlyPlaying: state.media.initCurrentlyPlaying,
    screen: state.media.screen,
    trackPlayer: state.media.trackPlayer,
    audioFiles: state.media.audioFiles,
    audioFilesCloud: state.media.audioFilesCloud,
    buttonsActive: state.media.buttonsActive,
    showOverview: state.media.showOverview,
    selectedTrackId: state.media.selectedTrackId,
    loaded: state.media.loaded,
    paused: state.media.paused,
    references: state.refs.references,
    selectedTrack: state.media.selectedTrack,
    currentPostion: state.media.currentPostion,
    showTextinput: state.media.showTextinput,
    trackDuration: state.media.trackDuration,
    hideMenu: state.media.hideMenu,
    toastText: state.media.toastText,
    showToast: state.media.showToast,
    showMessage: state.media.showMessage,
    message: state.media.message,
    connectionInfo: state.connectionInfo,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    store: media => {
      dispatch(storeMedia(media));
    },
    updateAudioFiles: files => {
      dispatch(updateAudio(files));
    },
    reportSlowConnection: () => {
      dispatch(slowConnectionDetected());
    },
    reportNoConnection: () => {
      dispatch(noConnectionDetected());
    },
    updateShowRefs: val => {
      dispatch(changeRefsView(val));
    },
    updateShowQuestionnaire: val => {
      dispatch(changeQuestionnaireVew(val));
    },
    changeStartTracks: value => {
      dispatch(toggleStartTracks(value));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracks);

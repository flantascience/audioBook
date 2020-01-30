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
import TrackPlayer from 'react-native-video';
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux';
import Toast from '../../Components/Toast/Toast';
import Icon from 'react-native-vector-icons/Ionicons';
import Audio from '../Audio/Audio';
import ProgressCircle from 'react-native-progress-circle';
import firebase from 'react-native-firebase';
import RNFS from 'react-native-fs';
import { formatTime } from '../../Misc/helpers';
import { tracks } from '../../Misc/Strings';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { styles } from './style';
// import { SimpleAnimation } from 'react-native-simple-animations';
import { storeMedia, updateAudio, changeQuestionnaireVew } from '../../Actions/mediaFiles';
import { changeRefsView } from '../../Actions/references';
import { eventEmitter } from 'react-native-dark-mode';

const Analytics = firebase.analytics();

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
      referencesInfo: []
    }
  }

  static navigationOptions = ()=> ({
    headerLeft: <Header />,
    headerTitleStyle :{
        textAlign: 'center',
        justifyContent: 'center',
        color: '#FF6D00',
        alignItems: 'center'
    },
    headerStyle:{
        backgroundColor: eventEmitter.currentMode === 'dark'? '#212121' : '#EBEAEA',
        height: 80,
    },
  });

  componentDidMount(){
    Analytics.setCurrentScreen('Tracks');
    NetInfo.fetch().then(state=>{
      let conType = state.type;
      //console.log(conType)
      if(conType !== "wifi" && conType !== "cellular"){
        let showMessage = true;
        this.props.store({showMessage, message: tracks.noInternetConnection });
      }
      else this.props.store({showMessage: false, message: null });
    });
  }

  componentDidUpdate(){
    NetInfo.fetch().then(state=>{
      let conType = state.type;
      //console.log(conType)
      if(conType !== "wifi" && conType !== "cellular"){
        let showMessage = true;
        this.props.store({showMessage, message: tracks.noInternetConnection });
      }else{
        this.props.store({showMessage: false, message: null });
      }
    });
  }

  foldAccordions = () => {
    const { updateShowRefs, updateShowQuestionnaire } = this.props;
    let val = false;
    updateShowRefs(val);
    updateShowQuestionnaire(val);
  }

  toggleNowPlaying = pos => {
    let { audioFiles, selectedTrack, audioFilesCloud, references, trackDuration } = this.props;
    let { currentAction } = this.state;
    let currPos = audioFiles ? audioFiles[pos] : null;
    //console.log(audioFiles[pos]);
    this.foldAccordions();
    if (currPos !== null && pos !== selectedTrack) {
        //console.log(res)
        NetInfo.fetch().then(state => {
          let conType = state.type;
          //console.log(conType)
          let mediaType = audioFiles[pos].type;
          /**If track is cloud based one needs an internet connection*/
          //console.log(currPos)
          let playable = mediaType === "local"?
          true:
          mediaType === "cloud" && conType === "wifi" || mediaType === "cloud" && conType === "cellular"?
          true:
          false;
          if (playable) {
            // console.log(audioFiles[pos].title)
            this.updateReferenceInfo( audioFiles[pos].id, audioFiles, references);
            if(mediaType === "local"){
              RNFS.exists(audioFiles[pos].url).then(res=>{
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
                      showOverview: true,
                      trackDuration, 
                      paused: false, 
                      loaded: true, 
                      totalLength: trackDuration, 
                      formattedDuration
                    });
                  } else {
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
                      showOverview: true,
                      trackDuration, 
                      paused: false, 
                      loaded: true, 
                      totalLength: trackDuration, 
                      formattedDuration
                    });
                  }
                  //alert that track is streaming
                  currentAction[pos].action = "streaming";
                }else{
                  let newAudioFiles = [...audioFiles];
                  let showToast = true;
                  this.props.store({showToast, toastText: tracks.redownloadTrack });
                  setTimeout(()=>{
                    this.props.store({showToast: !showToast, toastText: null });
                  }, 1500);
                  newAudioFiles[pos] = audioFilesCloud[pos];
                  this._storeData(newAudioFiles);
                }
              });
            } else {
              //console.log(trackDuration)
              if(trackDuration > 0){
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
                  showOverview: true,
                  trackDuration, 
                  paused: false, 
                  loaded: true, 
                  totalLength: trackDuration, 
                  formattedDuration
                });
              }else{
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
                  showOverview: true,
                  trackDuration, 
                  paused: false, 
                  loaded: true, 
                  totalLength: trackDuration, 
                  formattedDuration
                });
              }
              //log streamed audio
              Analytics.logEvent('type_of_consumption', {streaming: audioFiles[pos].title});
              //alert that track is streaming
              currentAction[pos].action = "streaming";
            }
          }else{
            let showToast = true;
            this.props.store({showToast, toastText: tracks.noInternetConnection });
            setTimeout(()=>{
              this.props.store({showToast: !showToast, toastText: null });
            }, 1000);
          }
        }).catch(err=>{
          console.log(err)
        });
    }else{
      console.log('currpos be null')
      if (!currPos) {
        let showToast = true;
        let newAudioFiles = [...audioFiles];
        newAudioFiles[pos] = audioFilesCloud[pos];
        this.props.store({showToast, toastText: tracks.redownloadTrack});
        this._storeData(newAudioFiles);
        setTimeout(()=>{
          this.props.store({showToast: !showToast, toastText: null });
        }, 1000);
      } else {
        let showOverview = !this.props.showOverview;
        this.props.store({showOverview});
      }
    }
  }

  downloadTrack = (pos) => {
    NetInfo.fetch().then(state=>{
      let conType = state.type;
      let haveNet = conType === "wifi" || conType === "cellular" ? true : false;
      if(haveNet){
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
            if(statusCode !== 200){
              currentAction[pos].action = "stop";
              currentAction[pos].error = true;
              this.setState({currentAction});
            }else{
              // console.log(audioFiles[pos].title)
              Analytics.logEvent('type_of_consumption', {downloading: audioFiles[pos].title});
              currentAction[pos].action = "downloading";
              this.setState({currentAction});
            }
          },
          progress: prog=>{
            let { bytesWritten, contentLength } = prog;
            let percentage = (bytesWritten/contentLength)*100;
            currentAction[pos].percentage = percentage
            this.setState({currentAction});
          }
        };
        if(currentAction.length > 0){
          RNFS.downloadFile(DownloadFileOptions).promise.then(()=>{
            let newPath = Platform.OS === 'ios'?"file:////" + path:path;
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
            setTimeout(()=>{
              this.props.store({showToast: !showToast, toastText: null });
            }, 1500);
          });
        }
      }else{
        console.log('no interent')
        let showToast = true;
        this.props.store({showToast, toastText: tracks.noInternetConnection });
        setTimeout(()=>{
        this.props.store({showToast: !showToast, toastText: null });
        }, 1000);
      }
    });
  }

  updateReferenceInfo = (currentlyPlaying, audioFiles, references) => {
    return new Promise(resolve=>{
        let currentReferences = [];
        let referencesInfo = [];
        try {
          audioFiles.forEach(file=>{
            console.log(file)
            let id = file.id;
            if(id === currentlyPlaying){
                currentReferences = file.references;
            }
          });
          if(currentReferences && currentReferences.length > 0){
              currentReferences.forEach(ref=>{
                  referencesInfo.push(references[ref]);
              });
              this.setState({referencesInfo});
              resolve("has");
          }else{
              this.setState({referencesInfo: []});
              resolve("doesnt");
          }
        }catch(e){
          console.log(err)
        }
    });
}

_storeData = async (audioFiles) => {
  try {
    let stringAudioFiles = JSON.stringify(audioFiles);
    await AsyncStorage.setItem('audioFiles', stringAudioFiles);
    this.props.store({audioFiles});
    setTimeout(() => {
      this.forceUpdate();
    }, 100);
  } catch (error) {
    console.log(error);
  }
};

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
      showToast
    } = this.props;
    let { referencesInfo } = this.state;
    let height = Dimensions.get('window').height;

    let audioSource = selectedTrack ? {uri: audioFiles[selectedTrack].url} : "" ;

    let mode = eventEmitter.currentMode;
    let dark = mode === 'dark';

    let loading = audioFiles.length === 0;
    const audioControls =
      <Audio
        navigate = {navigation.navigate}
        audioSource={ audioSource } // Can be a URL or a local file
        updateDuration={this.updateDuration}
        referencesInfo={referencesInfo}
        audioFiles={audioFiles}
        pos={selectedTrack}
        initCurrentlyPlaying = {initCurrentlyPlaying}
        style={ dark ? styles.audioElementDark : styles.audioElement }
        currentlyPlayingName={ currentlyPlayingName }
      />;

    return (
      <View style={ styles.Home }>
          { !showOverview?
              <View style = { dark ? styles.homeMidDark : styles.homeMid }>
                { showToast?
                  <View style={ styles.toastContainer }>
                    <Toast dark={dark} text={ toastText } /></View>: 
                  null
                }
                { !loading?
                <ScrollView>{ 
                  Object.keys(audioFiles).map(key => {
                    if (audioFiles[key]) { 
                      let { title, type, formattedDuration } = audioFiles[key];
                      let { currentAction } = this.state;
                      /**Set default action */
                      let action = currentAction[key]?currentAction[key].action:"stop";
                      /**set default percentage */
                      let percentage = currentAction[key]?Math.floor(currentAction[key].percentage): 1;
                      let playIcon = key !== selectedTrack ?
                      "play-circle": 
                      key === selectedTrack && !paused ? "pause":
                      "play-circle";
                      let downlaodIcon = "cloud-download";

                      return(
                        <View key={key} style={ styles.trackContainer }>
                          <TouchableOpacity onPress={ ()=>this.toggleNowPlaying(key) } style={ dark ? styles.trackDark : styles.track }> 
                            <View style={ styles.trackTextWrapper }>
                              <Text style={ dark ? styles.trackTitleDark : styles.trackTitle }>{ title }</Text>
                              <Text style={ dark ? styles.trackLengthDark : styles.trackLength }>{ formattedDuration }</Text>
                            </View>
                            <TouchableOpacity onPress={ ()=>this.toggleNowPlaying(key) } style={ styles.trackIcon }>
                              { playIcon !== "pause" ? 
                              <Icon
                                color={ dark ? '#fff' : '#000' }
                                name={ Platform.OS === "ios" ? `ios-${playIcon}` : `md-${playIcon}`}
                                size={ 40 }
                              /> :
                              <Text style={ dark ? styles.nowPlayingTextDark : styles.nowPlayingText }>...</Text> }
                            </TouchableOpacity>

                            { type === "cloud" && action !== "downloading"?
                            <TouchableOpacity onPress={ ()=>this.downloadTrack(key) } style={ styles.trackIcon }>
                              <Icon 
                                color={ dark ? '#fff' : '#000' }
                                name={ Platform.OS === "ios" ? `ios-${downlaodIcon}` : `md-${downlaodIcon}` }
                                size={ 35 }
                              />
                            </TouchableOpacity>:
                            type === "cloud" && action === "downloading"?
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
                            </View>: null }
                          </TouchableOpacity>
                        </View>
                      )
                    }
                  })
                }
                </ScrollView>:
                <ActivityIndicator 
                  size="large" 
                  color="#D4D4D4"
                  style={{ marginTop: "10%" }}
                />
                }
              </View>: null }
            { selectedTrack ?
            <View 
              style={ showOverview?styles.overviewContainer:
                height < 570?styles.altAltOverviewContainer:
                height > 700 && height < 800?styles.longAltOverviewContanier:
                height > 800?styles.longerAltOverviewContanier:
                styles.altOverviewContainer 
              } 
            >
              <TrackPlayer
                ref={ref => {
                    this.trackPlayer = ref
                }}
                source={audioSource}
                onProgress={data => {
                    let { currentTime } = data;
                    this.setState({currentTime: Math.floor(currentTime)});
                    this.props.store({currentPosition: Math.floor(currentTime)});
                }}
                playInBackground={true}
                playWhenInactive={true}
                paused={paused}
                audioOnly={true}
                controls={false}
                onError={error => {
                  console.log(error)
                }}
                onLoad={data => {
                    let { duration } = data;
                    if (duration) this.props.store({loaded:true, trackDuration: Math.floor(duration)});
                    else this.props.store({loaded:true});
                }}
              />
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
    message: state.media.message
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
    updateShowRefs: val => {
      dispatch(changeRefsView(val));
    },
    updateShowQuestionnaire: val => {
        dispatch(changeQuestionnaireVew(val));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracks);

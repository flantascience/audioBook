import React  from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import Toast from '../../Components/Toast/Toast';
import Icon from 'react-native-vector-icons/Ionicons'
import Audio from '../Audio/Audio';
import ProgressCircle from 'react-native-progress-circle';
import RNFS from 'react-native-fs';
import { formatTime, removeTrack, getDuration } from '../../Misc/helpers';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { styles } from './style';
import { SimpleAnimation } from 'react-native-simple-animations';
import { storeMedia, updateAudio } from '../../Actions/mediaFiles';

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
        backgroundColor:'#EBEAEA',
        height: 80,
    }
  });

  componentDidMount(){
    this.onStateChange = TrackPlayer.addEventListener('playback-state', async (data) => {
      let palyerState = data.state;
      //console.log(palyerState)
      if(Platform.OS === "android"){
        if(palyerState === 1 || palyerState === 2)
          this.props.store({ paused: true });
        else if(palyerState !== 1)
          this.props.store({ paused: false});
      }else if(Platform.OS === "ios"){
        if(palyerState === "paused" || palyerState === "idle"){
          this.props.store({ paused: true });
        }else if(palyerState === "playing"){
          this.props.store({ paused: false });
        }
      }
    });
    NetInfo.fetch().then(state=>{
      let conType = state.type;
      //console.log(conType)
      if(conType !== "wifi" && conType !== "cellular"){
        let showMessage = true;
        this.props.store({showMessage, message: "You need to be online to see and play tracks." });
      }else{
        this.props.store({showMessage: false, message: null });
      }
    });
  }

  componentDidUpdate(){
    NetInfo.fetch().then(state=>{
      let conType = state.type;
      //console.log(conType)
      if(conType !== "wifi" && conType !== "cellular"){
        let showMessage = true;
        this.props.store({showMessage, message: "You need to be online to see and play tracks." });
      }else{
        this.props.store({showMessage: false, message: null });
      }
    });
  }

  toggleNowPlaying = (pos) => {
    let { audioFiles, references } = this.props;
    let { currentAction } = this.state;
    //console.log(audioFiles[pos]);
      removeTrack().then(res=>{
        //console.log(res)
        NetInfo.fetch().then(state=>{
          let conType = state.type;
          //console.log(conType)
          let currPos = audioFiles[pos];
          let mediaType = audioFiles[pos].type;
          /**If track is cloud based one needs an internet connection*/
          //console.log(currPos)
          let playable = mediaType === "local"?
          true:
          mediaType === "cloud" && conType === "wifi" || mediaType === "cloud" && conType === "cellular"?
          true:
          false;
          if(res === "removed"){
            if(playable){
              //this.props.store({hideMenu: true});
              this.updateReferenceInfo( audioFiles[pos].id, audioFiles, references);
              TrackPlayer.add([currPos]).then(res=>{
                getDuration().then(trackDuration=>{
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
                    TrackPlayer.play();
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
                    TrackPlayer.play();
                  }
                  //alert that track is streaming
                  currentAction[pos].action = "streaming";
                })
              }); 
            }else{
              let showToast = true;
              this.props.store({showToast, toastText: "You need to be online to see and play tracks." });
              setTimeout(()=>{
              this.props.store({showToast: !showToast, toastText: null });
              }, 1000);
            }
          }else{
            console.log(res);
          }
        });
        
      });
  }

  downloadTrack = (pos) => {
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
      begin: res=>{ 
        let { statusCode } = res;
        if(statusCode !== 200){
          currentAction[pos].action = "stop";
          currentAction[pos].error = true;
          this.setState({currentAction});
        }else{
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
        currentAction[pos].action = "downloaded";
        audioFiles[pos].url = newPath;
        audioFiles[pos].type = "local";
        //console.log(audioFiles);
        this._storeData(audioFiles);
        this.setState({currentAction});
      });
    }
  }

  updateReferenceInfo = (currentlyPlaying, audioFiles, references) => {
    return new Promise(resolve=>{
        let currentReferences = [];
        let referencesInfo = [];
        audioFiles.forEach(file=>{
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
    });
}

  _storeData = async (audioFiles) => {
    try {
      let stringAudioFiles = JSON.stringify(audioFiles);
      await AsyncStorage.setItem('audioFiles', stringAudioFiles);
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
      isChanging,
      showOverview,
      toastText,
      showToast,
      showMessage,
      message
    } = this.props;
    let { referencesInfo } = this.state;
    let type = selectedTrack?audioFiles[selectedTrack].type:"local";
    let height = Dimensions.get('window').height;
    let audioSource = selectedTrack?type === "local" ? audioFiles[selectedTrack].url : {uri: audioFiles[selectedTrack].url}:"";
    const playing = !isChanging?
      <Audio
        navigate = { navigation.navigate }
        audioSource={ audioSource } // Can be a URL or a local file
        referencesInfo={ referencesInfo }
        audioFiles={audioFiles}
        pos={ selectedTrack }
        initCurrentlyPlaying = { initCurrentlyPlaying }
        style={styles.audioElement}
        currentlyPlayingName={ currentlyPlayingName }
      />: null;

    return (
      <View style={ styles.Home }>
          { !showOverview?
              <View style = { styles.homeMid }>
                <View>{ showToast?<Toast text={ toastText } />: null }</View>
                <ScrollView>{ Object.keys(audioFiles).map(key=>{
                  let { title, type, formattedDuration } = audioFiles[key];
                  let { currentAction } = this.state;
                  /**Set default action */
                  let action = currentAction[key]?currentAction[key].action:"stop";
                  /**set default percentage */
                  let percentage = currentAction[key]?Math.floor(currentAction[key].percentage): 1;
                  let playIcon = key !== selectedTrack?
                  "play-circle": 
                  key === selectedTrack && !paused?"pause":
                  "play-circle";
                  let downlaodIcon = "cloud-download";
                  return(
                    <View key={key} style={ styles.trackContainer }>
                      <View style={ styles.track }> 
                        <View style={ styles.trackTextWrapper }>
                          <Text style={ styles.trackTitle }>{ title }</Text>
                          <Text style={ styles.trackLength }>{ formattedDuration }</Text>
                        </View>
                        { type === "local" || type === "cloud" && (action === "streaming" || action === "stop" || action === "downloaded")?
                        <TouchableOpacity onPress={ ()=>this.toggleNowPlaying(key) } style={ styles.trackIcon }>
                          <Icon
                            name={ Platform.OS === "ios" ? `ios-${playIcon}` : `md-${playIcon}`}
                            size={ 30 }
                          />
                        </TouchableOpacity>: null}

                        { type === "cloud" && action !== "downloading"?
                        <TouchableOpacity onPress={ ()=>this.downloadTrack(key) } style={ styles.trackIcon }>
                          <Icon 
                            name={ Platform.OS === "ios" ? `ios-${downlaodIcon}` : `md-${downlaodIcon}` }
                            size={ 25 }
                          />
                        </TouchableOpacity>:
                        type === "cloud" && action === "downloading"?
                        <ProgressCircle
                          percent={percentage}
                          radius={14}
                          borderWidth={2}
                          color="#3399FF"
                          shadowColor="#999"
                          bgColor="#fff"
                        >
                          <Text style={{ fontSize: 8 }}>{ percentage + '%'}</Text>
                        </ProgressCircle>: null }
                      </View>
                    </View>
                  )
                }) }
                { showMessage?<Text style={ styles.permanentMessage }>{ message }</Text>: null }
                </ScrollView>
              </View>:null}
          <SimpleAnimation 
            style={ showOverview?styles.overviewContainer:
              height < 570?styles.altAltOverviewContainer:
              height > 700 && height < 800?styles.longAltOverviewContanier:
              height > 800?styles.longerAltOverviewContanier:
              styles.altOverviewContainer 
            } 
            direction={'up'} 
            delay={100} 
            duration={500}  
            movementType={ 'slide' }
          >
            { selectedTrack? playing: null }
          </SimpleAnimation>
          <View style = { currentlyPlayingName && height < 570?styles.altHomeFooter:styles.homeFooter }>
            <Footer navigation={ navigation } />
          </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return{
    currentlyPlayingName: state.media.currentlyPlayingName,
    initCurrentlyPlaying: state.media.initCurrentlyPlaying,
    screen: state.media.screen,
    audioFiles: state.media.audioFiles,
    buttonsActive: state.media.buttonsActive,
    showOverview: state.media.showOverview,
    selectedTrackId: state.media.selectedTrackId,
    loaded: state.media.loaded,
    paused: state.media.paused,
    references: state.refs.references,
    selectedTrack: state.media.selectedTrack,
    currentPostion: state.media.currentPostion,
    showTextinput: state.media.showTextinput,
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracks);

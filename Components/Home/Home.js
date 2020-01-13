import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  AppState,
  Text
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import NetInfo from "@react-native-community/netinfo";
import { SimpleAnimation } from 'react-native-simple-animations';
import { storeMedia } from '../../Actions/mediaFiles';
import { storeRefs } from '../../Actions/references';
import Audio from '../Audio/Audio';
import Video from 'react-native-video';
//import MediaOverview from '../MediaOverview/MediaOverview';
import firebase from 'react-native-firebase';
import { withNavigationFocus } from 'react-navigation'
import { styles } from './style';
import demoIntro from "../../Misc/media/demoIntro.mp4";

const tracksRef = firebase.database().ref("/tracks");
const versionsRef = firebase.database().ref("versions");
const referencesRef = firebase.database().ref("/references");
const Analytics = firebase.analytics();

class Home extends React.Component {

  state = {
    introVideo: "../../Misc/media/demo-intro.mp4",
    loaded: false,
    showVid: false,
    secondaryHide: false,
    introPlayed: false,
    paused: true
  }
  static navigationOptions = ({navigation})=> ({
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
    },
  });

  componentDidMount(){
    AppState.addEventListener("change", this._handleAppStateChange);
    this.fetchAndStoreMedia();
    this.fetchAndStoreRefs();
  }

  _handleAppStateChange = (nextState) => {
    let player = this.player;
    if(nextState === "background" || nextState === "inactive" && player){
      this.setState({paused: true});
    }
  }

  fetchTracksVersion = () => {
    return new Promise(resolve=>{
      let newVersion = false;
      this._getStoredData("versions").then(val=>{
        let oldVersion = val;
        //version control to keep track of the track updates
        versionsRef.once('value', data=>{
          data.forEach(spec=>{
            let key = spec.key;
            let value = spec.val();
            //check if data versions match
            if(key === "tracks" && oldVersion !== value){
              newVersion = true;
              AsyncStorage.setItem("versions", value);
              //resolve(newVersion);
            }
            resolve(newVersion);
          });
        }).catch(error=>{
          console.log(error)
        });
      });
    });
  }

  fetchAndStoreMedia = () => {
    let { audioFiles } = this.props;
    let cloudAudio = [];
    
    NetInfo.fetch().then(state=>{
      let conType = state.type;
      let haveNet = conType === "wifi" || conType === "cellular"? true : false;
      if(haveNet){
        this.fetchTracksVersion().then(newVersion=>{
          tracksRef.once('value', data=>{
            data.forEach(trackInf=>{
              //console.log(trackInf);
              let track = trackInf.val();
              cloudAudio.push(track);
            });
            this._getStoredData("audioFiles").then(res=>{
              if(!res || newVersion){
                let newAudioFiles = audioFiles.concat(cloudAudio);
                this.props.storeMedia({audioFiles: newAudioFiles});
                this._storeAudioFilesData(newAudioFiles);
              }else{
                let storedAudioFiles = JSON.parse(res);
                //console.log(storedAudioFiles);
                let newAudioFiles = audioFiles.concat(cloudAudio);
                this.props.storeMedia({audioFiles: storedAudioFiles, audioFilesCloud: newAudioFiles});
              }
            });
          }).catch(err=>{
            console.log(err);
          });
        });
      }else{
        this._getStoredData("audioFiles").then(res=>{
          if(res){
            let storedAudioFiles = JSON.parse(res);
            this.props.storeMedia({audioFiles: storedAudioFiles});
          }
        });
      }
    });
  }

  fetchAndStoreRefs = () => {
    let cloudRefs = [];
    //this._getStoredData("audioFiles");
    referencesRef.once('value', data=>{
      data.forEach(refInfo=>{
        let key = refInfo.key;
        let ref = refInfo.val();
        cloudRefs[key] = ref;
      });
      this.props.storeReferences(cloudRefs);
    });
  }

  _getStoredData = (key) => {
    return new Promise( async resolve=>{
      await AsyncStorage.getItem(key).then(res=>{
        //console.log(res)
        resolve(res);
      });
    });
  }

  _storeAudioFilesData = async (audioFiles) => {
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
      selectedTrack,
      initCurrentlyPlaying,
      audioFiles,
      currentlyPlayingName,
      isChanging,
      showOverview
    } = this.props;
    let { loaded, showVid, paused, introPlayed } = this.state;
    let isFocused = navigation.isFocused();

    if(!isFocused && !paused){
      this.setState({paused:true});
    }

    let height = Dimensions.get('window').height;
    let type = selectedTrack?audioFiles[selectedTrack].type:"local";
    let audioSource = selectedTrack?type === "local" ? audioFiles[selectedTrack].url : {uri: audioFiles[selectedTrack].url}:"";
    console.log(selectedTrack)
    const playing = !isChanging?
      <Audio
        navigate = { navigation.navigate }
        audioSource={ audioSource } // Can be a URL or a local file
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
          <View style = { styles.centerImageContainer }>
            {!loaded?<Image
              source={ require('./images/backgroundImage.jpg')}
              style={ styles.thumb }
            />:null}
            {
              loaded && !showVid?
              <TouchableOpacity
                onPress={ ()=>{
                  this.setState({showVid:true, paused: false, secondaryHide:false})
                }}
              >
                <Image
                  source={ require('./images/backgroundImage2.jpg')}
                  style={ styles.thumb }
                />
              </TouchableOpacity>:
              null
            }
            <Video
              source={demoIntro}// Can be a URL or a local file.
              ref={(ref) => {
                this.player = ref
              }}
              poster = { Image.resolveAssetSource(require('./images/backgroundImage.jpg')).uri }
              posterResizeMode = { "cover" }
              paused = { !paused&&isFocused?false:true }
              onLoad = { () => {
                this.setState({loaded:true});
              }}
              onEnd = {() => {
                this.setState({
                  paused: true, 
                  showVid: false
                });
              }}
              onProgress = { () => {
                if (!introPlayed) {
                  this.setState({introPlayed:true});
                  Analytics.setCurrentScreen('Home');
                  Analytics.logEvent('select_content', {introPlayed: 'true'});
                }
              }}
              repeat = { false }
              disableFocus = { true }
              fullscreen = { false }
              resizeMode = { "cover" }
              playWhenInactive = { false }
              controls = { true }
              style = { !showVid || !isFocused?styles.IntroductionVideoBeforeLoad:styles.IntroductionVideo }
            />
          </View>
        </View>: null }
        { selectedTrack ? <View 
            style={ showOverview?styles.overviewContainer:
              height < 570?styles.altAltOverviewContainer:
              height > 700 && height < 800?styles.longAltOverviewContanier:
              height > 800?styles.longerAltOverviewContanier:
              styles.altOverviewContainer 
            }
          >
            { playing }
          </View>: null }
        <View style = { currentlyPlayingName && height < 570?styles.altHomeFooter:styles.homeFooter }>
          <Footer navigation={ navigation } />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return{
    screen: state.media.screen,
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
    showTextinput: state.media.showTextinput
  }
}

const mapDispatchToProps = dispatch => {
  return {
    storeMedia: (media) => {
      dispatch(storeMedia(media));
    },
    storeReferences: (refs) => {
      dispatch(storeRefs(refs));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(Home));

import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Dimensions,
  Image
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
import { styles } from './style';

const tracksRef = firebase.database().ref("/tracks");
const versionsRef = firebase.database().ref("versions");
const referencesRef = firebase.database().ref("/references");

class Home extends React.Component {

  state = {
    introVideo: "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/videoFiles%2FDemo%20Intro%20Video%20-%206min41sec%20-%20low%20bit%20rate.mp4?alt=media&token=0037ef42-2f30-44be-973c-f587d34de639"
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
    this.fetchAndStoreMedia();
    this.fetchAndStoreRefs();
  }

  fetchTracksVersion = () => {
    return new Promise(resolve=>{
      let newVersion = false;
      this._getStoredData("versions").then(val=>{
        let oldVersion = val;
        console.log(oldVersion);
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
    let { introVideo } = this.state;
    let height = Dimensions.get('window').height;
    let type = selectedTrack?audioFiles[selectedTrack].type:"local";
    let audioSource = selectedTrack?type === "local" ? audioFiles[selectedTrack].url : {uri: audioFiles[selectedTrack].url}:"";
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
            <Video
              source={{uri: introVideo}}   // Can be a URL or a local file.
              ref={(ref) => {
                this.player = ref
              }}
              poster = { Image.resolveAssetSource(require('./images/backgroundImage.jpg')).uri }
              paused = { true }
              fullscreen = { false }
              resizeMode = { "cover" }
              playInBackground = { false }
              playWhenInactive = { false }
              controls = { true }
              style = { styles.IntroductionVideo }
            />
          </View>
        </View>: 
        null }
        <SimpleAnimation 
            style={ showOverview?styles.overviewContainer:
              height < 570?styles.altAltOverviewContainer:
              height > 700 && height < 800?styles.longAltOverviewContanier:
              height > 800?styles.longerAltOverviewContanier:
              styles.altOverviewContainer } 
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);

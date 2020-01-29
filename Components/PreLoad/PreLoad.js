import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Dimensions,
  AppState,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import NetInfo from "@react-native-community/netinfo";
// import { SimpleAnimation } from 'react-native-simple-animations';
import { storeMedia } from '../../Actions/mediaFiles';
import { storeRefs } from '../../Actions/references';
//import MediaOverview from '../MediaOverview/MediaOverview';
import firebase from 'react-native-firebase';
import { withNavigationFocus } from 'react-navigation'
import { styles } from './styles';
import { eventEmitter } from 'react-native-dark-mode';

const tracksRef = firebase.database().ref("/tracks");
const versionsRef = firebase.database().ref("versions");
const referencesRef = firebase.database().ref("/references");

class PreLoad extends React.Component {

  static navigationOptions = () => ({
    headerLeft: <Header />,
    headerTitleStyle :{
        textAlign: 'center',
        justifyContent: 'center',
        color: '#FF6D00',
        alignItems: 'center'
    },
    headerStyle:{
        backgroundColor: eventEmitter.currentMode === 'dark' ? '#212121' : '#EBEAEA',
        height: 80,
    },
  });

  componentDidMount(){
    let { navigation: { navigate } } = this.props;
    AppState.addEventListener("change", this._handleAppStateChange);
    this.fetchAndStoreMedia();
    this.fetchAndStoreRefs();
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
    setTimeout(() => {
      navigate("Second");
    }, 200);
  }

  _handleAppStateChange = nextState => {
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

  fetchFromFirebase = () => {
    let { audioFiles } = this.props;
    let cloudAudio = [];
    try {
        tracksRef.once('value', data=>{
          data.forEach(trackInf=>{
            //console.log(trackInf);
            let track = trackInf.val();
            if (track) cloudAudio.push(track);
          });
          let newAudioFiles = audioFiles.concat(cloudAudio);
          this.props.storeMedia({audioFiles: newAudioFiles});
          this._storeAudioFilesData(newAudioFiles);
        }).catch(err=>{
          console.log(err);
        });
    }catch(err){
      console.log(err)
    }
  }

  fetchAndStoreMedia = () => {
    let dataIntact = true;
    NetInfo.fetch().then(state=>{
      let conType = state.type;
      let haveNet = conType === "wifi" || conType === "cellular"? true : false;
      this.fetchTracksVersion().then(newVersion=>{
        if (newVersion) this.fetchFromFirebase();
        else {
          this._getStoredData("audioFiles").then(res => {
            if(res){
              let storedAudioFiles = JSON.parse(res);
              for(var i = 0; i < storedAudioFiles.length; i++){
                if (!storedAudioFiles[i]) {
                  dataIntact = false;
                  break;
                }
              }
              if (dataIntact) this.props.storeMedia({audioFiles: storedAudioFiles})
              else if (!dataIntact && haveNet) this.fetchFromFirebase()
              else {
                let filteredData = storedAudioFiles.filter( e => {
                  return e != null;
                });
                this.props.storeMedia({audioFiles: filteredData})
              }
            }
          });
        }
      })
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
    paused: state.media.paused,
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(PreLoad));

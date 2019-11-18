import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Image,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import NetInfo from "@react-native-community/netinfo";
import { SimpleAnimation } from 'react-native-simple-animations';
import { storeMedia } from '../../Actions/mediaFiles';
import { storeRefs } from '../../Actions/references';
import Audio from '../Audio/Audio';
//import MediaOverview from '../MediaOverview/MediaOverview';
import firebase from 'react-native-firebase';
import { styles } from './style';

const tracksRef = firebase.database().ref("/tracks");
const versionsRef = firebase.database().ref("versions");
const referencesRef = firebase.database().ref("/references");

class Home extends React.Component {

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
      let oldVersion;
      AsyncStorage.getItem("tracks-version").then(val=>{
        oldVersion = val;
      });
      //version control to keep track of the track updates
      versionsRef.once('value', data=>{
        data.forEach(spec=>{
          let key = spec.key;
          let value = spec.val();
          if(key === "tracks" && parseInt(oldVersion) !== parseInt(value)){
            newVersion = true;
            AsyncStorage.setItem("tracks-version", value);
            //resolve(newVersion);
          }
          resolve(newVersion);
        });
      }).catch(error=>{
        console.log(error)
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
            <Image
              resizeMode="contain" 
              style={ styles.centerImage } 
              source={require('./images/sample-book-cover.jpg')} 
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

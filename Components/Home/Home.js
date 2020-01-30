import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Dimensions,
  Image,
  AppState,
  TouchableOpacity
} from 'react-native';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
// import { SimpleAnimation } from 'react-native-simple-animations';
import { storeMedia } from '../../Actions/mediaFiles';
import { storeRefs } from '../../Actions/references';
import Audio from '../Audio/Audio';
import Video from 'react-native-video';
// import MediaOverview from '../MediaOverview/MediaOverview';
import firebase from 'react-native-firebase';
import { withNavigationFocus } from 'react-navigation';
import { styles } from './style';
import CurricuDumbIntro from "../../Misc/media/CurricuDumb-Intro.mp4";
import { eventEmitter } from 'react-native-dark-mode';

const Analytics = firebase.analytics();

class Home extends React.Component {
  constructor(){
    super()
    this.state = {
      loaded: false,
      showVid: false,
      currentTime: null,
      secondaryHide: false,
      introPlayed: false,
      paused: true
    }
  }

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
    // console.log(this.props.audioFiles)
    AppState.addEventListener("change", this._handleAppStateChange);
    this.blurSubscription = this.props.navigation.addListener(
      'willBlur',
      () => {
        if (!this.state.paused) {
          this.setState({paused: true, showVid: false});
        }
      }
    )
  }

  componentDidUpdate(){
    let {
      navigation,
      paused,
      currentlyPlaying
    } = this.props;
    if (!currentlyPlaying) {
      let vidPlaying = !this.state.paused;
      let isFocused = navigation.isFocused();
      let audioPlaying = !paused;
      if (!isFocused && vidPlaying || audioPlaying && vidPlaying) {
        this.setState({paused: true, showVid: false});
      }
    }
  }

  componentWillUnmount(){
    this.blurSubscription.remove();
  }

  _handleAppStateChange = nextState => {
    let player = this.player;
    if(nextState === "background" || nextState === "inactive" && player){
      this.setState({paused: true});
    }
  }
  
  render(){
    let {
      navigation,
      selectedTrack,
      initCurrentlyPlaying,
      audioFiles,
      currentlyPlayingName,
      showOverview
    } = this.props;
    let { loaded, showVid, paused, introPlayed } = this.state;
    let isFocused = navigation.isFocused();
    let mode = eventEmitter.currentMode;
    let dark = mode === 'dark';
    let audioPlaying = currentlyPlayingName || !this.props.paused;

    if(!isFocused && !paused){
      this.setState({paused:true});
    }

    let height = Dimensions.get('window').height;

    let audioSource = selectedTrack ? {uri: audioFiles[selectedTrack].url} : "";

    return (
      <View style={ styles.Home }>
        { !showOverview ?
        <View style = { styles.homeMid }>
          <View style = { styles.centerImageContainer }>
            {!loaded ? <Image
              source={ require('./images/backgroundImage.jpg')}
              style={ styles.thumb }
            /> : null}
            {
              loaded && !showVid ?
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
            { !audioPlaying ? 
            <Video
              source={CurricuDumbIntro}// Can be a URL or a local file.
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
                if(!isFocused || audioPlaying) {
                  //console.log('pause vid')
                  this.setState({paused: true, showVid: false});
                }
                if (!introPlayed) {
                  this.setState({introPlayed:true});
                  Analytics.setCurrentScreen('Home');
                  Analytics.logEvent('select_content', {introductionVideo: 'Played'});
                }
              }}
              repeat = { false }
              fullscreen = { false }
              resizeMode = { "cover" }
              controls = { true }
              style = { !showVid || !isFocused?styles.IntroductionVideoBeforeLoad:styles.IntroductionVideo }
            /> : null}
          </View>
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
            <Audio
              navigate = { navigation.navigate }
              audioSource={ audioSource } // Can be a URL or a local file
              originScreen={'Home'}
              pos={ selectedTrack }
              initCurrentlyPlaying = { initCurrentlyPlaying }
              style={ dark ? styles.audioElementDark : styles.audioElement }
            />
          </View>: null }
        <View 
            style = { currentlyPlayingName && height < 570 ? 
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(Home));

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
      paused: true,
      fullscreen: false
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
    Analytics.setCurrentScreen('Home');
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
    let { loaded, showVid, paused, introPlayed, fullscreen } = this.state;
    let isFocused = navigation.isFocused();
    let mode = eventEmitter.currentMode;
    let dark = mode === 'dark';
    let audioPlaying = !this.props.paused;

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
            {!loaded ? 
            <TouchableOpacity>
              <Image
                source={ require('./images/backgroundImage.jpg')}
                style={ styles.thumb }
              />
            </TouchableOpacity> : null}
            {
              loaded && !showVid ?
              <TouchableOpacity
                onPress={ ()=>{
                  this.player.presentFullscreenPlayer();
                  setTimeout(() => {
                    this.setState({showVid:true, paused: false, secondaryHide:false })
                  }, 200);
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
              ref={ref => {
                this.player = ref
              }}
              posterResizeMode = { "cover" }
              paused = { !paused&&isFocused?false:true }
              onLoad = { () => {
                this.setState({loaded:true});
              }}
              onEnd = {() => {
                /*this.setState({
                  paused: true, 
                  showVid: false
                });*/
                this.player.dismissFullscreenPlayer();
              }}
              onTouchStart = { () => {
                this.setState({
                  paused: !this.state.paused, 
                  showVid: !this.state.showVid
                });
              }}
              onProgress = { () => {
                if(!isFocused || audioPlaying) {
                  //console.log('pause vid')
                  this.setState({paused: true, showVid: false});
                }
                if (!introPlayed) {
                  this.setState({introPlayed:true});
                  Analytics.logEvent('select_content', {introductionVideo: 'Played'});
                }
              }}
              onFullscreenPlayerWillDismiss = {() => {
                this.setState({
                  showVid: false,
                  paused: true
                });
              }}
              repeat = { true }
              fullscreen = { true }
              fullscreenAutorotate = { false }
              fullscreenOrientation = { "portrait" }
              resizeMode = { "cover" }
              controls = { false }
              style = { !showVid || !isFocused ? styles.IntroductionVideoBeforeLoad : styles.IntroductionVideo }
            /> : null}
          </View>
        </View>: null }
        { selectedTrack ? 
          <View 
            style={ showOverview ? styles.overviewContainer :
              height < 570 ? styles.altAltOverviewContainer :
              height > 700 && height < 800 ? styles.longAltOverviewContanier :
              height > 800 ? styles.longerAltOverviewContanier :
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

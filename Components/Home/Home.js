import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Dimensions,
  Image,
  AppState,
  Platform
} from 'react-native';
import { storeMedia } from '../../Actions/mediaFiles';
import { storeRefs } from '../../Actions/references';
import { 
  Audio,
  AudioAndroid, 
  Footer, 
  Header, 
  Button 
} from '../';
import Video from 'react-native-video';
import firebase from 'react-native-firebase';
import { withNavigationFocus } from 'react-navigation';
import { styles } from './style';
import CurricuDumbIntro from "../../Misc/media/CurricuDumb-Intro.mp4";
import { eventEmitter } from 'react-native-dark-mode';

const Analytics = firebase.analytics();
const Android = Platform.OS === 'android';

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
      fullscreen: false,
      willResume: false
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
    // console.log(this.props.audioFiles)
    AppState.addEventListener("change", this._handleAppStateChange);
    Analytics.setCurrentScreen('Home_prod');
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
    if (nextState === "background" || nextState === "inactive" && player) this.setState({paused: true});
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
    let { loaded, showVid, paused, introPlayed, willResume } = this.state;
    let isFocused = navigation.isFocused();
    let mode = eventEmitter.currentMode;
    let dark = mode === 'dark';
    let audioPlaying = !this.props.paused;

    if (!isFocused && !paused) this.setState({paused:true});

    let height = Dimensions.get('window').height;

    let audioSource = selectedTrack ? {uri: audioFiles[selectedTrack].url} : "";

    const audioControls = Android ? 
      <AudioAndroid
        navigate = { navigation.navigate }
        audioSource={ audioSource } // Can be a URL or a local file
        audioFiles={audioFiles}
        pos={ selectedTrack }
        initCurrentlyPlaying = { initCurrentlyPlaying }
        style={ dark ? styles.audioElementDark : styles.audioElement }
        currentlyPlayingName={ currentlyPlayingName }
      /> : 
      <Audio
        navigate = { navigation.navigate }
        audioSource={ audioSource } // Can be a URL or a local file
        originScreen={'Home'}
        pos={ selectedTrack }
        initCurrentlyPlaying = { initCurrentlyPlaying }
        style={ dark ? styles.audioElementDark : styles.audioElement }
      />;
    return (
      <View style={ styles.Home }>
        { !showOverview ?
        <View style = { styles.homeMid }>
          <View style = { styles.centerImageContainer }>
            { !loaded ? 
            <View>
              <Image
                source={require('./images/home-chalkboard-wide-high-text.jpg')}
                style={ styles.thumb }
              />
            </View> : null }
            {
              loaded && !showVid ?
              <View>
                <Image
                  source={require('./images/home-chalkboard-wide-high-text.jpg')}
                  style={ styles.thumb }
                />
                <View style={ styles.playButtonContainer }>
                  <Button
                    style={ styles.playButton }
                    dark={ dark }
                    title={ willResume ? "Resume" : "Start" }
                    textStyle={{color: '#fff', fontSize: 15, fontFamily: 'Arial', fontWeight: 'bold'}}
                    onPress={ () => {
                      setTimeout(() => {
                        this.setState({showVid:true, paused: false, secondaryHide:false});
                      }, 200);
                      this.player && !Android ? this.player.presentFullscreenPlayer() : null;
                    } } 
                  />
                </View>
              </View> :
              null }
            { !audioPlaying ? 
            <Video
              source={CurricuDumbIntro} // Can be a URL or a local file.
              ref={ref => {
                this.player = ref
              }}
              paused = { !paused && isFocused ? false : true }
              onLoad = { () => {
                this.setState({loaded:true});
              }}
              onEnd = {() => {
                this.setState({
                  paused: true, 
                  showVid: false,
                  willResume: false
                });
                this.player && !Android ? this.player.dismissFullscreenPlayer() : null;
              }}
              onProgress = {data => {
                const { currentTime, playableDuration } = data;
                const { willResume } = this.state;
                if (Math.floor(currentTime) < Math.floor(playableDuration) && !willResume) this.setState({willResume: true})
                else if(Math.floor(currentTime) === Math.floor(playableDuration) && willResume) this.setState({willResume: false})

                if (!isFocused || audioPlaying) this.setState({paused: true, showVid: false});
                if (!introPlayed) {
                  this.setState({introPlayed:true});
                  Analytics.logEvent('played_intro_prod');
                }
              }}
              onFullscreenPlayerWillDismiss = {() => {
                this.setState({
                  showVid: false,
                  paused: true
                });
              }}
              onTouchEnd={() => {
                const { paused, showVid } = this.state
                Android ? this.setState({
                  showVid: !showVid,
                  paused: !paused
                }) : null;
              }}
              repeat = { false }
              fullscreen = { Android ? false : true }
              fullscreenAutorotate = { false }
              fullscreenOrientation = {"portrait"}
              resizeMode = {"cover"}
              controls = { false }
              style = { !showVid || !isFocused ? styles.IntroductionVideoBeforeLoad : styles.IntroductionVideo }
            /> : 
            null }
          </View>
        </View> : 
        null }
        { selectedTrack ? 
          <View 
            style={ showOverview ? styles.overviewContainer :
              height < 570 ? styles.altAltOverviewContainer :
              height > 700 && height < 800 ? styles.longAltOverviewContanier :
              height > 800 ? styles.longerAltOverviewContanier :
              styles.altOverviewContainer 
            }
          > 
            { audioControls }
          </View> : 
          null }
        <View 
          style = { currentlyPlayingName && height < 570 ? 
          mode === 'light' ? styles.altHomeFooter : styles.altHomeFooterDark :
          mode === 'light' ? styles.homeFooter : styles.homeFooterDark }
        >
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
    storeMedia: media => {
      dispatch(storeMedia(media));
    },
    storeReferences: refs => {
      dispatch(storeRefs(refs));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(Home));

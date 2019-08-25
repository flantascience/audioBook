import React  from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Slider,
  Image,
  Text,
  TextInput,
  Button,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Ionicons'
import Audio from '../Audio/Audio';
import { formatTime, removeTrack, getDuration } from '../../Misc/helpers';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { styles } from './style';
import { SimpleAnimation } from 'react-native-simple-animations';
import MediaOverview from '../MediaOverview/MediaOverview';
import { storeMedia } from '../../Actions/mediaFiles';


class Tracks extends React.Component {

  static navigationOptions = ({navigation})=> ({
    headerLeft: <Header />,
    headerTitleStyle :{
        textAlign: 'center',
        justifyContent: 'center',
        color: '#FF6D00',
        alignItems: 'center'
    },
    headerStyle:{
        backgroundColor:'white',
        height: 80,
    },
  });

  componentDidMount(){
    let { audioFiles, paused } = this.props;
    this.onStateChange = TrackPlayer.addEventListener('playback-state', async (data) => {
      let palyerState = data.state;
      if(Platform.OS === "android"){
        if(palyerState === 1)
          this.props.store({ paused: true, showTextinput: true });
        else if(palyerState !== 1)
          this.props.store({ paused: false, showTextinput: false });
      }else if(Platform.OS === "ios"){
        if(palyerState === "paused"){
          this.props.store({ paused: true, showTextinput: true });
        }else if(palyerState === "playing"){
          this.props.store({ paused: false, showTextinput: false });
        }
      }

    });
  }

  toggleNowPlaying = (pos) => {
    let { audioFiles, paused, loaded, selectedTrackId } = this.props;
    //console.log(audioFiles[pos]);
      removeTrack().then(res=>{
        //console.log(res)
        if(res === "removed"){
          let currPos = audioFiles[pos];
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
              
            })
          }); 
        }else{
          console.log(res)
        }
      });
  }

  render(){
    let {
      navigation, 
      currentlyPlaying, 
      loaded,
      selectedTrack,
      initCurrentlyPlaying,
      audioFiles,
      currentlyPlayingName,
      isChanging,
      showOverview,
      showTextinput
    } = this.props;
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
              <ScrollView>{ Object.keys(audioFiles).map(key=>{
                let { id, title, url, type, duration, formattedDuration } = audioFiles[key];
                let playIcon = key !== currentlyPlaying?
                type === "local"?
                "play-circle":
                "cloud-download":"pause";
                let audioSource = type === "local" ? url : { uri: url };
                return(
                  <View key={key} style={ styles.trackContainer }>
                    <View style={ styles.track }>
                      <View style={ styles.trackTextWrapper }>
                        <Text style={ styles.trackTitle }>{ title }</Text>
                        <Text style={ styles.trackLength }>{ formattedDuration }</Text>
                      </View>
                      <TouchableOpacity onPress={ ()=>this.toggleNowPlaying(key) } style={ styles.trackIcon }>
                        <Icon
                          name={ Platform.OS === "ios" ? `ios-${playIcon}` : `md-${playIcon}`}
                          size={ 35 }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }) }</ScrollView>
            </View>:
          <SimpleAnimation 
            style={ showTextinput?styles.altOverviewContainer:styles.overviewContainer } 
            direction={'up'} 
            delay={100} 
            duration={500} 
            movementType={ 'slide' }
          >
            <MediaOverview navigate = { navigation.navigate } />
          </SimpleAnimation> }
          { selectedTrack? playing: null }
          <View style = { styles.homeFooter }>
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
    selectedTrack: state.media.selectedTrack,
    currentPostion: state.media.currentPostion,
    showTextinput: state.media.showTextinput
  }
}

const mapDispatchToProps = dispatch => {
  return {
    store: (media) => {
      dispatch(storeMedia(media));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracks);

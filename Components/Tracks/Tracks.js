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
  Platform,
  Dimensions
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import Toast from '../../Components/Toast/Toast';
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
        backgroundColor:'#EBEAEA',
        height: 80,
    },
  });

  componentDidMount(){
    let { audioFiles, paused } = this.props;
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
    let { audioFiles, paused, loaded, selectedTrackId } = this.props;
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
          let playable = mediaType === "local"?true:mediaType === "cloud" && conType === "wifi" || mediaType === "cloud" && conType === "cellular"?true: false;
          if(res === "removed"){
            if(playable){
              //this.props.store({hideMenu: true});
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
              let showToast = true;
              this.props.store({showToast, toastText: "You need to be online to see and play tracks." });
              setTimeout(()=>{
              this.props.store({showToast: !showToast, toastText: null });
              }, 1000);
            }
          }else{
            console.log(res)
          }
        });
        
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
      showTextinput,
      hideMenu,
      toastText,
      showToast,
      showMessage,
      message
    } = this.props;
    let type = selectedTrack?audioFiles[selectedTrack].type:"local";
    let height = Dimensions.get('window').height;
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
                <View>{ showToast?<Toast text={ toastText } />: null }</View>
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
    store: (media) => {
      dispatch(storeMedia(media));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracks);

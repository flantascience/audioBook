/**
 * Sample React Native Home
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React  from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Slider,
  Image,
  Text,
  TextInput,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons'
import 'firebase/database';
import Audio from '../Audio/Audio';
import Video from 'react-native-video';
import '../../Misc/helpers';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { styles } from './style';
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

  /*componentDidMount(){
    let mediaFiles = [];
    let audioFiles = (this.state.audioFiles).map(item => ({...item}));
    let count = 0;
    this.fetchFiles().then(res=>{
      res.items.forEach((itemRef)=>{
        count =+ 1;
        // All the items under listRef.
        itemRef.getDownloadURL().then(res=>{
          let curObj = {
            name: "Introduction" + count,
            url: res,
            duration: "00.28",
            type: "cloud"
          }
          mediaFiles.push(curObj);
        });
      });
    });
    let loaded = mediaFiles.length > 0?true:false;
    audioFiles.concat(mediaFiles);
    this.setState({
      audioFiles,
      mediaFiles,
      loaded
    });
  }*/

  componentDidMount(){
    let newState = { screen: "Tracks" };
    this.props.store(newState);
  }

  toggleNowPlaying = (pos) => {
    let { audioFiles } = this.props;
    let newState = {
      selectedTrack: pos,
      currentPostion: 0,
      currentTime:0,
      currentlyPlaying: null,
      currentlyPlayingName: audioFiles[pos].name,
      paused: true,
      initCurrentlyPlaying: true,
      buttonsActive: true
    };
    this.props.store(newState);
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
      isChanging
    } = this.props;
    if(loaded){
      console.log(audioFiles);
    }
    let type = selectedTrack?audioFiles[selectedTrack].type:"local";

    let audioSource = selectedTrack?type === "local" ? audioFiles[selectedTrack].url : {uri: audioFiles[selectedTrack].url}:"";
    const playing = !isChanging?
      <Audio
        audioSource={ audioSource } // Can be a URL or a local file
        audioFiles={audioFiles}
        pos={ selectedTrack }
        initCurrentlyPlaying = { initCurrentlyPlaying }
        style={styles.audioElement}
        currentlyPlayingName={ currentlyPlayingName }
      />: null;

    return (
      <View style={ styles.Home }>
        <View style = { styles.homeMid }>
          <ScrollView>{ Object.keys(audioFiles).map(key=>{
            let { name, url, type, duration } = audioFiles[key];
            let playIcon = key !== currentlyPlaying?type === "local"?"play-circle":"cloud-download":"pause";
            let audioSource = type === "local" ? url : {uri: url};
            return(
              <View key={key} style={ styles.trackContainer }>
                <View style={ styles.track }>
                  <View style={ styles.trackTextWrapper }>
                    <Text style={ styles.trackTitle }>{ name }</Text>
                    <Text style={ styles.trackLength }>{ duration }</Text>
                    <Video
                      source={ audioSource }
                      paused={true}
                      type={ type }
                      audioOnly={ true }
                      onLoad={(data)=>{
                          // console.log(totalLength);
                          let trackLength = Math.floor(data.duration);
                          if(parseInt(trackLength) > 0){
                            audioFiles[key].duration = trackLength;
                            let newState = {
                              audioFiles
                            };
                            this.props.store(newState);
                          }
                        }
                      }
                    />
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
          { playing }
        </View>
        <View style = { styles.homeFooter }>
          <Footer navigation={ navigation } />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return{
    selectedTrack: state.media.selectedTrack,
    currentlyPlayingName: state.media.currentlyPlayingName,
    initCurrentlyPlaying: state.media.initCurrentlyPlaying,
    screen: state.media.screen,
    audioFiles: state.media.audioFiles,
    buttonsActive: state.media.buttonsActive
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

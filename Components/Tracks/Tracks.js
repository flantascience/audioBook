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
import * as firebase from 'firebase';
import 'firebase/database';
import Audio from '../Audio/Audio';
import Video from 'react-native-video';
import '../../Misc/helpers';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { styles } from './style';
import { storeMedia } from '../../Actions/mediaFiles';
import claps from './tracks/sample_claps.mp3';
import noise from './tracks/sample_noise.mp3';


class Tracks extends React.Component {

  constructor(props){
    super(props)
    this.state = { 
      ...props,
      audioFiles: [
        {
          name: "Sample 1 local",
          url: claps,
          duration: "00:27",
          type: "local"
        }, 
        {
          name: "Sample 2 local",
          url: noise,
          duration: "00:45",
          type: "local"
        },
        {
          name: "Sample 3 cloud",
          url: "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/audioFiles%2F10%20Calico.mp3?alt=media&token=a14104e0-8909-4ae8-80bf-dbf590b82af2",
          duration: "-",
          type: "cloud"
        }, 
        {
          name: "Sample 4 cloud",
          url: "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/audioFiles%2FEp%2006%20-%20Education_mixdown.mp3?alt=media&token=95cebb59-b254-4f3e-87ae-36c7c18a54e1",
          duration: "-",
          type: "cloud"
        }
      ]
    }
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

  toggleNowPlaying = (pos) => {
    let { audioFiles } = this.state;
    this.setState({
      selectedTrack: pos,
      currentlyPlayingName: audioFiles[pos].name,
      initCurrentlyPlaying: true
    });
  }

  render(){
    let { navigation, currentlyPlaying, loaded, mediaFiles } = this.props;
    let {
      selectedTrack,
      initCurrentlyPlaying,
      audioFiles,
      currentlyPlayingName
    } = this.state;
    if(loaded){
      console.log(mediaFiles);
    }
    let type = selectedTrack?audioFiles[selectedTrack].type:"local";

    let audioSource = selectedTrack?type === "local" ? audioFiles[selectedTrack].url : {uri: audioFiles[selectedTrack].url}:"";
    const playing = !this.state.isChanging?
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
                          let audioFiles = { ...this.state.audioFiles };
                          if(type !== "local"){
                            audioFiles[key].duration = trackLength;
                            this.setState({
                              audioFiles
                            });
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
        </View>
        {playing}
        <View style = { styles.homeFooter }>
          <Footer navigation={ navigation } />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return{
    selectedTrack: state.selectedTrack,
    currentlyPlayingName: state.currentlyPlayingName,
    initCurrentlyPlaying: state.initCurrentlyPlaying,
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

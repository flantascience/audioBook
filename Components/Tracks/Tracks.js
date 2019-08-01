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
import Video from 'react-native-video';
import '../../Misc/helpers';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { styles } from './style';
import { storeMedia } from '../../Actions/mediaFiles';
import claps from './tracks/sample_claps.mp3'
import noise from './tracks/sample_noise.mp3'

const storage = firebase.storage();
const storageRef = storage.ref();


class Tracks extends React.Component {

  constructor(){
    super()
    this.state = {
      mediaFiles: [],
      selectedTrack: 0,
      currentlyPlaying: undefined,
      audioFiles: [
        {
          name: "Sample 1 local",
          url: claps,
          duration: "00.28",
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
          url: "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/audioFiles%2Fsample_claps.mp3?alt=media&token=e2c76d56-9a86-42f6-95ba-990c22d85e12",
          duration: "00.28",
          type: "cloud"
        }, 
        {
          name: "Sample 4 cloud",
          url: "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/audioFiles%2Fsample_noise.mp3?alt=media&token=f7536158-8277-4e4c-95fc-fb4c3a380b36",
          duration: "00:45",
          type: "cloud"
        }
      ],
      loaded: false,
      paused: true,
      totalLength: 1,
      currentPosition: 0,
      repeatOn: false,
      shuffleOn: false,
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

  fetchFiles = ()=>{
    return new Promise((resolve, reject)=>{
      let audioFiles = storageRef.child('/audioFiles');
      audioFiles.list().then(res=>{
        resolve(res);
      }).catch(err=>{
        reject(err);
      });
    });
  }

  initializeMediaState = (currentlyPlaying, pos)=>{
    //console.log(currentlyPlaying + " " + pos);
    return new Promise((resolve)=>{
      //console.log( currentlyPlaying );
      if( currentlyPlaying && currentlyPlaying !== pos){
        //console.log("first option");
        this.setState({
          currentlyPlaying: undefined,
          selectedTrack: 0,
          paused: true
        });
        this.forceUpdate();
        resolve('done');
      }else if( currentlyPlaying && currentlyPlaying === pos){
        //console.log("second option");
        this.setState({
          currentlyPlaying: undefined,
          selectedTrack: 0,
          paused: true
        });
        resolve('playing');
      }else{
        //console.log("last option");
        resolve("not")
      }
    });
  }


  toggleTrack = (pos)=>{
    let { currentlyPlaying } = this.state;
    this.initializeMediaState(currentlyPlaying, pos).then(res=>{
      //console.log(res)
      if(res==="done" || res==="not"){
        this.setState({
          paused: false,
          currentlyPlaying: pos,
          selectedTrack: pos
        });
      }
    });
  }

  setDuration = (data)=>{
    // console.log(totalLength);
    this.setState({totalLength: Math.floor(data.duration)});
  }

  setTime = (data)=>{
    //console.log(data);
    this.setState({currentPosition: Math.floor(data.currentTime)});
  }

  seek = (time)=>{
    time = Math.round(time);
    this.refs.audioElement && this.refs.audioElement.seek(time);
    this.setState({
      currentPosition: time,
      paused: false,
    });
  }

  onBack = ()=> {
    if (this.state.currentPosition < 10 && this.state.selectedTrack > 0) {
      this.refs.audioElement && this.refs.audioElement.seek(0);
      this.setState({ isChanging: true });
      setTimeout(() => this.setState({
        currentPosition: 0,
        paused: false,
        totalLength: 1,
        isChanging: false,
        selectedTrack: this.state.selectedTrack - 1,
      }), 0);
    } else {
      this.refs.audioElement.seek(0);
      this.setState({
        currentPosition: 0,
      });
    }
  }

  onForward = ()=> {
    if (this.state.selectedTrack < this.props.tracks.length - 1) {
      this.refs.audioElement && this.refs.audioElement.seek(0);
      this.setState({ isChanging: true });
      setTimeout(() => this.setState({
        currentPosition: 0,
        totalLength: 1,
        paused: false,
        isChanging: false,
        selectedTrack: this.state.selectedTrack + 1,
      }), 0);
    }
  }

  videoError = (err) =>{
    console.log(err)
    console.log("there was an error")
  }

  onEnd = ()=>{

  }

  loadStart = ()=>{

  }

  render(){
    let {
      navigation
    } = this.props;
    let {
      mediaFiles,
      loaded,
      currentlyPlaying,
      selectedTrack,
      audioFiles,
      repeatOn,
      paused
    } = this.state;
    if(loaded){
      console.log(mediaFiles);
    }
    //console.log(paused)
    const video = this.state.isChanging ? null : 
      <Video source={ audioFiles[selectedTrack].type === "local" ? audioFiles[selectedTrack].url : {uri: audioFiles[selectedTrack].url} } // Can be a URL or a local file.
        ref="audioElement"
        paused={paused}               // Pauses playback entirely.
        resizeMode="cover"           // Fill the whole screen at aspect ratio.
        repeat={repeatOn}
        playInBackground={true}                // Repeat forever.
        onLoadStart={this.loadStart} // Callback when video starts to load
        onLoad={this.setDuration}    // Callback when video loads
        onProgress={this.setTime}    // Callback every ~250ms with currentTime
        onEnd={this.onEnd}           // Callback when playback finishes
        onError={this.videoError}    // Callback when video cannot be loaded
        style={styles.audioElement} />;

    return (
      <View style={ styles.Home }>
        <View style = { styles.homeMid }>
          <ScrollView>{ Object.keys(audioFiles).map(key=>{
            let { name, url, type, duration } = audioFiles[key];
            let playIcon = key !== currentlyPlaying?type === "local"?"play-circle":"cloud-download":"pause";
            return(
              <View key={key} style={ styles.trackContainer }>
                <View style={ styles.track }>
                  <View style={ styles.trackTextWrapper }>
                    <Text style={ styles.trackTitle }>{ name }</Text>
                    <Text style={ styles.trackLength }>{ duration }</Text>
                  </View>
                  <TouchableOpacity onPress={ ()=>this.toggleTrack(key) } style={ styles.trackIcon }>
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
        {video}
        <View style = { styles.homeFooter }>
          <Footer navigation={ navigation } />
        </View>
      </View>
    );
  }
}


const mapStateToProps = state => {
  return{
    mediaFiles: state.mediaFiles
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

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
  Image,
  Text,
  TextInput,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons'
import * as firebase from 'firebase';
import 'firebase/database';
import '../../Misc/helpers';
//import TrackPlayer from 'react-native-track-player';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { styles } from './style';
import { storeMedia } from '../../Actions/mediaFiles';
import { initFilesState } from '../../Misc/Strings';

const storage = firebase.storage();
const storageRef = storage.ref();



class Tracks extends React.Component {

  constructor(){
    super()
    this.state = {
      mediaFiles: [],
      currentlyPlaying: undefined,
      audioFiles: [
        {
          name: "Introduction",
          url: "./tracks/sample_claps.mp3",
          duration: "00.28",
          playing: false,
          type: "local"
        }, 
        {
          name: "Why I made this app",
          url: "./tracks/sample_noise.mp3",
          duration: "00:45",
          playing: false,
          type: "local"
        },
        {
          name: "Part I - Self directed learning",
          url: "./tracks/sample_claps.mp3",
          duration: "47:17",
          playing: false,
          type: "cloud"
        }, 
        {
          name: "Part II - Unschooling",
          url: "./tracks/sample_noise.mp3",
          duration: "32:15",
          playing: false,
          type: "cloud"
        },
        {
          name: "Part III - Finding your tribe",
          url: "./tracks/sample_claps.mp3",
          duration: "30:45",
          playing: false,
          type: "cloud"
        }, 
        {
          name: "Why I made this app",
          url: "./tracks/sample_noise.mp3",
          duration: "30:45",
          playing: false,
          type: "local"
        },
        {
          name: "Introduction",
          url: "./tracks/sample_claps.mp3",
          duration: "30:45",
          playing: false,
          type: "local"
        }, 
        {
          name: "Why I made this app",
          url: "./tracks/sample_noise.mp3",
          duration: "30:45",
          playing: false,
          type: "local"
        }
      ],
      loaded: false
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

  componentDidMount(){
    let mediaFiles = [];
    this.fetchFiles().then(res=>{
      res.items.forEach(function(itemRef) {
        // All the items under listRef.
        itemRef.getDownloadURL().then(res=>{
          mediaFiles.push(res);
        });
      });
    });
    let loaded = mediaFiles.length > 0?true:false;
    this.setState({
      mediaFiles,
      loaded
    });
  }

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
    console.log(currentlyPlaying + " " + pos);
    return new Promise((resolve)=>{
      if(currentlyPlaying !== undefined && parseInt(currentlyPlaying) !== parseInt(pos)){
        this.setState({
          audioFiles: initFilesState,
          currentlyPlaying: undefined
        });
        resolve('done');
      }else if(currentlyPlaying !== undefined && parseInt(currentlyPlaying) === parseInt(pos)){
        console.log(pos + " to be stopped");
        let audioFiles = {...this.state.audioFiles};
        audioFiles[pos].playing = false;
        this.setState({
          audioFiles,
          currentlyPlaying: undefined
        });
        resolve('playing');
      }else{
        resolve("not")
      }
    });
  }

  toggleTrack = (pos)=>{
    let { currentlyPlaying } = this.state;
    this.initializeMediaState(currentlyPlaying, pos).then(res=>{
      console.log(res)
      if(res==="done" || res==="not"){
        let audioFiles = {...this.state.audioFiles};
        audioFiles[pos].playing = true;
        this.setState({
          audioFiles,
          currentlyPlaying: pos
        });
      }
    })
    
  }

  render(){
    let {
      navigation
    } = this.props;
    let {
      mediaFiles,
      loaded,
      audioFiles
    } = this.state;
    return (
      <View style={ styles.Home }>
        <View style = { styles.homeMid }>
          <ScrollView>{ Object.keys(audioFiles).map(key=>{
            let { name, url, type, duration, playing } = audioFiles[key];
            let playIcon = !playing?type === "local"?"play-circle":"cloud-download":"pause";
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

import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Image,
  Text,
  Dimensions
} from 'react-native';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { SimpleAnimation } from 'react-native-simple-animations';
import { storeMedia } from '../../Actions/mediaFiles';
import Audio from '../Audio/Audio';
import MediaOverview from '../MediaOverview/MediaOverview';
import firebase from 'react-native-firebase';
import { styles } from './style';

const dbRef = firebase.database().ref("/tracks");

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
    let { audioFiles } = this.props;
    let cloudAudio = [];
    dbRef.once('value', data=>{
      data.forEach(trackInf=>{
        //console.log(trackInf);
        let track = trackInf.val();
        cloudAudio.push(track);
      });
      let newAudioFiles = audioFiles.concat(cloudAudio);
      this.props.store({audioFiles: newAudioFiles});
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
      showOverview
    } = this.props;
    let height = Dimensions.get('window').height;
    console.log(height)
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
        { !showOverview?<View style = { styles.homeMid }>
          <View style = { styles.centerImageContainer }>
            <Image
              resizeMode="contain" 
              style={ styles.centerImage } 
              source={require('./images/sample-book-cover.jpg')} 
            />
          </View>
        </View>: null }
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);

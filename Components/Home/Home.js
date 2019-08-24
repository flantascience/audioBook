import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Image
} from 'react-native';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { storeMedia } from '../../Actions/mediaFiles';
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
        backgroundColor:'white',
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
    let newState = {
      screen: "Home"
    };
    //console.log(audioFiles)
    this.props.store(newState);
  }

  render(){
    let {
      navigation
    } = this.props;
    return (
      <View style={ styles.Home }>
        <View style = { styles.homeMid }>
          <View style = { styles.centerImageContainer }>
            <Image style={ styles.centerImage } source={require('./images/sample-book-cover.jpg')} />
          </View>
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
    screen: state.media.screen,
    audioFiles: state.media.audioFiles
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Dimensions } from 'react-native';
import { eventEmitter } from 'react-native-dark-mode';
//import { withNavigationFocus } from 'react-navigation';
import { styles } from './styles';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

class LandingView extends Component {
  
  static navigationOptions = ()=> ({
    headerLeft: <Header />,
    headerTitleStyle :{
        textAlign: 'center',
        justifyContent: 'center',
        color: '#FF6D00',
        alignItems: 'center'
    },
    headerStyle:{
        backgroundColor: eventEmitter.currentMode === 'dark'? '#212121' : '#EBEAEA',
        height: 80,
    },
  });
  render(){
    let { currentlyPlayingName, navigation } = this.props;
    let height = Dimensions.get('window').height;
    let mode = eventEmitter.currentMode;
    let dark = mode === 'dark';
    return (
      <View style={ styles.Home }>
        <Text>Home</Text>
        <View style = { currentlyPlayingName && height < 570 ? 
            !dark ? styles.altHomeFooter : styles.altHomeFooterDark :
            !dark ? styles.homeFooter : styles.homeFooterDark
          }>
            <Footer navigation={ navigation } />
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return{
    //screen: state.media.screen,
    //currentlyPlaying: state.media.currentlyPlaying,
    currentlyPlayingName: state.media.currentlyPlayingName,
    /*initCurrentlyPlaying: state.media.initCurrentlyPlaying,
    audioFiles: state.media.audioFiles,
    references: state.refs.references,
    buttonsActive: state.media.buttonsActive,
    showOverview: state.media.showOverview,
    selectedTrackId: state.media.selectedTrackId,
    loaded: state.media.loaded,
    selectedTrack: state.media.selectedTrack,
    currentPostion: state.media.currentPostion,
    showTextinput: state.media.showTextinput,
    paused: state.media.paused,*/
  }
}

export default connect(mapStateToProps)(LandingView);
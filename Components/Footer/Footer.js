import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import IconButton from "../IconButton/IconButton";
import {
    View
} from 'react-native';
import { footer } from '../../Misc/Strings';
import { storeMedia } from '../../Actions/mediaFiles';
import { styles } from './style';
import { eventEmitter } from 'react-native-dark-mode'

const Footer =  ({ store, screen, currentlyPlayingName, navigation: { navigate } }) => {
    let currPlayingNameLen = currentlyPlayingName ? currentlyPlayingName.length: 0;
    let hike = currPlayingNameLen > 1 ? true : false;
    //console.log(props)
    const goTo = place => {
        toggleOverview().then(res=>{
            if(res === "hidden") navigate(place);
        }); 
    }

    const toggleOverview = ()=>{
        return new Promise(resolve => {
            store({ showOverview: false, showTextinput: false });
            resolve('hidden');
        });
    }

    const [mode = eventEmitter.currentMode, changeMode] = useState();

    useEffect(()=>{
        let currentMode = eventEmitter.currentMode;
        changeMode(currentMode);
    })

    return(
        <View 
        style= { hike ? 
            mode === 'light'? styles.altOuterContainer : styles.altOuterContainerDark :
            mode === 'light'? styles.outerContainer : styles.outerContainerDark
        }>
            <View style={ hike ? styles.altContainer : styles.container }>
                <IconButton
                    onPress={ () => {
                        let newState = {
                            screen: "Intro"
                        };
                        store(newState);
                        goTo(footer.home.place);
                    } }
                    active = { screen === 'Intro' }
                    name={'home'}
                    style = { styles.icon }
                    iconStyle = { screen === "Intro" ? 
                    mode === 'light' ? styles.altIconText : styles.altIconTextDark :
                    mode === 'light' ? styles.iconText : styles.iconTextDark }
                    size={ 25 }
                    text={ footer.home.text }
                />
                <IconButton
                    onPress={ () => {
                        let newState = {
                            screen: "Tracks"
                        };
                        store(newState);
                        goTo(footer.tracks.place);
                    }}
                    active = { screen === 'Tracks' }
                    name={'volume-high'}
                    style = { styles.icon }
                    iconStyle = { screen === "Tracks" ? 
                    mode === 'light' ? styles.altIconText : styles.altIconTextDark :
                    mode === 'light' ? styles.iconText : styles.iconTextDark }
                    size={ 25 }
                    text={ footer.tracks.text }
                />
                <IconButton
                    onPress={ () => {
                        let newState = {
                            screen: "Author"
                        };
                        store(newState);
                        goTo(footer.author.place); 
                    }}
                    name={'person'}
                    size={ 25 }
                    active = { screen === 'Author' }
                    style = { styles.icon }
                    iconStyle = { screen === "Author" ? 
                    mode === 'light' ? styles.altIconText : styles.altIconTextDark :
                    mode === 'light' ? styles.iconText : styles.iconTextDark }
                    text={ footer.author.text }
                />
            </View>
        </View>
    )
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
      showTextinput: state.media.showTextinput,
      paused: state.media.paused
    }
  }

const mapDispatchToProps = dispatch => {
    return {
        store: media => {
            dispatch(storeMedia(media));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Footer);

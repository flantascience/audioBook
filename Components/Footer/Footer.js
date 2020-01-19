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

const Footer = (props)=>{
    const { navigate } = props.navigation;
    let { screen, currentlyPlayingName } = props;
    let currPlayingNameLen = currentlyPlayingName.length;
    let hike = currPlayingNameLen > 1?true:false;
    //console.log(props)
    const goTo = (place)=>{
        toggleOverview().then(res=>{
            if(res === "hidden")
                navigate(place);
        }); 
    }

    const toggleOverview = ()=>{
        return new Promise(resolve=>{
            props.store({ showOverview: false, showTextinput: false });
            resolve('hidden');
        });
    }

    const [mode = 'light', changeMode] = useState();

    useEffect(()=>{
        let currentMode = eventEmitter.currentMode;
        changeMode(currentMode);
        eventEmitter.on('currentModeChanged', newMode => {
            changeMode(newMode);
            console.log('Switched to', newMode, 'mode')
        }) 
    }, [])

    return(
        <View 
        style= { hike ? 
            mode === 'light'? styles.altOuterContainer : styles.altOuterContainerDark :
            mode === 'light'? styles.outerContainer : styles.outerContainerDark
        }>
            <View style={ hike ? styles.altContainer : styles.container }>
                <IconButton
                    onPress={ ()=>{
                        let newState = {
                            screen: "Home"
                        };
                        props.store(newState);
                        goTo(footer.home.place);
                    } }
                    active = { screen === 'Home' }
                    name={'home'}
                    style = { styles.icon }
                    iconStyle = { screen === "Home" ? 
                    mode === 'light' ? styles.altIconText : styles.altIconTextDark :
                    mode === 'light' ? styles.iconText : styles.iconTextDark }
                    size={ 25 }
                    text={ footer.home.text }
                />
                <IconButton
                    onPress={ ()=>{
                        let newState = {
                            screen: "Tracks"
                        };
                        props.store(newState);
                        goTo(footer.tracks.place);
                    }}
                    active = { screen === 'Tracks' }
                    name={'volume-high'}
                    place={ footer.tracks.place }
                    style = { styles.icon }
                    iconStyle = { screen === "Tracks" ? 
                    mode === 'light' ? styles.altIconText : styles.altIconTextDark :
                    mode === 'light' ? styles.iconText : styles.iconTextDark }
                    size={ 25 }
                    text={ footer.tracks.text }
                />
                <IconButton
                    onPress={ ()=>{
                        let newState = {
                            screen: "Author"
                        };
                        props.store(newState);
                        goTo(footer.author.place); 
                    }}
                    name={'person'}
                    place={ footer.author.place }
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
        store: (media) => {
            dispatch(storeMedia(media));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Footer);

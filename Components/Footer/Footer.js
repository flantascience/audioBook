import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import IconButton from "../IconButton/IconButton";
import {
    View,
    Share,
    Platform
} from 'react-native';
import { footer } from '../../Misc/Strings';
import { storeMedia } from '../../Actions/mediaFiles';
import { styles } from './style';
import { eventEmitter } from 'react-native-dark-mode';
import { BRANCH_LINK } from 'react-native-dotenv';

const Android = Platform.OS === 'android';

const currentMode = 'dark'; /* eventEmitter.currentMode; */

const Footer =  ({ store, screen, currentlyPlayingName, navigation: { navigate } }) => {
    let currPlayingNameLen = currentlyPlayingName ? currentlyPlayingName.length: 0;
    let hike = currPlayingNameLen > 1 ? true : false;
    //console.log(props)
    const goTo = place => {
        toggleOverview().then(res=>{
            if(res === "hidden") navigate(place);
        }); 
    }

    const toggleOverview = () => {
        return new Promise(resolve => {
            store({ showOverview: false, showTextinput: false });
            resolve('hidden');
        });
    }

    const share = async () => {
        try {
            const message = Android ? "You need to checkout this app! "+ BRANCH_LINK : "You need to checkout this app!";
            await Share.share({message, url: BRANCH_LINK}).then(result => {
                /** Do something after sharing */
            });
        }catch(e){
            console.log(e);
        }
    }

    const [mode = currentMode, changeMode] = useState();

    useEffect(() => {
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
                        store({screen: 'Intro'});
                        goTo(footer.home.place);
                    } }
                    active = { screen === 'Intro' }
                    name={footer.home.icon}
                    style = { styles.icon }
                    iconStyle = { screen === "Intro" ? 
                    mode === 'light' ? styles.altIconText : styles.altIconTextDark :
                    mode === 'light' ? styles.iconText : styles.iconTextDark }
                    size={ 25 }
                    text={ footer.home.text }
                />
                <IconButton
                    onPress={ () => {
                        store({screen: 'Tracks'});
                        goTo(footer.tracks.place);
                    }}
                    active = { screen === 'Tracks' }
                    name={footer.tracks.icon}
                    style = { styles.icon }
                    iconStyle = { screen === "Tracks" ? 
                    mode === 'light' ? styles.altIconText : styles.altIconTextDark :
                    mode === 'light' ? styles.iconText : styles.iconTextDark }
                    size={ 25 }
                    text={ footer.tracks.text }
                />
                <IconButton
                    onPress={ () => {
                        store({screen: 'Author'});
                        goTo(footer.author.place); 
                    }}
                    name={footer.author.icon}
                    size={ 25 }
                    active = { screen === 'Author' }
                    style = { styles.icon }
                    iconStyle = { screen === "Author" ? 
                    mode === 'light' ? styles.altIconText : styles.altIconTextDark :
                    mode === 'light' ? styles.iconText : styles.iconTextDark }
                    text={ footer.author.text }
                />
                <IconButton
                    onPress={ share }
                    name={footer.share.icon}
                    size={ 25 }
                    active = { false }
                    style = { styles.icon }
                    iconStyle = { mode === 'light' ? styles.iconText : styles.iconTextDark }
                    text={ footer.share.text }
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

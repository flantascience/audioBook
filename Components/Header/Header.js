import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    Image,
    Platform
} from 'react-native';
import { header } from '../../Misc/Strings';
import { storeMedia } from '../../Actions/mediaFiles';
import AsyncStorage from '@react-native-community/async-storage';
import { styles } from './style';
import { eventEmitter } from 'react-native-dark-mode';
// import jsonStringifier from 'json-stringify-safe';

const Android = Platform.OS === 'android';

const Header = ({ playingIntro, media, preloader=false }) => {
    const [mode = eventEmitter.currentMode, changeMode] = useState();
    useEffect(() => {
        let currentMode = eventEmitter.currentMode;
        changeMode(currentMode);
        return cleanup = () => {
            if (!preloader) {
                const {
                    screen,
                    audioFiles,
                    selectedTrack,
                    currentPosition,
                    currentTime,
                    selectedTrackId,
                    currentlyPlaying,
                    currentlyPlayingName,
                    initCurrentlyPlaying,
                    buttonsActive,
                    showOverview,
                    trackDuration, 
                    stopped,
                    loaded, 
                    totalLength, 
                    formattedDuration
                } = media;
                
                const stringifiedMedia = JSON.stringify({
                    screen,
                    audioFiles,
                    selectedTrack,
                    currentPosition,
                    currentTime,
                    selectedTrackId,
                    currentlyPlaying,
                    currentlyPlayingName,
                    initCurrentlyPlaying,
                    buttonsActive,
                    showOverview,
                    trackDuration,
                    stopped,
                    loaded,
                    totalLength,
                    formattedDuration
                });
                AsyncStorage.setItem('media', stringifiedMedia);
            }
        };
    })

    if (!playingIntro || !Android)
    return(
        <View style={ styles.header }>
            <View style={ styles.headerElementsContainer}>
                <View style={ styles.navLogoConatiner }>
                    <Image style={ styles.navLogo } source={require('./images/crzy-head-shot-trans.png')} />
                </View>
                <View style={ styles.textContainer }>
                    <Text style={ mode === 'light' ? styles.headerText : styles.headerTextAlt }>{ header.headerText }</Text>
                    <Text style = { mode === 'light' ? styles.subHeaderText : styles.subHeaderTextAlt }>{ header.subHeaderText }</Text>
                </View>
            </View>
        </View>
    ) 
    else return null;
}

const mapDispatchToProps = dispatch => {
    return {
        storeMedia: media => {
            dispatch(storeMedia(media));
        }
    }
}

const mapStateToProps = state => {
    return {
        playingIntro: state.media.playingIntro,
        loadedFromMemory: state.media.loadedFromMemory,
        media: state.media
    }  
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

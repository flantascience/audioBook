import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    Image,
    Platform,
    BackHandler,
    Alert
} from 'react-native';
import { header } from '../../Misc/Strings';
import { storeMedia } from '../../Actions/mediaFiles';
import { setUserType } from '../../Actions/userInput';
import AsyncStorage from '@react-native-community/async-storage';
import { styles } from './style';
//import { eventEmitter } from 'react-native-dark-mode';

const Android = Platform.OS === 'android';

const currentMode = 'dark'; /* eventEmitter.currentMode; */

const Header = ({ playingIntro, media, preloader=false, updateUserType }) => {

    const [mode = currentMode, changeMode] = useState();

    useEffect(() => {
        AsyncStorage.getItem('userType').then(userType => {
            if(userType) updateUserType(userType);
        });
        BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert(
                'Exit App',
                'Do you want to exit?',
                [
                  {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'Yes', onPress: () => BackHandler.exitApp()},
                ],
                { cancelable: false }
            );
            return true;
        });
    }, []);

    useEffect(() => {
        /**not component will unmount just periodic updates */
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
        },
        updateUserType: userType => {
            dispatch(setUserType(userType));
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

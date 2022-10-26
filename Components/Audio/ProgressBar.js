/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { Platform } from 'react-native'
import { connect } from 'react-redux';
import TrackPlayer, { useTrackPlayerProgress } from 'react-native-track-player';
//import { formatTime } from '../../Misc/helpers';
import Slider from '@react-native-community/slider';
import firebase from 'react-native-firebase';
import { styles } from './styles';
import { POST_SEEK_TIMEOUT } from '../../Misc/Constants';
import { storeMedia } from '../../Actions/mediaFiles';

const Analytics = firebase.analytics();
const Android = Platform.OS === 'android';

const ProgressBar = ({ iOSTrackPlayer, paused, trackDuration, audioFiles, currentlyPlaying, reached90, toggleReached90, buttonsActive, dark, currentPosition, store }) => {
    const { position, duration } = useTrackPlayerProgress();
    useEffect(() => {
        let tempPosition = Android ? position : currentPosition;
        let flooredCurrentPosition = Math.floor(parseFloat(tempPosition));
        const percentage = flooredCurrentPosition / Math.floor(parseFloat(tempPosition)) * 100;
        if (Android) {
            !paused && flooredCurrentPosition ? store({ currentPosition: flooredCurrentPosition, trackDuration: duration }) : null;
        }
        else store({ currentPosition: flooredCurrentPosition });
        if (percentage >= 90 && !reached90) {
            Analytics.logEvent('tracks_completed_prod', { tracks: audioFiles[currentlyPlaying].title });
            toggleReached90();
        }
    })

    /*let tempPosition = Android ? position : currentPosition;*/

    // let flooredCurrentPosition = Math.floor(parseFloat(tempPosition));
    return (
        <Slider
            style={styles.slider}
            value={currentPosition}
            maximumValue={trackDuration || 10}
            onSlidingComplete={currentPosition => {
                if (Android) {
                    store({ currentPosition });
                    setTimeout(() => TrackPlayer.seekTo(currentPosition), POST_SEEK_TIMEOUT)
                } else {
                    store({ currentPosition });
                    iOSTrackPlayer ? setTimeout(() => iOSTrackPlayer.seek(currentPosition), POST_SEEK_TIMEOUT) : null;
                }
            }}
            minimumValue={0}
            minimumTrackTintColor={dark ? '#212121' : '#D4D4D4'}
            maximumTrackTintColor={'#757575'}
            disabled={!buttonsActive}
        />
    );
}

const mapStateToProps = state => {
    return {
        selectedTrack: state.media.selectedTrack,
        iOSTrackPlayer: state.media.trackPlayer,
        currentlyPlaying: state.media.currentlyPlaying,
        paused: state.media.paused,
        totalLengthFormatted: state.media.totalLengthFormatted,
        currentPosition: state.media.currentPosition,
        currentTime: state.media.currentTime,
        audioFiles: state.media.audioFiles,
        screen: state.media.screen,
        buttonsActive: state.media.buttonsActive,
        showOverview: state.media.showOverview,
        showTextinput: state.media.showTextinput,
        volume: state.media.volume,
        trackDuration: state.media.trackDuration,
        totalLength: state.media.totalLength,
        stopped: state.media.stopped,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        store: media => {
            dispatch(storeMedia(media));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBar);
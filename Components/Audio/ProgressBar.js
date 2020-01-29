import React, { Component} from 'react';
//import { View, Text, Platform } from 'react-native'
import { connect } from 'react-redux';
//import { formatTime } from '../../Misc/helpers';
import Slider from '@react-native-community/slider';
import firebase from 'react-native-firebase';
import { styles } from './styles';
import { storeMedia } from '../../Actions/mediaFiles';

const Analytics = firebase.analytics();

class ProgressBar extends Component {

    componentDidUpdate(){
        let { trackDuration, audioFiles, currentlyPlaying, reached90, toggleReached90, currentTime/*, closeMiniPlayer*/} = this.props;
        let currentPosition = Math.floor(parseFloat(currentTime));
        const percentage = currentPosition/Math.floor(parseFloat(trackDuration)) * 100;
        if (percentage >= 90 && !reached90) {
            console.log(audioFiles[currentlyPlaying].title)
            Analytics.logEvent('tracks_completed', {tracks: audioFiles[currentlyPlaying].title});
            toggleReached90();
        }
        // if (currentPosition === trackDuration) closeMiniPlayer();
    }

    render() {
        let { trackDuration, currentTime, buttonsActive, dark } = this.props;
        let currentPosition = Math.floor(parseFloat(currentTime));
        return (
            <Slider
                style={styles.slider}
                value={currentPosition}
                maximumValue={trackDuration || 10}
                minimumValue={0}
                minimumTrackTintColor={dark ? '#212121' : '#D4D4D4'}
                maximumTrackTintColor={'#757575'}
                disabled={!buttonsActive}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedTrack: state.media.selectedTrack,
        currentlyPlaying: state.media.currentlyPlaying,
        paused: state.media.paused,
        totalLengthFormatted: state.media.totalLengthFormatted,
        currentPosition: state.media.currentPosition,
        currentTime: state.media.currentTime,
        isChanging: state.media.isChanging,
        audioFiles: state.media.audioFiles,
        screen: state.media.screen,
        buttonsActive: state.media.buttonsActive,
        showOverview: state.media.showOverview,
        showTextinput: state.media.showTextinput,
        volume: state.media.volume,
        trackDuration: state.media.trackDuration,
        totalLength: state.media.totalLength
    }
}

const mapDispatchToProps = dispatch => {
    return {
        store: (media) => {
            dispatch(storeMedia(media));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBar);
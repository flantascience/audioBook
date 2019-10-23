import React from 'react';
//import { View, Text, Platform } from 'react-native'
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
//import { formatTime } from '../../Misc/helpers';
import Slider from '@react-native-community/slider';
import { styles } from './styles';
import { storeMedia } from '../../Actions/mediaFiles';

class ProgressBar extends TrackPlayer.ProgressComponent {

    componentDidUpdate(){
        let { position } = this.state;
        let currentPosition = Math.floor(parseFloat(position));
        this.props.store({currentPosition, currentTime: currentPosition});
    }

    render() {
        let { position } = this.state;
        let currentPosition = Math.floor(parseFloat(position));
        let { trackDuration, buttonsActive } = this.props;
        return (
            <Slider
                style={styles.slider}
                value={currentPosition}
                onValueChange={(val) => {
                    //console.log(val)
                    let currentTime = Math.floor(parseFloat(val));
                    //console.log(val)
                    let newState = {
                        currentPosition: currentTime,
                        currentTime,
                        paused: false,
                    };
                    this.props.store(newState);
                    TrackPlayer.seekTo(val);
                }}
                maximumValue={trackDuration || 10}
                minimumValue={0}
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
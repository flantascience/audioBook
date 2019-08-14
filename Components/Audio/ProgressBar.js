import React from 'react';
import { View, Text } from 'react-native'
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import { formatTime } from '../../Misc/helpers';
import Slider from '@react-native-community/slider';
import { styles } from './styles';

class ProgressBar extends TrackPlayer.ProgressComponent {

    render() {
        let { position } = this.state;
        let currentPosition = Math.floor(parseFloat(position));
        let { trackDuration, audioFiles, selectedTrack, buttonsActive } = this.props;
        const remainingTime = parseFloat(trackDuration) - currentPosition;
        //console.log(trackDuration + " " + currentPosition)
        return (
            <View>
                <Slider 
                    style={ styles.slider }
                    value={ currentPosition }
                    onValueChange={ (val)=>{
                        let currentTime = Math.floor(parseFloat(val));
                        let newState = {
                            currentPosition,
                            currentTime,
                            paused: false,
                        };
                        this.props.store(newState);
                    } }
                    maximumValue={ trackDuration || 10 } 
                    minimumValue={ 0 } 
                    disabled = { !buttonsActive }
                />
                <View style={ styles.trackTimeCounterContainer}>
                    <View style= { styles.trackElapsedTime }>
                        <Text style={ styles.trackTime }>{ formatTime(currentPosition) }</Text>
                    </View>
                    <View style= { styles.trackRemainingTime}>
                        <Text style={ styles.trackTime }>{ "-" + formatTime(remainingTime) }</Text>
                    </View>
                </View>
            </View>
        );
    }  
}

const mapStateToProps = state => {
    return{
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
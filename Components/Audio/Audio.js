import React from 'react';
import Video from 'react-native-video';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    TouchableOpacity,
    View,
    Image,
    Text,
    TextInput,
    Platform,
    Button,
    ScrollView
} from 'react-native'; 
import { formatTime } from '../../Misc/helpers';
import { posterURL } from '../../Misc/Strings';
import Slider from '@react-native-community/slider';
import claps from '../Tracks/tracks/sample_claps.mp3';
import { storeMedia } from '../../Actions/mediaFiles';
import { styles } from './styles';
import VolumeUp from './images/volume_up.png';
import VolumeDown from './images/volume_down.png';


class Audio extends React.Component{

    static navigationOptions = ({navigation})=> ({
        headerLeft: <Header />,
        headerTitleStyle :{
            textAlign: 'center',
            justifyContent: 'center',
            color: '#FF6D00',
            alignItems: 'center'
        },
        headerStyle:{
            backgroundColor:'white',
            height: 80,
        },
    });

    initializeMediaState = (currentlyPlaying, pos)=>{
        //console.log(currentlyPlaying + " " + pos);
        let { paused } = this.props;
        return new Promise((resolve)=>{
            //console.log( currentlyPlaying );
            if( currentlyPlaying && currentlyPlaying !== pos){
                //console.log("first option");
                let newState = {
                    currentlyPlaying: pos,
                    selectedTrack: 0,
                    paused: true
                };
                this.props.store(newState);
                resolve('done');
            }else if( currentlyPlaying && currentlyPlaying === pos){
                //console.log("second option");
                let newState = {
                    /*currentlyPlaying: null,
                    selectedTrack: 0,
                    currentPosition: 0,*/
                    paused: !paused
                };
                this.props.store(newState);
            }else{
                //console.log("last option");
                resolve("not");
            }
        });
    }


    toggleTrack = (pos)=>{
        let { audioFiles, currentlyPlaying } = this.props;
        let name = audioFiles[pos].name;
        this.initializeMediaState(currentlyPlaying, pos).then(res=>{
            if(res==="done" || res==="not"){
                let newSate = {
                    paused: false,
                    loaded: true,
                    currentlyPlaying: pos,
                    selectedTrack: pos,
                    currentlyPlayingName: name,
                    showTextinput: false
                };
                this.props.store(newSate);
            }
        });
    }

    setInfo = (data)=>{
        //console.log(data.duration);
        let trackLength = Math.floor(data.duration);
        //let type = this.props.type;
        if(trackLength > 0){
            let newState = {
                totalLengthFormatted: formatTime(trackLength),
                totalLength: trackLength,
                paused: true
            };
            this.props.store(newState)
        }
    }

    setTime = (data)=>{
        //console.log(data);
        let currT = Math.floor(data.currentTime);
        let newState = {currentPosition: currT, currentTime: currT };
        this.props.store(newState);
    }

    seek = (nextTime)=>{
        let time = Math.floor(Math.round(nextTime));
        let { totalLength, currentTime } = this.props;
        let newPos = parseFloat(parseInt(currentTime) + parseInt(time));
        newPos = newPos <= totalLength && newPos > 0?newPos:currentTime;
        this.refs.audioElement && this.refs.audioElement.seek(time);
        let newState = {
            currentPosition: newPos,
            currentTime: newPos,
            paused: newPos <= totalLength?false:true,
        };
        this.props.store(newState);
    }

    videoError = (err) =>{
        console.log(err)
        console.log("there was an error")
    }

    onEnd = ()=>{
        let newState = {
            paused: true,
            currentPosition: 0,
            currentTime: 0,
            showTextinput: true
        };
        this.props.store(newState);
    }

    loadStart = ()=>{

    }

    toggleOverview = ()=>{
        const { showOverview } = this.props;
        let newShowOverview = !showOverview;
        this.props.store({ showOverview: newShowOverview });
    }

    render(){
        let {
            audioSource,
            audioFiles,
            style,
            currentlyPlayingName,
            initCurrentlyPlaying,
            pos,
            currentPosition,
            currentTime,
            currentlyPlaying,
            paused,
            selectedTrack,
            repeatOn,
            isChanging,
            buttonsActive,
            showOverview,
            showTextinput,
            volume,
        } = this.props;
        /** End reconfigure */
        //issue with pause button
        selectedTrack = pos !== selectedTrack?pos:selectedTrack;
        let type = selectedTrack?audioFiles[selectedTrack].type:"local";
        let playIcon = initCurrentlyPlaying && currentPosition && !paused?
        "pause":
        currentlyPlaying !== selectedTrack || paused?
        type === "local"?
        "play-circle":
        "cloud-download":
        "pause";
        let trackDuration = selectedTrack?audioFiles[selectedTrack].duration:"";
        const remainingTime = ( trackDuration - currentPosition );

        const trackTimeSlider = <View style={ showOverview?styles.altTrackTimeContainer:styles.trackTimeContainer }>
            <Slider 
                style={ styles.slider }
                value={ parseInt(currentPosition) }
                onValueChange={ (val)=>{
                    let time = Math.floor(parseFloat(val));
                    console.log(time)
                    this.refs.audioElement && this.refs.audioElement.seek(time);
                    let newState = {
                        currentPosition: time,
                        currentTime: time,
                        paused: false,
                    };
                    this.props.store(newState);
                } }
                maximumValue={ parseInt(trackDuration) || 10 } 
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
        const volumeRocker = <View style={ styles.volumeContainer }>
                <Slider 
                    style={ styles.volumeSlider }
                    value={ parseFloat(volume) }
                    onValueChange={ (val)=>{
                        let newSate = {
                            volume: val
                        }
                        this.props.store(newSate);
                    } }
                    maximumValue={ 1 } 
                    minimumValue={ 0 }
                />
                <View style={ styles.volumeImagesContainer}>
                    <View style= { styles.volumeDown }>
                        <Image style = { styles.volumeImage } source={ VolumeDown } />
                    </View>
                    <View style= { styles.volumeUp}>
                        <Image style = { styles.volumeImage }  source={ VolumeUp } />
                    </View>
                </View>
            </View>
        return(
            <View style={ style }>
                { showOverview?trackTimeSlider:null }
                { !currentlyPlaying && isChanging?
                    null:
                    <View style={ showOverview?styles.altContiner:styles.container }>
                        <View style={ showOverview?styles.altControllerContainer:styles.controllerContainer }>
                            { !showOverview?
                                <TouchableOpacity 
                                    disabled={ !buttonsActive } 
                                    onPress={ this.toggleOverview } 
                                    style={ styles.toggleTrackDetail }
                                >
                                    <Icon
                                        name={ `ios-arrow-up`}
                                        size={ 30 }
                                    />
                                </TouchableOpacity>: 
                            null }
                            <View style={ showOverview?styles.altTextDisplay:styles.textDisplay }>
                                <Text style={ showOverview?styles.altAudioTitle:styles.audioTitle }>
                                    { currentlyPlayingName || "Select Track" }
                                </Text>
                            </View>
                            <View style={ showOverview?styles.altButtonGroup:styles.buttonGroup }>
                                <TouchableOpacity 
                                    onPress = { ()=>this.seek(parseFloat(-10))} 
                                    disabled={ !buttonsActive } 
                                    style={ styles.altGroupedButtons }
                                >
                                    <Icon
                                        name={ `ios-refresh` }
                                        size={ !showOverview?25:35 }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity  
                                    disabled={ !buttonsActive }  
                                    style={ styles.groupedButtons } 
                                    onPress={ selectedTrack?()=>this.toggleTrack(selectedTrack):()=>{} }
                                >
                                    <Icon
                                        name={ Platform.OS === "ios" ? `ios-${playIcon}` : `md-${playIcon}`}
                                        size={ !showOverview?25:35 }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress = { ()=>this.seek(parseFloat(15)) } 
                                    disabled={ !buttonsActive }  
                                    style={ styles.groupedButtons }
                                >
                                    <Icon
                                        name={ `ios-refresh` }
                                        size={ !showOverview?25:35 }
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        { showOverview?volumeRocker:trackTimeSlider }
                        <Video source={ audioSource || claps } // Can be a URL or a local file.
                            paused={ paused } // Pauses playback entirely.
                            resizeMode="cover" // Fill the whole screen at aspect ratio.
                            repeat={ repeatOn }
                            audioOnly = { false }
                            poster= { posterURL }
                            seekTime = { currentPosition }
                            currentTime = { currentTime }
                            playInBackground={ true } // Repeat forever.
                            onLoadStart={ this.onLoadStart } // Callback when video starts to load
                            onLoad={ this.setInfo } // Callback when video loads
                            onProgress={ this.setTime } // Callback every ~250ms with currentTime
                            onEnd={ this.onEnd } // Callback when playback finishes
                            onError={ this.onError } // Callback when video cannot be loaded
                            volume={ volume }
                        />
                    </View>
                    }
                    <View style = { showOverview && !showTextinput?styles.spaceFiller:styles.altSpaceFiller }></View>
                    { showTextinput?
                        <ScrollView>
                            <TextInput
                                style={ styles.questionareText}
                                placeholder={"Was anything confusing?"}
                            />
                            <TextInput
                                style={ styles.questionareText}
                                placeholder={"Do you have any questions?"}
                            />
                            <Button title={ "Submit" } />
                        </ScrollView>:
                    null }
            </View>
        )
    }
}

Audio.defaultProps = {
    audioSource: claps
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
      totalLength: state.media.totalLength,
      volume: state.media.volume
    }
}

const mapDispatchToProps = dispatch => {
    return {
      store: (media) => {
        dispatch(storeMedia(media));
      }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Audio);
import React from 'react';
import TrackPlayer from 'react-native-track-player';
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
import { 
    formatTime, 
    getCurrentTrack, 
    getTrack, 
    getPlayerState,
    removeTrack
} from '../../Misc/helpers';
import { posterURL } from '../../Misc/Strings';
import Slider from '@react-native-community/slider';
import claps from '../Tracks/tracks/sample_claps.mp3';
import { storeMedia } from '../../Actions/mediaFiles';
import { styles } from './styles';
import VolumeUp from './images/volume_up.png';
import VolumeDown from './images/volume_down.png';
import ProgressBar from './ProgressBar';


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

    toggleTrack = (pos)=>{
        //console.log(currentlyPlaying + " " + pos);
        let { audioFiles, paused, currentlyPlaying, currentPosition, trackDuration } = this.props;
        let title = audioFiles[pos].title;
        return new Promise((resolve)=>{
            //console.log( currentlyPlaying );
            if( currentlyPlaying && currentlyPlaying !== pos){
                //console.log("first option");
                removeTrack().then(()=>{
                    let stringPos = pos.toString();
                    TrackPlayer.add([audioFiles[pos]]).then(()=>{
                        let newState = {
                            paused: false,
                            loaded: true,
                            currentlyPlaying: pos,
                            selectedTrack: pos,
                            selectedTrackId: stringPos,
                            currentlyPlayingName: title,
                            showTextinput: false
                        };
                        this.props.store(newState);
                        let ready = TrackPlayer.STATE_READY;
                        console.log(ready);
                        TrackPlayer.play();
                        resolve('done');
                    })
                    
                }); 
            }else if( currentlyPlaying && currentlyPlaying === pos){
                let tpos = parseFloat(currentPosition);
                let tdur = parseFloat(trackDuration);
                //console.log(tpos + " " + tdur)
               if( tpos === tdur){
                    removeTrack().then(()=>{
                        let stringPos = pos.toString();
                        TrackPlayer.add([audioFiles[pos]]).then(()=>{
                            let newState = {
                                /*currentlyPlaying: null,
                                selectedTrack: 0,*/
                                currentlyPlaying: pos,
                                selectedTrack: pos,
                                selectedTrackId: stringPos,
                                currentlyPlayingName: title,
                                showTextinput: false,
                                paused: false,
                                loaded: true
                            };
                            this.props.store(newState);
                            TrackPlayer.play();
                        });
                    });
               }else{
                   let newState = {
                        paused: !paused
                    };
                    this.props.store(newState);
                    if(paused)
                        TrackPlayer.play();
                    else
                        TrackPlayer.pause();
               }
                resolve("same");
            }else{
                let stringPos = pos.toString();
                let newSate = {
                    paused: false,
                    loaded: true,
                    currentlyPlaying: pos,
                    selectedTrack: pos,
                    selectedTrackId: stringPos,
                    currentlyPlayingName: title,
                    showTextinput: false
                };
                TrackPlayer.play();
                resolve("not");
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

    getTime = async ()=>{
        //console.log(data);
        let currentTime = await TrackPlayer.getPosition();
        return currentTime;
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
            loaded
        } = this.props;
        /** End reconfigure */
        //issue with pause button
        //console.log(loaded)
        selectedTrack = pos !== selectedTrack?pos:selectedTrack;
        let type = selectedTrack?audioFiles[selectedTrack].type:"local";
        let playIcon = "play-circle";
        if(!initCurrentlyPlaying && paused && !loaded && type==="local"){
            playIcon = "play-circle"
        }else if(!initCurrentlyPlaying && paused && !loaded && type==="cloud"){
            playIcon = "cloud-download"
        }else if(paused && loaded){
            playIcon = "play-circle";
        }else if(!paused && loaded){
            playIcon = "pause"
        }
        let trackDuration = selectedTrack?audioFiles[selectedTrack].duration:"";
        const remainingTime = ( trackDuration - currentPosition );

        const trackTimeSlider = <View style={ showOverview?styles.altTrackTimeContainer:styles.trackTimeContainer }>
                <ProgressBar />
            </View>
        const volumeRocker = <View style={ styles.volumeContainer }>
                <Slider 
                    style={ styles.volumeSlider }
                    value={ parseFloat(volume) }
                    onValueChange={ (val)=>{
                        TrackPlayer.setVolume(val);
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
                                    onPress = { ()=>{
                                        TrackPlayer.getPosition().then(res=>{
                                            let newPos = res + parseFloat(-10);
                                            let newState = {
                                                currentPosition: newPos,
                                                currentTime: newPos
                                            };
                                            this.props.store(newState);
                                            TrackPlayer.seekTo(newPos);
                                        });
                                     }} 
                                    disabled={ !buttonsActive }
                                    style={ styles.altGroupedButtons } 
                                >
                                    <Icon
                                        style={ styles.reflection }
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
                                    onPress = { ()=>{
                                        TrackPlayer.getPosition().then(res=>{
                                            let newPos = res + parseFloat(15);
                                            let newState = {
                                                currentPosition: newPos,
                                                currentTime: newPos
                                            };
                                            this.props.store(newState);
                                            TrackPlayer.seekTo(newPos);
                                        });
                                     } } 
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
      volume: state.media.volume,
      loaded: state.media.loaded,
      trackDuration: state.media.trackDuration
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
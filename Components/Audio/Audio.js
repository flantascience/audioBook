import React from 'react';
import Video from 'react-native-video';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons'
import {
    TouchableOpacity,
    View,
    Text,
    Platform
} from 'react-native';
import Slider from '@react-native-community/slider';
import claps from '../Tracks/tracks/sample_claps.mp3';
import { storeMedia } from '../../Actions/mediaFiles';
import { styles } from './styles';


class Audio extends React.Component{

    fetchFiles = ()=>{
        return new Promise((resolve, reject)=>{
          let audioFiles = storageRef.child('/audioFiles');
          audioFiles.list().then(res=>{
            resolve(res);
          }).catch(err=>{
            reject(err);
          });
        });
    }

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
                    currentlyPlayingName: name
                };
                this.props.store(newSate);
            }
        });
    }

    setInfo = (data)=>{
        // console.log(totalLength);
        let trackLength = Math.floor(data.duration);
        let type = this.props.type;
        if(type !== "local"){
            let newState = {
                totalLength: trackLength,
                paused: true
            };
            this.props.store(newState)
        }
    }

    setTime = (data)=>{
        //console.log(data);
        let newState = {currentPosition: Math.floor(data.currentTime)};
        this.props.store(newState);
    }

    seek = (time)=>{
        time = Math.round(time);
        this.refs.audioElement && this.refs.audioElement.seek(time);
        let newState = {
            currentPosition: time,
            paused: false,
        };
        this.props.store(newState)
    }

    onBack = ()=> {
        let { currentPosition, selectedTrack } = this.props;
        if (currentPosition < 10 && selectedTrack > 0) {
            this.refs.audioElement && this.refs.audioElement.seek(0);
            let newState = { isChanging: true };
            this.props.store(newState);
            setTimeout(() => {
                let newSate = {
                    currentPosition: 0,
                    paused: false,
                    totalLength: 1,
                    isChanging: false,
                    selectedTrack: selectedTrack - 1,
                };
                this.props.store(newSate);
            }
            , 0);
        } else {
            this.refs.audioElement.seek(0);
            let newSate = {
                currentPosition: 0,
            };
            this.props.store(newSate);
        }
    }

    onForward = ()=> {
        let { selectedTrack, tracks } = this.props;
        if ( selectedTrack < tracks.length - 1) {
            this.refs.audioElement && this.refs.audioElement.seek(0);
            let newState = { isChanging: true };
            this.props.store(newState)
            setTimeout(() => {
                let newState = {
                    currentPosition: 0,
                    totalLength: 1,
                    paused: false,
                    isChanging: false,
                    selectedTrack: selectedTrack + 1,
                }
                this.props.store(newState);
            }, 0);
        }
    }

    videoError = (err) =>{
        console.log(err)
        console.log("there was an error")
    }

    onEnd = ()=>{
        let newState = {
            paused: false,
            currentlyPlaying: null,
            selectedTrack: 0,
            currentlyPlayingName: null
        };
        this.props.store(newState);
    }

    loadStart = ()=>{

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
            currentlyPlaying,
            paused,
            selectedTrack,
            repeatOn,
            isChanging,
            buttonsActive
        } = this.props;
        console.log(buttonsActive)
        /** End reconfigure */
        //issue with pause button
        selectedTrack = pos !== selectedTrack?pos:selectedTrack;
        let type = selectedTrack?audioFiles[selectedTrack].type:"local";
        let playIcon = initCurrentlyPlaying && currentPosition && !paused ?"pause":currentlyPlaying !== selectedTrack || paused?type === "local"?"play-circle":"cloud-download":"pause";
        let trackDuration = selectedTrack?audioFiles[selectedTrack].duration:"";
        return(
            <View style={ style }>
                { !currentlyPlaying && isChanging?
                    null:
                    <View style={ styles.container }>
                        <View style={ styles.controllerContainer }>
                            <TouchableOpacity style={ styles.toggleTrackDetail }>
                                <Icon
                                    name={ `ios-arrow-up`}
                                    size={ 30 }
                                />
                            </TouchableOpacity>
                            <View style={ styles.textDisplay }>
                                <Text>{ currentlyPlayingName || "Select Track" }</Text>
                                <Text>{ trackDuration }</Text>
                            </View>
                            <View style={ styles.buttonGroup }>
                                <TouchableOpacity disabled={ !buttonsActive } style={ styles.groupedButtons }>
                                    <Icon
                                        name={ Platform.OS === "ios" ? `ios-rewind` : `md-rewind`}
                                        size={ 25 }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity  disabled={ !buttonsActive }  style={ styles.groupedButtons } onPress={ selectedTrack?()=>this.toggleTrack(selectedTrack):()=>{} }>
                                    <Icon
                                        name={ Platform.OS === "ios" ? `ios-${playIcon}` : `md-${playIcon}`}
                                        size={ 25 }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity  disabled={ !buttonsActive }  style={ styles.groupedButtons }>
                                    <Icon
                                        name={ Platform.OS === "ios" ? `ios-fastforward` : `md-fastforward`}
                                        size={ 25 }
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Slider 
                            style={ styles.slider }
                            value={ parseInt(currentPosition) } 
                            step= { 1 }
                            maximumValue={ parseInt(trackDuration) || 10 } 
                            minimumValue={ 0 } 
                            disabled = { !buttonsActive }
                        />
                        <Video source={ audioSource || claps } // Can be a URL or a local file.
                            paused={ paused } // Pauses playback entirely.
                            resizeMode="cover" // Fill the whole screen at aspect ratio.
                            repeat={ repeatOn }
                            audioOnly = { true }
                            playInBackground={ true } // Repeat forever.
                            onLoadStart={ this.onLoadStart } // Callback when video starts to load
                            onLoad={ this.setInfo } // Callback when video loads
                            onProgress={ this.setTime } // Callback every ~250ms with currentTime
                            onEnd={ this.onEnd } // Callback when playback finishes
                            onError={ this.onError } // Callback when video cannot be loaded
                        />
                    </View>
                    }
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
      totalLength: state.media.totalLength,
      currentPosition: state.media.currentPosition,
      currentTime: state.media.currentTime,
      isChanging: state.media.isChanging,
      audioFiles: state.media.audioFiles,
      screen: state.media.screen,
      buttonsActive: state.media.buttonsActive
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
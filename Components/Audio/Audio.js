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
import claps from '../Tracks/tracks/sample_claps.mp3';
import { styles } from './styles';


class Audio extends React.Component{

    constructor(){
        super();
        this.state = { ...this.props }
    }

    componentwWillReceiveProps(nextProps){
        this.props = { ...nextProps }
        this.forceUpdate();
    }

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
        return new Promise((resolve)=>{
            //console.log( currentlyPlaying );
            if( currentlyPlaying && currentlyPlaying !== pos){
                //console.log("first option");
                this.setState({
                    currentlyPlaying: pos,
                    selectedTrack: 0,
                    paused: true
                });
                this.forceUpdate();
                resolve('done');
            }else if( currentlyPlaying && currentlyPlaying === pos){
                //console.log("second option");
                this.setState({
                    currentlyPlaying: null,
                    selectedTrack: 0,
                    paused: true
                });
                resolve('playing');
            }else{
                //console.log("last option");
                resolve("not");
            }
        });
    }


    toggleTrack = (pos)=>{
        let { audioFiles } = this.props;
        let { currentlyPlaying } = this.state;
        let name = audioFiles[pos].name;
        this.initializeMediaState(currentlyPlaying, pos).then(res=>{
            if(res==="done" || res==="not"){
            this.setState({
                paused: false,
                loaded: true,
                currentlyPlaying: pos,
                selectedTrack: pos,
                currentlyPlayingName: name
            });
            }
        });
    }

    setInfo = (data)=>{
        // console.log(totalLength);
        let trackLength = Math.floor(data.duration);
        let type = this.props.type;
        if(type !== "local")
            this.setState({
                totalLength: trackLength,
                paused: true
            });
    }

    setTime = (data)=>{
        //console.log(data);
        this.setState({currentPosition: Math.floor(data.currentTime)});
    }

    seek = (time)=>{
        time = Math.round(time);
        this.refs.audioElement && this.refs.audioElement.seek(time);
        this.setState({
            currentPosition: time,
            paused: false,
        });
    }

    onBack = ()=> {
        if (this.state.currentPosition < 10 && this.state.selectedTrack > 0) {
            this.refs.audioElement && this.refs.audioElement.seek(0);
            this.setState({ isChanging: true });
            setTimeout(() => this.setState({
            currentPosition: 0,
            paused: false,
            totalLength: 1,
            isChanging: false,
            selectedTrack: this.state.selectedTrack - 1,
            }), 0);
        } else {
            this.refs.audioElement.seek(0);
            this.setState({
            currentPosition: 0,
            });
        }
    }

    onForward = ()=> {
        if (this.state.selectedTrack < this.props.tracks.length - 1) {
            this.refs.audioElement && this.refs.audioElement.seek(0);
            this.setState({ isChanging: true });
            setTimeout(() => this.setState({
            currentPosition: 0,
            totalLength: 1,
            paused: false,
            isChanging: false,
            selectedTrack: this.state.selectedTrack + 1,
            }), 0);
        }
    }

    videoError = (err) =>{
        console.log(err)
        console.log("there was an error")
    }

    onEnd = ()=>{
        this.setState({
            paused: false,
            currentlyPlaying: null,
            selectedTrack: 0,
            currentlyPlayingName: null
        });
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
        } = this.props;

        let{
            currentPosition,
            currentlyPlaying,
            paused,
            selectedTrack,
            repeatOn,
            isChanging
        } = this.state;
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
                                <TouchableOpacity style={ styles.groupedButtons }>
                                    <Icon
                                        name={ Platform.OS === "ios" ? `ios-rewind` : `md-rewind`}
                                        size={ 25 }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={ styles.groupedButtons } onPress={ selectedTrack?()=>this.toggleTrack(selectedTrack):()=>{} }>
                                    <Icon
                                        name={ Platform.OS === "ios" ? `ios-${playIcon}` : `md-${playIcon}`}
                                        size={ 25 }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={ styles.groupedButtons }>
                                    <Icon
                                        name={ Platform.OS === "ios" ? `ios-fastforward` : `md-fastforward`}
                                        size={ 25 }
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
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
      selectedTrack: state.selectedTrack,
      currentlyPlaying: state.currentlyPlaying,
      paused: state.paused,
      totalLength: state.totalLength,
      currentPosition: state.currentPosition,
      currentTime: state.currentTime,
      isChanging: state.isChanging
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
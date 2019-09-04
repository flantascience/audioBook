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
import Toast from '../../Components/Toast/Toast';
import { posterURL } from '../../Misc/Strings';
import firebase from 'react-native-firebase';
import Slider from '@react-native-community/slider';
import claps from '../Tracks/tracks/sample_claps.mp3';
import { storeMedia } from '../../Actions/mediaFiles';
import { styles } from './styles';
import VolumeUp from './images/volume_up.png';
import VolumeDown from './images/volume_down.png';
import ProgressBar from './ProgressBar';
import poster from '../../Misc/media/part2-unschooling.jpg';
import InputScrollView from 'react-native-input-scroll-view';

const dbRef = firebase.database().ref("/questionnaire");

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
                        //console.log(ready);
                        TrackPlayer.play();
                        resolve('done');
                    })
                    
                }); 
            }else if( currentlyPlaying && currentlyPlaying === pos){
                let tpos = parseFloat(currentPosition);
                let tdur = parseFloat(trackDuration);
                //console.log("just pause")
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
                    if(paused){
                        let newState = {
                            paused: false
                        };
                        this.props.store(newState);
                        TrackPlayer.play();
                    }    
                    else{
                        let newState = {
                            paused: true
                        };
                        this.props.store(newState);
                        TrackPlayer.pause();
                        //TrackPlayer.stop()
                    }      
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
        const { showOverview, screen, hideMenu } = this.props;
        let newShowOverview = !showOverview;
        this.props.store({ showOverview: newShowOverview, screen: "Tracks" });
        //this.props.store({hideMenu: !hideMenu}); 
        if(screen !== "Tracks")
            this.goToTracks();
    }

    goToTracks = ()=>{
        let { navigate } = this.props;
        navigate("Second");
    }

    sendQuestionnaire = ()=>{
        let { questionnaire, currentlyPlayingName } = this.props;
        //console.log(currentlyPlayingName);
        questionnaire.trackName = currentlyPlayingName;
        if(questionnaire.confusing || questionnaire.question){
            dbRef.push(questionnaire).then(res=>{
                let showToast = true;
                this.props.store({showToast, toastText: "Your questions were successfully sent." });
                setTimeout(()=>{
                    this.props.store({
                        showToast: !showToast, 
                        toastText: null, 
                        showTextinput: false, 
                        questionnaire: { confusing: null, question: null } 
                    });
                }, 1000);
            }).catch(err=>{
                let showToast = true;
                this.props.store({showToast, toastText: "Something went wront, try again!" });
                setTimeout(()=>{
                this.props.store({showToast: !showToast, toastText: null });
                }, 1000);
                console.log(err);
            });
        }else{
            let showToast = true;
            this.props.store({showToast, toastText: "Fill in a question first!" });
            setTimeout(()=>{
              this.props.store({showToast: !showToast, toastText: null });
            }, 1000);
        }
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
            loaded,
            showToast,
            toastText
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

        const trackTimeSlider = <View style={ styles.trackTimeContainer }>
                <ProgressBar />
                { Platform.OS ==="ios"?
                <View style={ { display: "flex", flexDirection: "row", marginTop: 20} }>
                    <Text style={ { flex: 1, justifyContent: "flex-start", textAlign: "left" } }>{ formatTime(currentPosition) }</Text>
                    <Text style={ { flex: 1, justifyContent: "flex-end", textAlign: "right" } }>{ "-" + formatTime(remainingTime) }</Text>
                </View>:
                <View style={ styles.trackTimeCounterContainer}>
                    <View style= { styles.trackElapsedTime }>
                        <Text style={ styles.trackTime }>{ formatTime(currentPosition) }</Text>
                    </View>
                    <View style= { styles.trackRemainingTime}>
                        <Text style={ styles.trackTime }>{ "-" + formatTime(remainingTime) }</Text>
                    </View>
                </View> }
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
            <View style={ styles.elContainer }>
                <View style={ style }>
                    { !currentlyPlaying && isChanging?
                        null:
                        <View  style={ styles.container }>
                            <View style={ styles.controllerContainer }>
                                <View onTouchEnd={ this.toggleOverview } style={ styles.textDisplay }>
                                    <Text style={ styles.audioTitle }>
                                        { currentlyPlayingName || "Select Track" }
                                    </Text>
                                </View>
                                <View style={ styles.buttonGroup }>
                                    <TouchableOpacity 
                                        onPress = { ()=>{
                                            TrackPlayer.getPosition().then(res=>{
                                                let newPos = res + parseFloat(-15);
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
                                            size={ 25 }
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity  
                                        disabled={ !buttonsActive }  
                                        style={ styles.groupedButtons } 
                                        onPress={ selectedTrack?()=>this.toggleTrack(selectedTrack):()=>{} }
                                    >
                                        <Icon
                                            name={ Platform.OS === "ios" ? `ios-${playIcon}` : `md-${playIcon}`}
                                            size={ 25 }
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
                                            size={ 25 }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            { trackTimeSlider }
                        </View>
                        }
                        { /*showOverview?<View style = { styles.spaceFiller }></View>:null*/}
                        { showOverview?
                        <View style={ styles.textContainer } >
                            { showToast?
                                <Toast text={ toastText } />:
                            null }
                            <View style = { styles.textScrollView }>
                                <TextInput
                                    id="confusing"
                                    style={ styles.questionareText}
                                    placeholder={"Was anything confusing?"}
                                    onChangeText={ (text) =>{
                                        let questionnaire = {...this.props.questionnaire};
                                        questionnaire.confusing = text;
                                        this.props.store({ questionnaire });
                                        /*let questionnaire = {}
                                        this.props.store({})*/
                                    } }
                                />
                                <TextInput
                                    id="question"
                                    style={ styles.questionareText}
                                    placeholder={"Do you have any questions?"}
                                    onChangeText={
                                        (text) =>{
                                            let questionnaire = {...this.props.questionnaire};
                                            questionnaire.question = text;
                                            this.props.store({ questionnaire });
                                            /*let questionnaire = {}
                                            this.props.store({})*/
                                        }
                                    }
                                />
                                <View style = { Platform.OS === "ios"?styles.altButtonContainer:styles.buttonContainer }>
                                    <Button
                                        color={ Platform.OS === "android"?'#349DD3':'#fff' } 
                                        title={ "Submit" }
                                        onPress={ this.sendQuestionnaire } 
                                    />
                                </View>
                            </View>
                        </View>:
                    null }
                </View>
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
      currentlyPlayingName: state.media.currentlyPlayingName,
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
      trackDuration: state.media.trackDuration,
      questionnaire: state.media.questionnaire,
      showToast: state.media.showToast,
      toastText: state.media.toastText,
      hideMenu: state.media.hideMenu
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
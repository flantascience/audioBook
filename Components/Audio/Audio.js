import React from 'react';
import TrackPlayer from 'react-native-track-player';
//import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    TouchableOpacity,
    View,
    Text,
    Platform,
    ScrollView
} from 'react-native'; 
import { 
    formatTime, 
    removeTrack
} from '../../Misc/helpers';
import Toast from '../../Components/Toast/Toast';
//import { posterURL } from '../../Misc/Strings';
import firebase from 'react-native-firebase';
//import Slider from '@react-native-community/slider';
import claps from '../Tracks/tracks/sample_claps.mp3';
import { storeMedia, changeQuestionnaireVew } from '../../Actions/mediaFiles';
import { changeRefsView } from '../../Actions/references';
import { styles } from './styles';
//import VolumeUp from './images/volume_up.png';
//import VolumeDown from './images/volume_down.png';
import { audioOverview } from '../../Misc/Strings';
import Questionnaire from './Questionnaire';
import ProgressBar from './ProgressBar';
//import poster from '../../Misc/media/part2-unschooling.jpg';
import Refs from './Refs';
//import InputScrollView from 'react-native-input-scroll-view';

const dbRef = firebase.database().ref("/questionnaire");
const Analytics = firebase.analytics();

class Audio extends React.Component{
    state = {
        lastTrackId: null,
        reached90: false
    }

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

    componentDidMount(){
        let { audioFiles } = this.props;
        this.props.store({ showToast: false, toastText: null });
        let newAudioFiles = [...audioFiles];
        let lastTrackId = (newAudioFiles.pop()).id;
        this.setState({lastTrackId});

        TrackPlayer.addEventListener('remote-jump-backward', async ()=> {
            TrackPlayer.getPosition().then(res=>{
                let newPos = res + parseFloat(-15);
                let newState = {
                    currentPosition: newPos,
                    currentTime: newPos
                };
                this.props.store(newState);
                TrackPlayer.seekTo(newPos);
            });
          });

          TrackPlayer.addEventListener('remote-jump-forward', async ()=> {
            TrackPlayer.getPosition().then(res=>{
                let newPos = res + parseFloat(15);
                let newState = {
                    currentPosition: newPos,
                    currentTime: newPos
                };
                this.props.store(newState);
                TrackPlayer.seekTo(newPos);
            });
          });
    }

    toggleTrack = (pos)=>{
        //console.log(currentlyPlaying + " " + pos);
        let { audioFiles, paused, currentlyPlaying, currentPosition, trackDuration, updateShowRefs } = this.props;
        let title = audioFiles[pos].title;
        return new Promise((resolve)=>{
            if( currentlyPlaying !== undefined && currentlyPlaying !== null && parseInt(currentlyPlaying) !== parseInt(pos)){
                //console.log("first option");
                updateShowRefs(false);
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
                        Analytics.logEvent('tracks_played', {tracks: title});
                        TrackPlayer.play();
                        resolve('done');
                    })
                    
                }); 
            }else if( currentlyPlaying !== undefined && currentlyPlaying !== null && parseInt(currentlyPlaying) === parseInt(pos)){
                let tpos = Math.floor(parseFloat(currentPosition));
                let tdur = Math.floor(parseFloat(trackDuration));
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
                    }else{
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
                //console.log("other")
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
        const { showOverview, screen } = this.props;
        let newShowOverview = !showOverview;
        this.props.store({ showOverview: newShowOverview, screen: "Tracks" });
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
        Analytics.logEvent('select_content', {submittedQuestionnaire: currentlyPlayingName});
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
                        questionnaire: { confusing: null, question: null, comment:null } 
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

    toggleReferencesView = () => {
        let { showRefs } = this.props;
        let newVal = !showRefs;
        this.props.updateShowRefs(newVal);
    }

    toggleQuestionnaireView = () => {
        let { showQuestionnaire } = this.props;
        let newVal = !showQuestionnaire;
        this.props.updateShowQuestionnaire(newVal);
    }

    toggleReached90 = () => {
        this.setState({reached90: !this.state.reached90});
    }

    closeMiniPlayer = () => {
        TrackPlayer.stop();
        this.props.store({
            selectedTrack: null,
            currentlyPlaying: null,
            loaded: false,
            showOverview: false,
            currentPosition: 0
        });
    }

    render(){
        let { lastTrackId, reached90 } = this.state;
        let {
            audioFiles,
            referencesInfo = [],
            style,
            currentlyPlayingName,
            pos,
            currentPosition,
            currentlyPlaying,
            paused,
            selectedTrack,
            isChanging,
            buttonsActive,
            showOverview,
            loaded,
            showToast,
            toastText,
            questionnaire: {
                confusing,
                question,
                comment
            },
            showQuestionnaire
        } = this.props;
        /** End reconfigure */
        let { confusing1, otherQuestion1, confusingFinal, otherQuestionFinal, titleText, anythingElse } = audioOverview;
        //issue with pause button
        let realConfusing = lastTrackId === currentlyPlaying?confusingFinal:confusing1;
        let realOtherQuestion = lastTrackId === currentlyPlaying?otherQuestionFinal:otherQuestion1;
        /**Input text config */
        let multiLine = lastTrackId === currentlyPlaying?true:false;
        //console.log(loaded)
        selectedTrack = pos !== selectedTrack?pos:selectedTrack;
        let playIcon = "play-circle";
        if(!currentlyPlayingName && paused && !loaded){
            playIcon = "play-circle"
        }else if(paused && loaded){
            playIcon = "play-circle";
        }else if(!paused && loaded){
            playIcon = "pause"
        }
        let trackDuration = selectedTrack? audioFiles[selectedTrack].duration: "";
        let remainingTime = ( trackDuration - currentPosition );

        const trackTimeSlider = <View style={ styles.trackTimeContainer }>
                <ProgressBar closeMiniPlayer={this.closeMiniPlayer} toggleReached90={this.toggleReached90} reached90={reached90} />
                { Platform.OS ==="ios"?
                <View style={ { display: "flex", flexDirection: "row", marginTop: 20} }>
                    <Text style={ { flex: 1, justifyContent: "flex-start", textAlign: "left" } }>{ formatTime(currentPosition) }</Text>
                    <Text style={ { flex: 1, justifyContent: "flex-end", textAlign: "right" } }>{ "-" + formatTime(remainingTime) }</Text>
                </View>:
                <View style={ styles.trackTimeCounterContainer }>
                    <View style= { styles.trackElapsedTime }>
                        <Text style={ styles.trackTime }>{ formatTime(currentPosition) }</Text>
                    </View>
                    <View style= { styles.trackRemainingTime}>
                        <Text style={ styles.trackTime }>{ "-" + formatTime(remainingTime) }</Text>
                    </View>
                </View> }
            </View>;
        return(
            <View style={ styles.elContainer }>
                { showOverview?
                <ScrollView style={{height: 300}}>
                    <View style={ style }>
                        { !currentlyPlaying && isChanging?
                        null:
                        <View  style={ styles.altContiner }>
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
                        <View style={ styles.textContainer } >
                            { showToast?
                                <Toast text={ toastText } />:
                            null }
                            <TouchableOpacity style={ styles.refsAccordionHeader } onPress = { this.toggleQuestionnaireView } >
                                <Text style={{ flex: 8, zIndex: 0, textAlign: "center", fontWeight: "bold" }}>Give Feedback on This Track</Text>
                                <Icon style={{ flex:1, zIndex: 1 }} name="ios-arrow-dropdown" size={25} />
                            </TouchableOpacity>
                            { showQuestionnaire? <Questionnaire
                                store = { this.props.store }
                                styles = { styles }
                                multiLine = { multiLine }
                                confusing = { confusing }
                                realConfusing = { realConfusing }
                                realOtherQuestion = { realOtherQuestion }
                                question = { question }
                                titleText = { titleText }
                                comment = { comment }
                                anythingElse = { anythingElse }
                                questionnaire = { this.props.questionnaire }
                                sendQuestionnaire = { this.sendQuestionnaire }
                            />: null }
                            <TouchableOpacity style={ styles.refsAccordionHeader } onPress = { this.toggleReferencesView } >
                                <Text style={{ flex: 8, zIndex: 0, textAlign: "center", fontWeight: "bold" }}>References and Links</Text>
                                <Icon style={{ flex:1, zIndex: 1 }} name="ios-arrow-dropdown" size={25} />
                            </TouchableOpacity>
                            <Refs styles={ styles } referencesInfo={ referencesInfo } {...this.props} />
                        </View>
                    </View>
                </ScrollView>:
                <View style={ style }>
                    { !currentlyPlaying && isChanging?
                        null:
                        <View  style={ styles.container }>
                            <TouchableOpacity style={ styles.closePlayerContainer } onPress={this.closeMiniPlayer}>
                                <Text style={ styles.closePlayer }>X</Text>
                            </TouchableOpacity>
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
                            <View style = { styles.spaceFiller }></View>
                        </View>
                        }
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
      currentlyPlayingName: state.media.currentlyPlayingName,
      paused: state.media.paused,
      totalLengthFormatted: state.media.totalLengthFormatted,
      currentPosition: state.media.currentPosition,
      currentTime: state.media.currentTime,
      isChanging: state.media.isChanging,
      audioFiles: state.media.audioFiles,
      references: state.refs.references,
      showQuestionnaire: state.media.showQuestionnaire,
      showRefs: state.refs.showRefs,
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
      store: media => {
        dispatch(storeMedia(media));
      },
      updateShowRefs: val => {
        dispatch(changeRefsView(val));
      },
      updateShowQuestionnaire: val => {
          dispatch(changeQuestionnaireVew(val));
      }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Audio);
import React from 'react';
import TrackPlayer from 'react-native-track-player';
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
import { 
  Toast,
  Questionnaire,
  ProgressBar,
  Refs
} from '../';
import firebase from 'react-native-firebase';
import { storeMedia, changeQuestionnaireVew } from '../../Actions/mediaFiles';
import { TOAST_TIMEOUT } from '../../Misc/Constants';
import { changeRefsView } from '../../Actions/references';
import { styles } from './styles';
import { audioOverview, audio } from '../../Misc/Strings';
import { eventEmitter } from 'react-native-dark-mode';

const dbRef = firebase.database().ref("/questionnaire");
const Analytics = firebase.analytics();

class Audio extends React.Component{
    state = {
        lastTrackId: null,
        reached90: false
    }

    componentDidMount(){
        let { audioFiles } = this.props;
        this.props.store({ showToast: false, toastText: null });
        let newAudioFiles = [...audioFiles];
        let lastTrackId = (newAudioFiles.pop()).id;
        this.setState({lastTrackId});
    }

    toggleTrack = pos => {
      let { audioFiles, paused, currentlyPlaying, currentPosition, trackDuration, updateShowRefs } = this.props;
      let title = audioFiles[pos].title;
      return new Promise(resolve => {
        if ( currentlyPlaying !== undefined && currentlyPlaying !== null && parseInt(currentlyPlaying) !== parseInt(pos)) {
          //console.log("first option");
          updateShowRefs(false);
          removeTrack().then(() => {
              let stringPos = pos.toString();
              TrackPlayer.add([audioFiles[pos]]).then(() => {
                  let newState = {
                      paused: false,
                      stopped: false,
                      loaded: true,
                      currentlyPlaying: pos,
                      selectedTrack: pos,
                      selectedTrackId: stringPos,
                      currentlyPlayingName: title,
                      showTextinput: false
                  };
                  this.props.store(newState);
                  TrackPlayer.play();
                  resolve('done');
              })
              
          }); 
        }
        else if (currentlyPlaying !== undefined && currentlyPlaying !== null && parseInt(currentlyPlaying) === parseInt(pos)) {
            let tpos = Math.floor(parseFloat(currentPosition));
            let tdur = Math.floor(parseFloat(trackDuration));
            if (tpos === tdur) {
                removeTrack().then(() => {
                    let stringPos = pos.toString();
                    TrackPlayer.add([audioFiles[pos]]).then(() => {
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
            }
            else {
                if (paused) {
                    let newState = {
                        paused: false
                    };
                    this.props.store(newState);
                    TrackPlayer.play();
                }
                else {
                    let newState = {
                        paused: true
                    };
                    this.props.store(newState);
                    TrackPlayer.pause();
                    //TrackPlayer.stop()
                }      
            }
            resolve("same");
          } 
          else {
            //console.log("other")
            TrackPlayer.play();
            resolve("not");
          }
        });
    }

    setInfo = data => {
        //console.log(data.duration);
        let trackLength = Math.floor(data.duration);
        //let type = this.props.type;
        if (trackLength > 0) {
          let newState = {
              totalLengthFormatted: formatTime(trackLength),
              totalLength: trackLength,
              paused: true
          };
          this.props.store(newState);
        }
    }

    getTime = async () => {
        //console.log(data);
        let currentTime = await TrackPlayer.getPosition();
        return currentTime;
    }

    toggleOverview = () => {
        const { showOverview, screen } = this.props;
        let newShowOverview = !showOverview;
        this.props.store({ showOverview: newShowOverview, screen: "Tracks" });
        if (screen !== "Tracks") this.goToTracks();
    }

    goToTracks = () => {
        let { navigate } = this.props;
        navigate("Third");
    }

    sendQuestionnaire = () => {
        return new Promise(resolve => {
            let { questionnaire, currentlyPlayingName } = this.props;
            //console.log(currentlyPlayingName);
            Analytics.logEvent('questionnaires_submitted_prod', {submittedQuestionnaire: currentlyPlayingName});
            questionnaire.trackName = currentlyPlayingName;
            if (questionnaire.confusing || questionnaire.question) {
                dbRef.push(questionnaire).then(res => {
                    let showToast = true;
                    this.props.store({showToast, toastText: audio.sentQuestions});
                    setTimeout(() => {
                        this.props.store({
                            showToast: !showToast, 
                            toastText: null, 
                            showTextinput: false, 
                            questionnaire: { confusing: null, question: null, comment:null } 
                        });
                    }, TOAST_TIMEOUT);
                    resolve('sent');
                }).catch(err => {
                    let showToast = true;
                    this.props.store({showToast, toastText: audio.errors.generic});
                    setTimeout(() => {
                      this.props.store({showToast: !showToast, toastText: null });
                    }, TOAST_TIMEOUT);
                    resolve('err')
                    console.log(err);
                });
            }
            else {
              let showToast = true;
              this.props.store({showToast, toastText: audio.errors.noQuestion});
              setTimeout(() => {
                this.props.store({showToast: !showToast, toastText: null });
              }, TOAST_TIMEOUT);
              resolve('no question');
            }
        });
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
            currentlyPlayingName: null,
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
            showQuestionnaire,
            fetchingRefs
        } = this.props;
        /** End reconfigure */
        let { confusing1, otherQuestion1, confusingFinal, otherQuestionFinal, titleText, anythingElse } = audioOverview;
        //issue with pause button
        let realConfusing = lastTrackId === currentlyPlaying ? confusingFinal : confusing1;
        let realOtherQuestion = lastTrackId === currentlyPlaying ? otherQuestionFinal : otherQuestion1;
        /**Input text config */
        let multiLine = lastTrackId === currentlyPlaying ? true : false;
        //console.log(loaded)
        selectedTrack = pos !== selectedTrack ? pos : selectedTrack;

        let playIcon = "play-circle";
        if (!currentlyPlayingName && paused && !loaded) playIcon = "play-circle"
        else if (paused && loaded) playIcon = "play-circle";
        else if(!paused && loaded) playIcon = "pause";

        let trackDuration = selectedTrack ? audioFiles[selectedTrack].duration : "";
        let remainingTime = ( trackDuration - currentPosition );
        let mode = eventEmitter.currentMode;
        let dark = mode === 'dark';
        const trackTimeSlider = <View style={ dark ? styles.trackTimeContainerDark : styles.trackTimeContainer }>
                <ProgressBar dark={dark} toggleReached90={this.toggleReached90} reached90={reached90} />
                <View style={ dark ? styles.trackTimeCounterContainerDark : styles.trackTimeCounterContainer }>
                    <View style= { styles.trackElapsedTime }>
                        <Text style={ dark ? styles.trackTimeDark : styles.trackTime }>{ formatTime(currentPosition) }</Text>
                    </View>
                    <View style= { styles.trackRemainingTime}>
                        <Text style={ dark ? styles.trackTimeDark : styles.trackTime }>{ "-" + formatTime(remainingTime) }</Text>
                    </View> 
                </View> 
            </View>;
        return(
            <View style={ dark ? styles.elContainerDark : styles.elContainer }>
                { showOverview ?
                <ScrollView style={{height: 300}}>
                    <View style={ style }>
                        { currentlyPlaying != null ?
                        <View  style={ dark ? styles.altContinerDark : styles.altContiner }>
                            <View style={ styles.controllerContainer }>
                                <TouchableOpacity onPress={ this.toggleOverview } style={ styles.textDisplay }>
                                    <Text style={ dark ? styles.audioTitleDark : styles.audioTitle }>
                                        { currentlyPlayingName || audio.selectTrack }
                                    </Text>
                                </TouchableOpacity>
                                <View style={ styles.buttonGroup }>
                                    <TouchableOpacity 
                                        onPress = { () => {
                                            TrackPlayer.getPosition().then(res => {
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
                                            color={ dark ? '#fff' : '#000' }
                                            name={ `ios-refresh` }
                                            size={ 25 }
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity  
                                        disabled={ !buttonsActive }  
                                        style={ styles.groupedButtons } 
                                        onPress={ selectedTrack ? () => this.toggleTrack(selectedTrack):()=>{} }
                                    >
                                        <Icon
                                            color={ dark ? '#fff' : '#000' }
                                            name={ Platform.OS === "ios" ? `ios-${playIcon}` : `md-${playIcon}`}
                                            size={ 25 }
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress = { () => {
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
                                            color={ dark ? '#fff' : '#000' }
                                            name={ `ios-refresh` }
                                            size={ 25 }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            { trackTimeSlider }
                        </View> :
                        null
                        }
                        <View style={ styles.textContainer } >
                            { showToast ?
                                <Toast dark={dark} text={ toastText } /> :
                            null }
                            <TouchableOpacity 
                                style={ dark ? styles.refsAccordionHeaderDark : styles.refsAccordionHeader } 
                                onPress = { this.toggleQuestionnaireView } 
                            >
                                <Text style={{ flex: 8, zIndex: 0, textAlign: "center", fontWeight: "bold", color: dark ? '#fff' : '#000' }}>
                                    Give Feedback on This Track
                                </Text>
                                <Icon 
                                    color={ dark ? '#fff' : '#000' }
                                    style={{ flex:1, zIndex: 1 }} 
                                    name="ios-arrow-dropdown" 
                                    size={25} 
                                />
                            </TouchableOpacity>
                            { showQuestionnaire ? 
                            <Questionnaire
                                store = { this.props.store }
                                dark = { dark }
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
                            <TouchableOpacity 
                                style={ dark ? styles.refsAccordionHeaderDark : styles.refsAccordionHeader } 
                                onPress = { this.toggleReferencesView } 
                            >
                                <Text 
                                    style={{ flex: 8, zIndex: 0, textAlign: "center", fontWeight: "bold", color: dark ? '#fff' : '#000' }}
                                >
                                    References and Links
                                </Text>
                                <Icon 
                                    color={ dark ? '#fff' : '#000' }
                                    style={{ flex:1, zIndex: 1 }} 
                                    name="ios-arrow-dropdown" 
                                    size={25} 
                                />
                            </TouchableOpacity>
                            <Refs dark={dark} styles={ styles } referencesInfo={ referencesInfo } fetching={fetchingRefs} {...this.props} />
                        </View>
                    </View>
                </ScrollView> :
                <View style={ style }>
                    { currentlyPlaying != null ?
                        <View  style={ dark ? styles.containerDark : styles.container }>
                            <TouchableOpacity 
                                style={ dark ? styles.closePlayerContainerDark : styles.closePlayerContainer } 
                                onPress={this.closeMiniPlayer}
                            >
                                <Text 
                                    style={ dark ? styles.closePlayerDark : styles.closePlayer }
                                >
                                    X
                                </Text>
                            </TouchableOpacity>
                            <View style={ styles.controllerContainer }>
                                <TouchableOpacity onPress={ this.toggleOverview } style={ styles.textDisplay }>
                                    <Text style={ dark ? styles.audioTitleDark : styles.audioTitle }>
                                        { currentlyPlayingName || audio.selectTrack }
                                    </Text>
                                </TouchableOpacity>
                                <View style={ styles.buttonGroup }>
                                    <TouchableOpacity 
                                        onPress = { () => {
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
                                            color={ dark ? '#fff' : '#000' }
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
                                            color={ dark ? '#fff' : '#000' }
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
                                            color={ dark ? '#fff' : '#000' }
                                            name={ `ios-refresh` }
                                            size={ 25 }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            { trackTimeSlider }
                            <View style = { dark ? styles.spaceFillerDark : styles.spaceFiller }></View>
                        </View> : 
                        null
                    }
                </View>
                }
            </View>
        )
    }
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
      hideMenu: state.media.hideMenu,
      connected: state.connectionInfo.connected,
      fetchingRefs: state.refs.fetching,
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
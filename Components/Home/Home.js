/* eslint-disable prettier/prettier */
import React from 'react';
import { connect } from 'react-redux';
import {
    View,
    Dimensions,
    Image,
    AppState,
    Platform,
} from 'react-native';
import { storeMedia, toggleStartTracks } from '../../Actions/mediaFiles';
import { storeRefs } from '../../Actions/references';
import Audio from '../Audio/Audio';
import AudioAndroid from '../Audio/AudioAndroid';
import Footer from '../Footer/Footer';
import Button from '../Button/Button';
import Video from 'react-native-video';
import { useIsFocused } from '@react-navigation/native';
import { styles } from './style';
import LeaveSchoolIntro from "../../Misc/media/LeaveSchool-Intro.mp4";
import analytics from '@react-native-firebase/analytics';

const Android = Platform.OS === 'android';
const Analytics = analytics();

const mode = 'dark'; // eventEmitter.currentMode;

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: false,
            showVid: false,
            currentTime: null,
            secondaryHide: false,
            introPlayed: false,
            paused: true,
            fullscreen: false,
            willResume: false,
            startButtonTitle: "Start",
        }
    }

    componentDidMount() {
        // console.log(this.props.audioFiles)
        const { navigation } = this.props;
        AppState.addEventListener("change", this._handleAppStateChange);
        Analytics.setCurrentScreen('Home_prod');
        this.blurSubscription = navigation.addListener(
            'willBlur',
            () => {
                if (!this.state.paused) {
                    this.setState({ paused: true, showVid: false });
                }
            }
        )
    }

    componentDidUpdate() {
        let {
            paused,
            currentlyPlaying,
            playingIntro,
            storeMedia,
            isFocused,
        } = this.props;

        if (!currentlyPlaying) {
            let vidPlaying = !this.state.paused;
            let audioPlaying = !paused;
            if (!isFocused && vidPlaying || audioPlaying && vidPlaying) {
                this.setState({ paused: true, showVid: false });
                storeMedia({ playingIntro: false });
            }
            else if (vidPlaying && !playingIntro) storeMedia({ playingIntro: true });
        }
    }

    componentWillUnmount() {
        if (this.blurSubscription && typeof this.blurSubscription.remove === 'function') { this.blurSubscription.remove() };
    }

    startTracks = () => {
        const { navigation: { navigate }, changeStartTracks, storeMedia } = this.props;
        changeStartTracks(true);
        navigate('Third');
        storeMedia({
            screen: "Tracks"
        });
    }

    _handleAppStateChange = nextState => {
        let player = this.player;
        if (nextState === "background" || nextState === "inactive" && player) this.setState({ paused: true });
    }

    render() {
        let {
            navigation,
            selectedTrack,
            initCurrentlyPlaying,
            audioFiles,
            currentlyPlayingName,
            showOverview,
            storeMedia,
            playingIntro,
            isFocused,
        } = this.props;
        let { loaded, showVid, paused, introPlayed, startButtonTitle } = this.state;
        let dark = mode === 'dark';
        let audioPlaying = !this.props.paused;

        if (!isFocused && !paused) this.setState({ paused: true });

        let height = Dimensions.get('window').height;

        let audioSource = selectedTrack ? { uri: audioFiles[selectedTrack].url } : "";

        const audioControls = Android ?
            <AudioAndroid
                navigate={navigation.navigate}
                audioSource={audioSource} // Can be a URL or a local file
                audioFiles={audioFiles}
                pos={selectedTrack}
                initCurrentlyPlaying={initCurrentlyPlaying}
                style={dark ? styles.audioElementDark : styles.audioElement}
                currentlyPlayingName={currentlyPlayingName}
            /> :
            <Audio
                navigate={navigation.navigate}
                audioSource={audioSource} // Can be a URL or a local file
                originScreen={'Home'}
                pos={selectedTrack}
                initCurrentlyPlaying={initCurrentlyPlaying}
                style={dark ? styles.audioElementDark : styles.audioElement}
            />;
        return (
            <View style={styles.Home}>
                {!showOverview ?
                    <View style={styles.homeMid}>
                        <View style={styles.centerImageContainer}>
                            {!loaded ?
                                <View style={styles.imagesContainer}>
                                    <Image
                                        source={require('./images/chalkboard-with-hands.jpg')}
                                        style={styles.thumb}
                                    />
                                    <View style={styles.mainTextThumb}>
                                        <Image
                                            source={require('./images/book-title.png')}
                                            style={styles.mainTextThumbImg}
                                        />
                                    </View>
                                </View> : null}
                            {
                                loaded && !showVid ?
                                    <View style={styles.imagesContainer}>
                                        <Image
                                            source={require('./images/chalkboard-with-hands.jpg')}
                                            style={styles.thumb}
                                        />
                                        <View style={styles.mainTextThumb}>
                                            <Image
                                                source={require('./images/book-title.png')}
                                                style={styles.mainTextThumbImg}
                                            />
                                            <View style={styles.playButtonContainer}>
                                                <Button
                                                    style={styles.playButton}
                                                    dark={dark}
                                                    textStyle={styles.playButtonText}
                                                    imageStyle={styles.playButtonImage}
                                                    image={require('./images/play_image.png')}
                                                    onPress={() => {
                                                        setTimeout(() => {
                                                            this.setState({ showVid: true, paused: false, secondaryHide: false });
                                                        }, 200);
                                                        this.player ? this.player.presentFullscreenPlayer() : null;
                                                        storeMedia({ playingIntro: true });
                                                    }
                                                    }
                                                />
                                            </View>
                                        </View>
                                    </View> :
                                    null}
                            {!audioPlaying ?
                                <Video
                                    source={LeaveSchoolIntro} // Can be a URL or a local file.
                                    ref={ref => {
                                        this.player = ref
                                    }}
                                    paused={!paused && isFocused ? false : true}
                                    onLoad={() => {
                                        this.setState({ loaded: true });
                                    }}
                                    onEnd={() => {
                                        this.setState({
                                            paused: true,
                                            showVid: false,
                                            willResume: false
                                        });
                                        this.player ? this.player.dismissFullscreenPlayer() : null;
                                        this.startTracks();
                                        storeMedia({ playingIntro: false });
                                    }}
                                    onProgress={data => {
                                        const { currentTime, playableDuration } = data;
                                        // const { willResume } = this.state;
                                        const flooredCurrentTime = Math.floor(parseFloat(currentTime));
                                        const flooredPlayableDuration = Math.floor(parseFloat(playableDuration));
                                        if (flooredCurrentTime < flooredPlayableDuration) this.setState({ willResume: true, startButtonTitle: 'Resume' });
                                        else if (flooredCurrentTime === flooredPlayableDuration) this.setState({ willResume: false, startButtonTitle: 'Start' });

                                        if (!isFocused || audioPlaying) this.setState({ paused: true, showVid: false });
                                        if (!introPlayed) {
                                            this.setState({ introPlayed: true });
                                            Analytics.logEvent('played_intro_prod');
                                        }
                                    }}
                                    onFullscreenPlayerWillDismiss={() => {
                                        this.setState({
                                            showVid: false,
                                            paused: true
                                        });
                                    }}
                                    onTouchEnd={() => {
                                        const { paused, showVid } = this.state
                                        const { playingIntro } = this.props;
                                        Android ? this.setState({
                                            showVid: !showVid,
                                            paused: !paused
                                        }) : null;
                                        this.player ? this.player.dismissFullscreenPlayer() : null;
                                        storeMedia({ playingIntro: !playingIntro });
                                    }}
                                    repeat={false}
                                    fullscreen={Android ? false : true}
                                    fullscreenAutorotate={false}
                                    fullscreenOrientation={"portrait"}
                                    resizeMode={"cover"}
                                    controls={false}
                                    style={!showVid || !isFocused ? styles.IntroductionVideoBeforeLoad : styles.IntroductionVideo}
                                /> :
                                null}
                        </View>
                    </View> :
                    null}
                {selectedTrack ?
                    <View
                        style={showOverview ? styles.overviewContainer :
                            height < 570 ? styles.altAltOverviewContainer :
                                height > 700 && height < 800 ? styles.longAltOverviewContanier :
                                    height > 800 ? styles.longerAltOverviewContanier :
                                        styles.altOverviewContainer
                        }
                    >
                        {audioControls}
                    </View> :
                    null}
                <View
                    style={currentlyPlayingName && height < 570 ?
                        mode === 'light' ? styles.altHomeFooter : styles.altHomeFooterDark :
                        mode === 'light' ? styles.homeFooter : styles.homeFooterDark}
                >
                    {!playingIntro || !Android ? <Footer navigation={navigation} /> : null}
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        screen: state.media.screen,
        currentlyPlaying: state.media.currentlyPlaying,
        currentlyPlayingName: state.media.currentlyPlayingName,
        initCurrentlyPlaying: state.media.initCurrentlyPlaying,
        audioFiles: state.media.audioFiles,
        references: state.refs.references,
        buttonsActive: state.media.buttonsActive,
        showOverview: state.media.showOverview,
        selectedTrackId: state.media.selectedTrackId,
        loaded: state.media.loaded,
        selectedTrack: state.media.selectedTrack,
        currentPostion: state.media.currentPostion,
        showTextinput: state.media.showTextinput,
        paused: state.media.paused,
        playingIntro: state.media.playingIntro
    }
}

const mapDispatchToProps = dispatch => {
    return {
        storeMedia: media => {
            dispatch(storeMedia(media));
        },
        storeReferences: refs => {
            dispatch(storeRefs(refs));
        },
        changeStartTracks: value => {
            dispatch(toggleStartTracks(value));
        }
    }
}

const WrappedHome = (props) => {
    const isFocused = useIsFocused();

    return <Home {...props} isFocused={isFocused} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedHome);

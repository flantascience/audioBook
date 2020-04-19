import React  from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Ionicons';
import { 
  AudioAndroid,
  Toast,
  Footer,
  Header,
  SoundBar,
  PurchaseOverview
} from '..';
import ProgressCircle from 'react-native-progress-circle';
import firebase from 'react-native-firebase';
import RNFS from 'react-native-fs';
import { formatTime, removeTrack, getDuration } from '../../Misc/helpers';
import { tracks, connectionFeedback } from '../../Misc/Strings';
import { SLOW_CONNECTION_TIMER, TOAST_TIMEOUT, LONG_TOAST_TIMEOUT, NEXT_TRACK_TIMEOUT } from '../../Misc/Constants';
import { styles } from './style';
import { slowConnectionDetected, noConnectionDetected } from '../../Actions/connection';
import { storeMedia, updateAudio, changeQuestionnaireVew, toggleStartTracks } from '../../Actions/mediaFiles';
import { setUserType } from '../../Actions/userInput';
import { changeRefsView, storeRefs } from '../../Actions/references';
import { updateShowPurchaseOverview, updatePurchasing, updateIsPurchasing } from '../../Actions/generalActions';
import * as RNIap from 'react-native-iap';

const items = [
   '01',
   'android.test.purchased',
   'android.test.canceled',
   'android.test.item_unavailable'
  ];

const Analytics = firebase.analytics();
const referencesRef = firebase.database().ref('/references');
const tracksRef = firebase.database().ref("/tracks");

const currentMode = 'dark'; /* eventEmitter.currentMode; */

class Tracks extends React.Component {
  constructor(props){
    super(props);
    let { audioFiles } = props;
    let currentAction = [];
    audioFiles.forEach(file => {
      let { id } = file;
      currentAction.push({ 
        id, 
        action: "stop", 
        percentage: 1,
        error: null
      });
    });
    this.state = {
      currentAction,
      products: null,
      autoPlayStarted: false
    }
  }

  static navigationOptions = ({navigation}) => ({
    headerLeft: <Header />,
    headerTitleStyle :{
        textAlign: 'center',
        justifyContent: 'center',
        color: '#FF6D00',
        alignItems: 'center'
    },
    headerStyle:{
        backgroundColor: currentMode === 'dark' ? '#212121' : '#EBEAEA',
        height: 80,
    },
  });

  componentDidMount(){
    let { audioFiles, connectionInfo: { connected }, store, references, refsInfo: { fetched } } = this.props;
    if (!fetched || references.length === 0) this.fetchAndStoreRefs();
    this.onStateChange = TrackPlayer.addEventListener('playback-state', async data => {
      const playerState = data.state;
      const { media: { currentPosition, trackDuration, currentlyPlaying, userType } } = this.props;
      if (playerState === 1 && trackDuration && parseInt(currentPosition) >= parseInt(trackDuration)) {
        const nextTrackId = currentlyPlaying + 1;
        if (nextTrackId != undefined && nextTrackId !== NaN) {
          const nextTrackInfo = audioFiles[nextTrackId];
          const free = audioFiles[nextTrackId].free;
          const trackAvailable = free || userType === 'paid';
          // console.log(nextTrackId)
          if (nextTrackInfo && trackAvailable) setTimeout(() => this.toggleNowPlaying(String(nextTrackId), true), NEXT_TRACK_TIMEOUT);
          else {
            console.log('no playing next')
            let showToast = true;
            store({showToast, toastText: tracks.nextTrackIsPaid });
            setTimeout(() => {
              store({showToast: !showToast, toastText: null });
            }, TOAST_TIMEOUT);
          }
        }
      }

      if (playerState === 0 || playerState === 1 || playerState === 2) this.props.store({ paused: true });
      else if (playerState !== 1) this.props.store({ paused: false});
    });

    TrackPlayer.addEventListener('remote-play', async () => {
      TrackPlayer.play();
      store({ paused: false });
    });

    TrackPlayer.addEventListener('remote-pause', async () => {
      TrackPlayer.pause();
      store({ paused: true });
    });

    TrackPlayer.addEventListener('remote-stop', async () => {
      TrackPlayer.stop();
      store({ paused: true });
    });

    TrackPlayer.addEventListener('remote-previous', async () => {
      TrackPlayer.getCurrentTrack().then(res => {
        const newTrackId = parseInt(res)-1;
        const newTrack = audioFiles[newTrackId];
        if (newTrack) this.toggleNowPlaying(newTrackId);
      })
    });

    TrackPlayer.addEventListener('remote-next', async () => {
      TrackPlayer.getCurrentTrack().then(res => {
        const newTrackId = parseInt(res)+1;
        const newTrack = audioFiles[newTrackId];
        if (newTrack) this.toggleNowPlaying(newTrackId);
      })
    });

    TrackPlayer.addEventListener('playback-queue-ended', async () => {
      const currentPosition = await TrackPlayer.getPosition();
      if (currentPosition) {
        this.props.store({paused: true, stopped: true, currentPosition: 0});
        TrackPlayer.stop();
      }
    });

    TrackPlayer.addEventListener('remote-jump-backward', async () => {
      TrackPlayer.getPosition().then(res => {
          let newPos = res + parseFloat(-15);
          let newState = {
              currentPosition: newPos,
              currentTime: newPos
          };
          store(newState);
          TrackPlayer.seekTo(newPos);
      });
    });

    TrackPlayer.addEventListener('remote-jump-forward', async () => {
      TrackPlayer.getPosition().then(res => {
          let newPos = res + parseFloat(15);
          let newState = {
              currentPosition: newPos,
              currentTime: newPos
          };
          store(newState);
          TrackPlayer.seekTo(newPos);
      });
    });
    if (connected) {
      let showMessage = true;
      store({showMessage, message: tracks.noInternetConnection });
      this.fetchAvailableProducts();
    }
    else store({showMessage: false, message: null});
  }

  fetchAndStoreRefs = () => {
    const { storeReferences } = this.props
    let cloudRefs = []
    //this._getStoredData("audioFiles");
    referencesRef.once('value', (data) => {
      data.forEach((refInfo) => {
        let key = refInfo.key
        let ref = refInfo.val()
        cloudRefs[key] = ref
      })
      //console.log(cloudRefs)
      storeReferences(cloudRefs)
    });
  }

  componentDidUpdate(){
    const { connectionInfo: { connected, startTracks }, showMessage, audioFiles, changeStartTracks, store } = this.props;
    const audioFilesLoaded = audioFiles.length > 0;
    if (startTracks && audioFilesLoaded && !this.state.autoPlayStarted) {
      this.setState({autoPlayStarted: true});
      this.toggleNowPlaying("0", true);
      changeStartTracks(false);
    }
    Analytics.setCurrentScreen('Tracks_prod');
    if (!connected) {
      let showMessage = true;
      this.props.store({showMessage, message: tracks.noInternetConnection });
    }
    else if (connected && showMessage) store({showMessage: false, message: null });
  }

  foldAccordions = () => {
    const { updateShowRefs, updateShowQuestionnaire } = this.props;
    let val = false;
    updateShowRefs(val);
    updateShowQuestionnaire(val);
  }

  toggleNowPlaying = (pos, prog = false) => {
    let { audioFiles, selectedTrack, audioFilesCloud, references, connectionInfo: { connected }, store, userType } = this.props;
    const { currentAction } = this.state;
    const currPos = audioFiles ? audioFiles[pos] : null;
    this.foldAccordions();
    if (currPos !== null && pos !== selectedTrack) {
      //console.log(res)
      const currPos = audioFiles[pos];
      const mediaType = audioFiles[pos].type;
      const title = audioFiles[pos].title;
      const free = audioFiles[pos].free;
      const trackAvailable = free || userType === 'paid'
      /**If track is cloud based one needs an internet connection*/
      //console.log(currPos)
      let playable = mediaType === "local" ?
      true:
      mediaType === "cloud" && trackAvailable && connected ?
      true:
      false;
      if (playable) {
        // console.log(audioFiles[pos].title)
        Analytics.logEvent('tracks_played_prod', {tracks: title});
        removeTrack().then(res => {
          //this.props.store({hideMenu: true});
          if (res === "removed") {
            this.updateReferenceInfo( audioFiles[pos].id, audioFiles, references);
            if (audioFiles[pos].type === "local") {
              RNFS.exists(audioFiles[pos].url).then(res=>{
                if (res) {
                  TrackPlayer.add([currPos]).then(res=>{
                    getDuration().then(trackDuration=>{
                      //console.log(trackDuration)
                      if (trackDuration > 0) {
                        const formattedDuration = formatTime(trackDuration);
                        store({
                          selectedTrack: pos,
                          currentPosition:0,
                          currentTime:0,
                          selectedTrackId: audioFiles[pos].id,
                          currentlyPlaying: audioFiles[pos].id,
                          currentlyPlayingName: audioFiles[pos].title,
                          initCurrentlyPlaying: true,
                          buttonsActive: true,
                          showOverview: prog ? false : true,
                          trackDuration, 
                          paused: false, 
                          stopped: false,
                          loaded: true, 
                          totalLength: trackDuration, 
                          formattedDuration
                        });
                        TrackPlayer.play();
                      } 
                      else {
                        trackDuration = audioFiles[pos].duration;
                        let formattedDuration = formatTime(trackDuration);
                        store({
                          selectedTrack: pos,
                          currentPosition:0,
                          currentTime:0,
                          selectedTrackId: audioFiles[pos].id,
                          currentlyPlaying: audioFiles[pos].id,
                          currentlyPlayingName: audioFiles[pos].title,
                          initCurrentlyPlaying: true,
                          buttonsActive: true,
                          showOverview: prog ? false : true,
                          trackDuration, 
                          paused: false, 
                          stopped: false,
                          loaded: true, 
                          totalLength: trackDuration, 
                          formattedDuration
                        });
                        TrackPlayer.play();
                      }
                      //alert that track is streaming
                      currentAction[pos].action = "streaming";
                    })
                  });
                } 
                else {
                  let showToast = true;
                  let newAudioFiles;
                  store({showToast, toastText: tracks.redownloadTrack });
                  setTimeout(() => {
                    store({showToast: !showToast, toastText: null });
                  }, TOAST_TIMEOUT);
                  if (audioFilesCloud.length > 0) {
                    newAudioFiles = [...audioFilesCloud];
                    this._storeData(newAudioFiles);
                  }
                  else this.fetchFromFirebase();
                }
              });
            } 
            else {
                TrackPlayer.add([currPos]).then(res => {
                  getDuration().then(trackDuration => {
                    // console.log(trackDuration)
                    if (trackDuration > 0) {
                      let formattedDuration = formatTime(trackDuration);
                      store({
                        selectedTrack: pos,
                        currentPosition:0,
                        currentTime:0,
                        selectedTrackId: audioFiles[pos].id,
                        currentlyPlaying: audioFiles[pos].id,
                        currentlyPlayingName: audioFiles[pos].title,
                        initCurrentlyPlaying: true,
                        buttonsActive: true,
                        showOverview: prog ? false : true,
                        trackDuration, 
                        paused: false, 
                        stopped: false,
                        loaded: true, 
                        totalLength: trackDuration, 
                        formattedDuration
                      });
                      TrackPlayer.play();
                    } 
                    else {
                      trackDuration = audioFiles[pos].duration;
                      let formattedDuration = formatTime(trackDuration);
                      store({
                        selectedTrack: pos,
                        currentPosition:0,
                        currentTime:0,
                        selectedTrackId: audioFiles[pos].id,
                        currentlyPlaying: audioFiles[pos].id,
                        currentlyPlayingName: audioFiles[pos].title,
                        initCurrentlyPlaying: true,
                        buttonsActive: true,
                        showOverview: prog ? false : true,
                        trackDuration, 
                        paused: false, 
                        stopped: false,
                        loaded: true, 
                        totalLength: trackDuration, 
                        formattedDuration
                      });
                      TrackPlayer.play();
                    }
                    //log streamed audio
                    audioFiles[pos].title ? Analytics.logEvent('consumption_type_prod', {streaming: audioFiles[pos].title}) : null;
                    //alert that track is streaming
                    currentAction[pos].action = "streaming";
                  })
                });
              }
            }
            else console.log(res);
          });
        }
        else {
          if (!trackAvailable) {
            let showToast = true;
            store({showToast, toastText: tracks.payForTracks });
            setTimeout(() => {
              store({showToast: !showToast, toastText: null });
            }, TOAST_TIMEOUT);
          }
          else {
            let showToast = true;
            store({showToast, toastText: tracks.noInternetConnection });
            setTimeout(() => {
              store({showToast: !showToast, toastText: null });
            }, TOAST_TIMEOUT);
          }
        }
    }
    else {
      if (!currPos) {
        let showToast = true;
        let newAudioFiles = [...audioFiles];
        newAudioFiles[pos] = audioFilesCloud[pos];
        store({showToast, toastText: tracks.redownloadTrack});
        this._storeData(newAudioFiles);
        setTimeout(()=>{
          store({showToast: !showToast, toastText: null });
        }, TOAST_TIMEOUT);
      } else {
        let showOverview = !this.props.showOverview;
        store({showOverview});
      }
    }
  }

  downloadTrack = pos => {
    const { connectionInfo: { connected }, store } = this.props;
      if (connected) {
        let { audioFiles } = this.props;
        let { currentAction } = this.state;
        let { url, id } = audioFiles[pos];
        let path = RNFS.DocumentDirectoryPath + '/' + id + ".mp3";
        let DownloadFileOptions = {
          fromUrl: url,
          toFile: path,
          //headers: Headers,
          background: true,
          cacheable: true,
          progressDivider: 1,
          discretionary: true,
          begin: res => { 
            let { statusCode } = res;
            if (statusCode !== 200) {
              currentAction[pos].action = "stop";
              currentAction[pos].error = true;
              this.setState({currentAction});
            } 
            else {
              // console.log(audioFiles[pos].title)
              audioFiles[pos].title ? Analytics.logEvent('consumption_type_prod', {downloading: audioFiles[pos].title}) : null;
              currentAction[pos].action = "downloading";
              this.setState({currentAction});
            }
          },
          progress: prog => {
            let { bytesWritten, contentLength } = prog;
            let percentage = (bytesWritten/contentLength)*100;
            currentAction[pos].percentage = percentage
            this.setState({currentAction});
          }
        };
        if (currentAction.length > 0) {
          RNFS.downloadFile(DownloadFileOptions).promise.then(() => {
            let newPath = Platform.OS === 'ios' ? "file:////" + path : path;
            currentAction[pos].action = "downloaded";
            audioFiles[pos].url = newPath;
            audioFiles[pos].type = "local";
            //console.log(audioFiles);
            this._storeData(audioFiles);
            this.setState({currentAction});
            this.forceUpdate();
          }).catch(err => {
            console.log(err);
            let showToast = true;
            store({showToast, toastText: tracks.restartApp });
            setTimeout(() => {
              store({showToast: !showToast, toastText: null });
            }, TOAST_TIMEOUT);
          });
        }
      } 
      else {
        console.log('no interent');
        let showToast = true;
        store({showToast, toastText: tracks.noInternetConnection });
        setTimeout(() => {
          store({showToast: !showToast, toastText: null });
        }, TOAST_TIMEOUT);
      }
  }

  fetchAvailableProducts = () => {
    try {
      RNIap.getProducts(items).then(products => {
       //handle success of fetch product list
       this.setState({products});
      }).catch(error => {
        console.log(error.message);
      })
    } catch(err) {
      console.warn(err); // standardized err.code and err.message available
    }
  }

  RestorePurchase = () => {
    const { updateUserType, store, toggleShowPurchaseOverview, startPurchasing } = this.props;
    startPurchasing(true);
    RNIap.getAvailablePurchases().then(response => {
        //console.log(response)
        if (response[0]) {
            if (response[0].transactionId) {
                updateUserType('paid');
                let showToast = true;
                toggleShowPurchaseOverview(false);
                store({showToast, toastText: tracks.successfullyRestored });
                setTimeout(() => {
                    store({showToast: !showToast, toastText: null });
                }, TOAST_TIMEOUT);
                startPurchasing(false);
            }
            else {
                console.log(e.message)
                let showToast = true
                toggleShowPurchaseOverview(false)
                store({ showToast, toastText: tracks.restartApp });
                setTimeout(() => {
                store({ showToast: !showToast, toastText: null })
                }, LONG_TOAST_TIMEOUT)
                startPurchasing(false);
            }
        }
        else {
            updateUserType('free');
            let showToast = true;
            toggleShowPurchaseOverview(false);
            store({showToast, toastText: tracks.notPurchased });
            setTimeout(() => {
                store({showToast: !showToast, toastText: null });
            }, LONG_TOAST_TIMEOUT);
            startPurchasing(false);
        }
    }).
    catch(e => {
        console.log(e.message)
        let showToast = true
        toggleShowPurchaseOverview(false)
        store({ showToast, toastText: tracks.restartApp });
        setTimeout(() => {
          store({ showToast: !showToast, toastText: null })
        }, LONG_TOAST_TIMEOUT)
        startPurchasing(false)
    })
  }

  buyProduct = () => {
    const { products } = this.state;
    const { toggleShowPurchaseOverview, startPurchasing } = this.props;
    if (products && products.length > 0) {
      const tracksId = items[0];
      const { updateUserType, store } = this.props;
      startPurchasing(true);
      RNIap.requestPurchase(tracksId, false).then(purchase => {
        if (purchase.transactionReceipt) {
          AsyncStorage.setItem('transactionReceipt', JSON.stringify(purchase.transactionReceipt));
          updateUserType('paid');
          let showToast = true;
          toggleShowPurchaseOverview(false);
          store({showToast, toastText: tracks.successfullyPaid});
          setTimeout(() => {
            store({showToast: !showToast, toastText: null});
          }, TOAST_TIMEOUT);
          RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
          startPurchasing(false);
        }
        else {
          updateUserType('free');
          let showToast = true;
          toggleShowPurchaseOverview(false);
          store({showToast, toastText: tracks.restartApp});
          setTimeout(() => {
            store({showToast: !showToast, toastText: null});
          }, LONG_TOAST_TIMEOUT);
          startPurchasing(false);
        }
      }).
      catch(e => {
        // console.log(e.code)
        if (e.code === 'E_ALREADY_OWNED') {
          updateUserType('paid');
          let showToast = true;
          toggleShowPurchaseOverview(false);
          store({showToast, toastText: tracks.alreadyPaid});
          setTimeout(() => {
            store({showToast: !showToast, toastText: null});
          }, TOAST_TIMEOUT);
          startPurchasing(false);
        }
        else {
          updateUserType('free');
          let showToast = true;
          toggleShowPurchaseOverview(false);
          store({showToast, toastText: tracks.transactionFailed});
          setTimeout(() => {
            store({showToast: !showToast, toastText: null});
          }, TOAST_TIMEOUT);
          startPurchasing(false);
        }
      });
    }
    else {
      updateUserType('free');
      let showToast = true;
      toggleShowPurchaseOverview(false);
      store({showToast, toastText: tracks.productsUnavailable });
      setTimeout(() => {
        store({showToast: !showToast, toastText: null });
      }, LONG_TOAST_TIMEOUT);
      startPurchasing(false);
    }
  }

  updateReferenceInfo = (currentlyPlaying, audioFiles, references) => {
    return new Promise(resolve => {
        let currentReferences = [];
        let referencesInfo = [];
        audioFiles.forEach(file => {
            let id = file.id;
            if(id === currentlyPlaying){
                currentReferences = file.references;
            }
        });
        if (currentReferences && currentReferences.length > 0) {
            currentReferences.forEach(ref => {
                referencesInfo.push(references[ref]);
            });
            this.setState({referencesInfo});
            resolve("has");
        }
        else {
            this.setState({referencesInfo: []});
            resolve("doesnt");
        }
    });
  } 


  _storeData = async audioFiles => {
    try {
      let stringAudioFiles = JSON.stringify(audioFiles);
      await AsyncStorage.setItem('audioFiles', stringAudioFiles);
      this.props.store({audioFiles});
    } catch (error) {
      console.log(error);
    }
  };

  fetchFromFirebase = () => {
    let { connectionInfo: { connected }, store } = this.props;
    let cloudAudio = [];
    if (connected ) {
      tracksRef.once('value', data => {
        data.forEach(trackInf => {
          //console.log(trackInf);
          let track = trackInf.val();
          if (track) cloudAudio.push(track);
        });
        let newAudioFiles = [...cloudAudio];
        store({audioFiles: newAudioFiles, audioFilesCloud: newAudioFiles});
        this._storeAudioFilesData(newAudioFiles);
      }).catch(err => {
        console.log(err)
        let showToast = true;
        store({showToast, toastText: tracks.downloadError });
        setTimeout(() => {
          store({showToast: !showToast, toastText: null });
        }, TOAST_TIMEOUT);
        });
    }
    else {
      let showToast = true;
      store({showToast, toastText: tracks.noInternetConnection });
      setTimeout(() => {
        store({showToast: !showToast, toastText: null });
      }, TOAST_TIMEOUT);
    }
  }


  render(){
    let {
      navigation, 
      paused, 
      selectedTrack,
      initCurrentlyPlaying,
      audioFiles,
      currentlyPlayingName,
      currentPosition,
      showOverview,
      toastText,
      showToast,
      connectionInfo: {
        connection,
        connected
      },
      reportSlowConnection,
      userType,
      toggleShowPurchaseOverview,
      showPurchaseOverview,
      isPurchasing
    } = this.props;
    let { referencesInfo } = this.state;
    let type = selectedTrack ? audioFiles[selectedTrack].type : "local";
    let height = Dimensions.get('window').height;

    let audioSource = selectedTrack ? type === "local" ? audioFiles[selectedTrack].url : {uri: audioFiles[selectedTrack].url} : "";

    let mode = currentMode;
    let dark = mode === 'dark';

    let loading = audioFiles.length === 0;

    setTimeout(() => {
      if (loading) reportSlowConnection();
    }, SLOW_CONNECTION_TIMER);

    const playing = 
    <AudioAndroid
        navigate = { navigation.navigate }
        audioSource={ audioSource } // Can be a URL or a local file
        referencesInfo={referencesInfo}
        audioFiles={audioFiles}
        pos={ selectedTrack }
        initCurrentlyPlaying = { initCurrentlyPlaying }
        style={ dark ? styles.audioElementDark : styles.audioElement }
        currentlyPlayingName={ currentlyPlayingName }
    />;

    return (
      <View style={ styles.Home }>
        
          { !showOverview ?
              <View style = { dark ? styles.homeMidDark : styles.homeMid }>
                { showToast ?
                  <View style={ styles.toastContainer }>
                    <Toast dark={dark} text={ toastText } /></View> : 
                  null
                }
                { showPurchaseOverview ? 
                <PurchaseOverview 
                  dark={dark}
                  isPurchasing={isPurchasing}
                  toggleView={() => toggleShowPurchaseOverview(!showPurchaseOverview)} 
                  onPurchase={this.buyProduct} 
                  onRestore={this.RestorePurchase} 
                /> : 
                null }
                { !loading ?
                <ScrollView>{ 
                  Object.keys(audioFiles).map(key => {
                    const { title, type, formattedDuration, free } = audioFiles[key];
                    const { currentAction } = this.state;
                    /**Set default action */
                    const action = currentAction[key] ? currentAction[key].action : "stop";
                    /**set default percentage */
                    const percentage = currentAction[key] ? Math.floor(currentAction[key].percentage) : 1;
                    const playIcon = key !== selectedTrack ?
                    "play-circle" : 
                    key === selectedTrack && !paused ? "pause" :
                    "play-circle";
                    const downlaodIcon = "cloud-download";
                    const lockedItemIcon = "lock";
                    return(
                      <View key={key} style={ styles.trackContainer }>
                        <TouchableOpacity onPress={ () => { free || userType === 'paid' ? this.toggleNowPlaying(key) : toggleShowPurchaseOverview(!showPurchaseOverview) }} style={ dark ? styles.trackDark : styles.track }> 
                          <View style={ styles.trackTextWrapper }>
                            <Text style={ dark ? styles.trackTitleDark : styles.trackTitle }>{ title }</Text>
                            <Text style={ dark ? styles.trackLengthDark : styles.trackLength }>{ formattedDuration }</Text>
                          </View>
                          { free || userType === 'paid' ?
                          <View style={styles.iconsContainer}>
                            <TouchableOpacity onPress={ () => this.toggleNowPlaying(key) } style={ styles.trackIcon }>
                              { playIcon !== "pause" ? 
                              <Icon
                                color={ dark ? '#fff' : '#000' }
                                name={ Platform.OS === "ios" ? `ios-${playIcon}` : `md-${playIcon}`}
                                size={ 40 }
                              /> :
                              <SoundBar dark={dark} playing={currentPosition > 0} /> }
                            </TouchableOpacity>
                            { type === "cloud" && action !== "downloading" ?
                            <TouchableOpacity onPress={ () => this.downloadTrack(key) } style={ styles.trackIcon }>
                              <Icon 
                                color={ dark ? '#fff' : '#000' }
                                name={ Platform.OS === "ios" ? `ios-${downlaodIcon}` : `md-${downlaodIcon}` }
                                size={ 35 }
                              />
                            </TouchableOpacity> :
                            type === "cloud" && action === "downloading" ?
                            <TouchableOpacity style={styles.trackIcon}>
                              <ProgressCircle
                                percent={percentage}
                                radius={14}
                                borderWidth={2}
                                color="#3399FF"
                                shadowColor="#999"
                                bgColor="#fff"
                              >
                                <Text style={{ fontSize: 8 }}>{ percentage + '%'}</Text>
                              </ProgressCircle>
                            </TouchableOpacity> : 
                          null } 
                        </View> :
                        <View style={styles.iconsContainer}>
                            <TouchableOpacity onPress={() => toggleShowPurchaseOverview(!showPurchaseOverview)} style={ styles.trackIcon }>
                              <Icon 
                                color={ dark ? '#fff' : '#000' }
                                name={ Platform.OS === "ios" ? `ios-${lockedItemIcon}` : `md-${lockedItemIcon}` }
                                size={ 35 }
                              />
                            </TouchableOpacity> 
                        </View>
                        }
                      </TouchableOpacity>
                    </View>
                  )
                }) }
                </ScrollView> :
                <View>
                  { connected ? 
                    <View>
                      <ActivityIndicator 
                        size="large" 
                        color="#D4D4D4"
                        style={{ marginTop: "10%" }}
                      />
                      { connection === 'slow' ? <Text style={ styles.text }>{ connectionFeedback.slowConnection }</Text> : null }
                    </View> : 
                    <Text style={ styles.text }>{ connectionFeedback.needConnectionToFetchTracks }</Text> 
                  }
                </View>
                }
              </View> : null }
            { selectedTrack ?
            <View 
              style={ showOverview ? styles.overviewContainer :
                height < 570 ? styles.altAltOverviewContainer :
                height > 700 && height < 800 ? styles.longAltOverviewContanier :
                height > 800 ? styles.longerAltOverviewContanier :
                styles.altOverviewContainer 
              } 
            >
            { playing }
            </View> : null }
          <View style = { currentlyPlayingName && height < 570 ? 
            mode === 'light' ? styles.altHomeFooter : styles.altHomeFooterDark :
            mode === 'light' ? styles.homeFooter : styles.homeFooterDark
          }>
            <Footer navigation={ navigation } />
          </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return{
    currentlyPlayingName: state.media.currentlyPlayingName,
    initCurrentlyPlaying: state.media.initCurrentlyPlaying,
    screen: state.media.screen,
    audioFiles: state.media.audioFiles,
    audioFilesCloud: state.media.audioFilesCloud,
    buttonsActive: state.media.buttonsActive,
    showOverview: state.media.showOverview,
    selectedTrackId: state.media.selectedTrackId,
    loaded: state.media.loaded,
    paused: state.media.paused,
    references: state.refs.references,
    refsInfo: state.refs,
    selectedTrack: state.media.selectedTrack,
    currentPosition: state.media.currentPosition,
    showTextinput: state.media.showTextinput,
    hideMenu: state.media.hideMenu,
    toastText: state.media.toastText,
    showToast: state.media.showToast,
    showMessage: state.media.showMessage,
    message: state.media.message,
    connectionInfo: state.connectionInfo,
    loadedFromMemory: state.media.loadedFromMemory,
    showPurchaseOverview: state.generalInfo.showPurchaseOverview,
    media: state.media,
    userType: state.connectionInfo.userType,
    isPurchasing: state.generalInfo.isPurchasing
  }
}

const mapDispatchToProps = dispatch => {
  return {
    store: media => {
      dispatch(storeMedia(media));
    },
    updateAudioFiles: files => {
      dispatch(updateAudio(files));
    },
    reportSlowConnection: () => {
      dispatch(slowConnectionDetected());
    },
    reportNoConnection: () => {
      dispatch(noConnectionDetected());
    },
    updateShowRefs: val => {
      dispatch(changeRefsView(val));
    },
    updateShowQuestionnaire: val => {
      dispatch(changeQuestionnaireVew(val));
    },
    changeStartTracks: value => {
      dispatch(toggleStartTracks(value));
    },
    updateUserType: userType => {
      dispatch(setUserType(userType));
    },
    toggleShowPurchaseOverview: value => {
      dispatch(updateShowPurchaseOverview(value))
    },
    togglePurchasing: value => {
      dispatch(updatePurchasing(value))
    },
    startPurchasing: value => {
        dispatch(updateIsPurchasing(value));
    },
    storeReferences: refs => {
        dispatch(storeRefs(refs))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracks);
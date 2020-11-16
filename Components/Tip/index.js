import React from 'react';
import {
  View,
  Platform,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal
} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import {
  Header,
  Footer,
  Toast,
  Audio,
  AudioAndroid
} from '../'
import { styles } from './style';
import { TOAST_TIMEOUT, TIPS } from '../../Misc/Constants';
import { storeInput } from '../../Actions/userInput';
import { storeMedia } from '../../Actions/mediaFiles';
import * as RNIap from 'react-native-iap';
import { tip_jar } from '../../Misc/Strings';


const Analytics = firebase.analytics();
const Android = Platform.OS === 'android';

const itemSkus = Platform.select({
  ios: [
    'tipjar5',
    'tijar20',
    'tipjar50',
    'tipjar120',
    'tipjar240',
    'tipjar1000'
  ],
  android: [
    'tipjar5',
    'tipjar20',
    'tipjar50',
    'tipjar120',
    'tipjar240',
    'tipjar1000'
  ]
});

const mode = 'dark';
class Tip extends React.Component {

  constructor() {
    super();
    this.purchaseUpdateSubscription = null;
    this.purchaseErrorSubscription = null;
    this.state = {
      Tips: TIPS,
      loaded: false
    }
  }

  static navigationOptions = () => {
    return {
      headerLeft: <Header />,
      headerTitleStyle: {
        textAlign: 'center',
        justifyContent: 'center',
        color: '#FF6D00',
        alignItems: 'center'
      },
      headerStyle: {
        backgroundColor: mode === 'dark' ? '#212121' : '#EBEAEA',
        height: 80,
        borderBottomWidth: Android ? 0 : 1,
        borderBottomColor: mode === 'dark' ? '#525253' : '#C7C6C6'
      }
    }
  };

  componentDidMount() {
    Analytics.setCurrentScreen('Tip_prod');
    RNIap.initConnection().then(async () => {
      let products = await RNIap.getProducts(itemSkus);
      products.sort((a, b) => Number(a.price) - Number(b.price));
      this.setState({ Tips: products, loaded: true });
      RNIap.flushFailedPurchasesCachedAsPendingAndroid().then(() => {
        this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async purchase => {
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            if (Platform.OS === 'ios') {
              await RNIap.finishTransactionIOS(purchase.transactionId);
            } else if (Platform.OS === 'android') {
              await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
            }
            await RNIap.finishTransaction(purchase, true);
          }
        });
        this.purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
          let showToast = true;
          this.props.storeMediaInf({ showToast, toastText: 'Something went wrong, please try again.' });
          setTimeout(() => {
            this.props.storeMediaInf({ showToast: !showToast, toastText: null });
          }, TOAST_TIMEOUT);
        });
      }).catch(error => {
        let showToast = true;
        this.props.storeMediaInf({ showToast, toastText: 'Something went wrong, please try again.' });
        setTimeout(() => {
          this.props.storeMediaInf({ showToast: !showToast, toastText: null });
        }, TOAST_TIMEOUT);
      })
    });
  }

  tipAuthor = async sku => {
    try {
      await RNIap.requestPurchase(sku, false);
    } catch (err) {
      let showToast = true;
      this.props.storeMediaInf({ showToast, toastText: 'Something went wrong, please try again' });
      setTimeout(() => {
        this.props.storeMediaInf({ showToast: !showToast, toastText: null });
      }, TOAST_TIMEOUT);
    }
  }

  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }

  render() {
    let {
      navigation,
      showToast,
      toastText,
      selectedTrack,
      initCurrentlyPlaying,
      audioFiles,
      currentlyPlayingName,
      showOverview
    } = this.props;

    let dark = mode === 'dark';

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
        originScreen={'Tip'}
        pos={selectedTrack}
        initCurrentlyPlaying={initCurrentlyPlaying}
        style={dark ? styles.audioElementDark : styles.audioElement}
      />;

    return (
      <View
        style={styles.Home}
      >
        { !this.state.loaded && <View style={styles.loading_overlay} >
            <ActivityIndicator size={'small'} color={'white'} />
          </View> }
        <View style={dark ? styles.homeMidDark : styles.homeMid}>
          {showToast ?
            <Toast dark={dark} text={toastText} /> :
            null}
          <Text style={dark ? styles.callToActionDark : styles.callToAction}>
            {tip_jar.cto}
          </Text>
          <View style={dark ? styles.scrollViewDark : styles.scrollView}>
            <ScrollView style={{ padding: 20 }} >
                {this.state.Tips.map((tip, index) => {
                  return <TouchableOpacity
                    key={index}
                    style={styles.tip_button}
                    onPress={() => {
                      if (typeof tip === 'object') {
                        this.tipAuthor(tip.productId)
                      }
                      else {
                        let showToast = true;
                        this.props.storeMediaInf({ showToast, toastText: 'Please try again later, something went wrong!' });
                        setTimeout(() => {
                          this.props.storeMediaInf({ showToast: !showToast, toastText: null });
                        }, TOAST_TIMEOUT);
                      }
                    }} >
                    <Text style={{ color: '#ffffff' }}>${tip.price || tip}</Text>
                  </TouchableOpacity>
                })}
            </ScrollView>
          </View>
        </View>
        { selectedTrack ?
          <View
            style={showOverview ? styles.overviewContainer :
              height < 570 ? styles.altAltOverviewContainer :
                height > 700 && height < 800 ? styles.longAltOverviewContanier :
                  height > 800 ? styles.longerAltOverviewContanier :
                    styles.altOverviewContainer
            }
          >
            {audioControls}
          </View> : null}
        <View
          style={currentlyPlayingName && height < 570 ?
            mode === 'light' ? styles.altHomeFooter : styles.altHomeFooterDark :
            mode === 'light' ? styles.homeFooter : styles.homeFooterDark
          }>
          <Footer navigation={navigation} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    userEmail: state.input.userEmail,
    screen: state.media.screen,
    emails: state.media.emails,
    showToast: state.media.showToast,
    toastText: state.media.toastText,
    currentlyPlayingName: state.media.currentlyPlayingName,
    initCurrentlyPlaying: state.media.initCurrentlyPlaying,
    audioFiles: state.media.audioFiles,
    buttonsActive: state.media.buttonsActive,
    showOverview: state.media.showOverview,
    selectedTrackId: state.media.selectedTrackId,
    loaded: state.media.loaded,
    selectedTrack: state.media.selectedTrack,
    currentPostion: state.media.currentPostion,
    showTextinput: state.media.showTextinput,
    hideMenu: state.media.hideMenu
  }
}

const mapDispatchToProps = dispatch => {
  return {
    store: (input) => {
      dispatch(storeInput(input))
    },
    storeMediaInf: (media) => {
      dispatch(storeMedia(media))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tip);
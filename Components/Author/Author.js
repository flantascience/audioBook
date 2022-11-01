/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
  Platform,
  ScrollView,
  Image,
  Text,
  TextInput,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import NetInfo from "@react-native-community/netinfo";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Toast from '../Toast/Toast';
import AudioAndroid from '../Audio/AudioAndroid';
import Audio from '../Audio/Audio';
import Button from '../Button/Button';
import { styles } from './style';
import { author, connectionFeedback } from '../../Misc/Strings';
import { TOAST_TIMEOUT } from '../../Misc/Constants';
import { storeInput } from '../../Actions/userInput';
import { storeMedia } from '../../Actions/mediaFiles';
import { emailregex } from '../../Misc/Constants';
import InputScrollView from 'react-native-input-scroll-view';
// import { eventEmitter } from 'react-native-dark-mode';
import analytics from '@react-native-firebase/analytics';
import database from '@react-native-firebase/database';

const Analytics = analytics();
const Android = Platform.OS === 'android';
const dbRef = database().ref("/subscriptions");

const mode = 'dark'; // eventEmitter.currentMode;
class Author extends React.Component {

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
    // Analytics.setCurrentScreen('Author_prod');
    this.fetchSubscribers();
  }

  fetchSubscribers = () => {
    dbRef.once('value', data => {
      let emails = [];
      data.forEach(inf => {
        let email = inf.val();
        emails.push(email);
        //console.log(email);
      });
      this.props.storeMediaInf({ emails });
    })
  }

  checkAvailability = userEmail => {
    return new Promise(resolve => {
      resolve(true);
      /*
      *removed check
      *let { emails } = this.props;
      //console.log(this.props)
      if(emails && emails.length > 0){
        let available = true;
        emails.map(email => {
          if(userEmail.toLowerCase() === email.toLowerCase()){
            available = false;
            //console.log(available);
          }
        });
        resolve(available);
      }else{
        let showToast = true;
        this.props.storeMediaInf({showToast, toastText: author.messages.tryLater });
        setTimeout(() => {
          this.props.storeMediaInf({showToast: !showToast, toastText: null });
        }, TOAST_TIMEOUT);
      }**/
    });
  }

  postSubscriber = () => {
    let { userEmail } = this.props;
    if (userEmail.length > 0) {
      if (userEmail.match(emailregex)) {
        this.checkAvailability(userEmail).then(available => {
          if (available) {
            NetInfo.fetch().then(state => {
              let conType = state.type;
              //console.log(conType)
              if (conType !== "wifi" && conType !== "cellular") {
                let showToast = true;
                this.props.storeMediaInf({ showToast, toastText: connectionFeedback.noConnection });
                setTimeout(() => {
                  this.props.storeMediaInf({ showToast: !showToast, toastText: null });
                }, TOAST_TIMEOUT);
              } else {
                dbRef.push(userEmail);
                let showToast = true;
                this.props.storeMediaInf({ showToast, toastText: author.messages.subscribed });
                setTimeout(() => {
                  this.props.storeMediaInf({ showToast: !showToast, toastText: null });
                }, TOAST_TIMEOUT);
                userEmail ? Analytics.logEvent('subscribed_users_prod', { emailAddress: userEmail }) : null;
                this.fetchSubscribers();
              }
            });
          } else {
            let showToast = true;
            this.props.storeMediaInf({ showToast, toastText: author.messages.alreadySubscribed });
            setTimeout(() => {
              this.props.storeMediaInf({ showToast: !showToast, toastText: null });
            }, TOAST_TIMEOUT);
          }
        });
      } else {
        let showToast = true;
        this.props.storeMediaInf({ showToast, toastText: author.messages.worngEmailFormat });
        setTimeout(() => {
          this.props.storeMediaInf({ showToast: !showToast, toastText: null });
        }, TOAST_TIMEOUT);
      }
    } else {
      let showToast = true;
      this.props.storeMediaInf({ showToast, toastText: author.messages.fillEmail });
      setTimeout(() => {
        this.props.storeMediaInf({ showToast: !showToast, toastText: null });
      }, TOAST_TIMEOUT);
    }
  }

  tempSave = (text) => {
    if (text.trim() === '') {
      return;
    }
    this.props.store(text);
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
        originScreen={'Author'}
        pos={selectedTrack}
        initCurrentlyPlaying={initCurrentlyPlaying}
        style={dark ? styles.audioElementDark : styles.audioElement}
      />;

    return (
      <View
        style={styles.Home}
      >
        <View style={dark ? styles.homeMidDark : styles.homeMid}>
          {Platform.OS === "ios" ?
            <InputScrollView style={dark ? styles.scrollViewDark : styles.scrollView}>
              <View style={styles.centerImageContainer}>
                <Image style={styles.authorImage} source={require('./images/author-pic.jpg')} />
              </View>
              <Text style={dark ? styles.nameDark : styles.name}>{author.name}</Text>
              <Text style={dark ? styles.authorTitleDark : styles.authorTitle}>{author.title}</Text>
              <View style={dark ? styles.introContainerDark : styles.introContainer}>
                <Text style={dark ? styles.introTextDark : styles.introText}>{author.intro}</Text>
              </View>
              <View style={styles.actionContainer}>
                <Text style={dark ? styles.callToActionDark : styles.callToAction}>{author.callToAction}</Text>
                {showToast ?
                  <Toast dark={dark} text={toastText} /> :
                  null}
                <TextInput
                  style={dark ? styles.emailInputDark : styles.emailInput}
                  autoCompleteType={'email'}
                  textContentType={'emailAddress'}
                  placeholder={author.emailPlaceHolder}
                  onChangeText={this.tempSave}
                />
                <View style={Platform.OS === "ios" ? styles.altButtonContainer : styles.buttonContainer}>
                  <Button
                    dark={dark}
                    title={author.buttonText}
                    onPress={this.postSubscriber}
                  />
                </View>
              </View>
              <View style={styles.spacer}></View>
            </InputScrollView> :
            <ScrollView style={dark ? styles.scrollViewDark : styles.scrollView}>
              <View style={styles.centerImageContainer}>
                <Image style={styles.authorImage} source={require('./images/author-pic.jpg')} />
              </View>
              <Text style={dark ? styles.nameDark : styles.name}>{author.name}</Text>
              <View style={dark ? styles.introContainerDark : styles.introContainer}>
                <Text style={dark ? styles.introTextDark : styles.introText}>{author.intro}</Text>
              </View>
              <View style={styles.actionContainer}>
                <Text style={dark ? styles.callToActionDark : styles.callToAction}>{author.callToAction}</Text>
                {showToast ?
                  <Toast dark={dark} text={toastText} /> :
                  null}
                <TextInput
                  style={dark ? styles.emailInputDark : styles.emailInput}
                  autoCompleteType={'email'}
                  textContentType={'emailAddress'}
                  placeholder={author.emailPlaceHolder}
                  placeholderTextColor={'#757575'}
                  onChangeText={this.tempSave}
                />
                <View style={Platform.OS === "ios" ? styles.altButtonContainer : styles.buttonContainer}>
                  <Button
                    dark={dark}
                    title={author.buttonText}
                    onPress={this.postSubscriber}
                  />
                </View>
              </View>
            </ScrollView>
          }
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Author);

import React  from 'react';
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
import firebase from 'react-native-firebase';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { styles } from './style';
import Toast from '../Toast/Toast';
import { author } from '../../Misc/Strings';
import { storeInput } from '../../Actions/userInput';
import { storeMedia } from '../../Actions/mediaFiles';
import { emailregex } from '../../Misc/Constants';
// import { SimpleAnimation } from 'react-native-simple-animations';
import Audio from '../Audio/Audio';
//import MediaOverview from '../MediaOverview/MediaOverview';
import Button from '../Button/Button';
import InputScrollView from 'react-native-input-scroll-view';
import { eventEmitter } from 'react-native-dark-mode';

const Analytics = firebase.analytics();

const dbRef = firebase.database().ref("/subscriptions");

class Author extends React.Component {

  componentDidMount(){
    Analytics.setCurrentScreen('Author');
    this.fetchSubscribers();
  }

  fetchSubscribers = ()=> {
    dbRef.once('value', data=>{
      let emails = [];
      data.forEach(inf=>{
        let email = inf.val();
        emails.push(email);
        //console.log(email);
      });
      this.props.storeMediaInf({emails});
    })
  }

  checkAvailability = userEmail=>{
    return new Promise(resolve=>{
      let { emails } = this.props;
      //console.log(this.props)
      if(emails && emails.length > 0){
        let available = true;
        emails.map(email=>{
          if(userEmail.toLowerCase() === email.toLowerCase()){
            available = false;
            //console.log(available);
          }
        });
        resolve(available);
      }else{
        let showToast = true;
        this.props.storeMediaInf({showToast, toastText: "Please try later." });
        setTimeout(()=>{
          this.props.storeMediaInf({showToast: !showToast, toastText: null });
        }, 800);
      }
    });
  }

  postSubscriber = ()=>{
    let { userEmail } = this.props;
    if(userEmail.length > 0){
      if(userEmail.match(emailregex)){
        this.checkAvailability(userEmail).then(available=>{
          if(available){
            NetInfo.fetch().then(state=>{
              let conType = state.type;
              //console.log(conType)
              if(conType !== "wifi" && conType !== "cellular"){
                let showToast = true;
                this.props.storeMediaInf({showToast, toastText: "No internet connection" });
                setTimeout(()=>{
                  this.props.storeMediaInf({showToast: !showToast, toastText: null });
                }, 800);
              }else{
                dbRef.push(userEmail);
                let showToast = true;
                this.props.storeMediaInf({showToast, toastText: "You successfully subscribed" });
                setTimeout(()=>{
                  this.props.storeMediaInf({showToast: !showToast, toastText: null });
                }, 800);
                Analytics.logEvent('subscribed_users', {emailAddress: userEmail});
                this.fetchSubscribers();
              }
            });
          }else{
            let showToast = true;
            this.props.storeMediaInf({showToast, toastText: "You already subscribed!" });
            setTimeout(()=>{
              this.props.storeMediaInf({showToast: !showToast, toastText: null});
            }, 800);
          }
        }); 
      }else{
        let showToast = true;
        this.props.storeMediaInf({showToast, toastText: 'Wrong email format!' });
        setTimeout(()=>{
          this.props.storeMediaInf({showToast: !showToast, toastText: null });
        }, 800);
      }
    }else{
      let showToast = true;
      this.props.storeMediaInf({showToast, toastText: 'Fill in your email address!' });
      setTimeout(()=>{
        this.props.storeMediaInf({showToast: !showToast, toastText: null });
      }, 800);
    }
  }

  static navigationOptions = ()=> ({
    headerLeft: <Header />,
    headerTitleStyle :{
        textAlign: 'center',
        justifyContent: 'center',
        color: '#FF6D00',
        alignItems: 'center'
    },
    headerStyle:{
        backgroundColor: eventEmitter.currentMode === 'dark'? '#212121' : '#EBEAEA',
        height: 80,
    },
  });

  tempSave = (text)=>{
    if(text.trim() === '') {
        return;
    }
    this.props.store(text);
  }

  render(){
    let {
      navigation,
      showToast,
      toastText,
      selectedTrack,
      initCurrentlyPlaying,
      audioFiles,
      currentlyPlayingName,
      isChanging,
      showOverview
    } = this.props;

    let mode = eventEmitter.currentMode;
    let dark = mode === 'dark';
    
    let height = Dimensions.get('window').height;
    let type = selectedTrack?audioFiles[selectedTrack].type:"local";
    let audioSource = selectedTrack?type === "local" ? audioFiles[selectedTrack].url : {uri: audioFiles[selectedTrack].url}:"";
    const playing = !isChanging?
      <Audio
        navigate = { navigation.navigate }
        audioSource={ audioSource } // Can be a URL or a local file
        audioFiles={audioFiles}
        pos={ selectedTrack }
        initCurrentlyPlaying = { initCurrentlyPlaying }
        style={ dark ? styles.audioElementDark : styles.audioElement }
        currentlyPlayingName={ currentlyPlayingName }
      />: null;
    return (
      <View 
        style={ styles.Home }
      >
        <View style = { dark ? styles.homeMidDark : styles.homeMid }>
          { Platform.OS === "ios"?
          <InputScrollView style = { dark ? styles.scrollViewDark : styles.scrollView }>
              <View style = { styles.centerImageContainer }>
                <Image style={ styles.authorImage } source={require('./images/author.jpg')} />
              </View>
              <Text style = {dark ? styles.nameDark : styles.name}>{ author.name }</Text>
              <Text style = {dark ? styles.authorTitleDark : styles.authorTitle}>{ author.title }</Text>
              <View style={ dark ? styles.introContainerDark : styles.introContainer }>
                <Text style={ dark ? styles.introTextDark : styles.introText }>{ author.intro }</Text>
              </View>
              <View style={ styles.actionContainer }>
                <Text style={ dark ? styles.callToActionDark : styles.callToAction}>{ author.callToAction }</Text>
                { showToast?
                  <Toast text={ toastText } /> :
                null }
                  <TextInput
                    style={ dark ? styles.emailInputDark : styles.emailInput }
                    autoCompleteType={'email'}
                    textContentType={'emailAddress'}
                    placeholder={ author.emailPlaceHolder }
                    onChangeText={ this.tempSave }
                  />
                  <View style = { Platform.OS === "ios"?styles.altButtonContainer:styles.buttonContainer }>
                    <Button 
                      dark={dark}
                      title={ author.buttonText } 
                      onPress={ this.postSubscriber } 
                    />
                  </View>
              </View>
              <View style={ styles.spacer }></View>
            </InputScrollView> :
            <ScrollView style = { dark ? styles.scrollViewDark : styles.scrollView }>
              <View style = { styles.centerImageContainer }>
                <Image style={ styles.authorImage } source={require('./images/author.jpg')} />
              </View>
              <Text style = {dark ? styles.nameDark : styles.name}>{ author.name }</Text>
              <View style={ dark ? styles.introContainerDark : styles.introContainer }>
                <Text style={ dark ? styles.introTextDark : styles.introText }>{ author.intro }</Text>
              </View>
              <View style={ styles.actionContainer }>
                <Text style={ dark ? styles.callToActionDark : styles.callToAction}>{ author.callToAction }</Text>
                { showToast ?
                  <Toast text={ toastText } /> :
                null }
                  <TextInput
                    style={ dark ? styles.emailInputDark : styles.emailInput }
                    autoCompleteType={'email'} 
                    textContentType={'emailAddress'}
                    placeholder={ author.emailPlaceHolder }
                    placeholderTextColor={'#757575'}
                    onChangeText={ this.tempSave }
                  />
                  <View style = { Platform.OS === "ios"?styles.altButtonContainer:styles.buttonContainer }>
                    <Button 
                      dark={dark}
                      title={ author.buttonText } 
                      onPress={ this.postSubscriber } 
                    />
                  </View>
              </View>
              </ScrollView>
            }
        </View>
        { selectedTrack?
        <View 
          style={ showOverview?styles.overviewContainer:
            height < 570?styles.altAltOverviewContainer:
            height > 700 && height < 800?styles.longAltOverviewContanier:
            height > 800?styles.longerAltOverviewContanier:
            styles.altOverviewContainer 
          } 
        >
        { playing }
        </View>: null } 
        <View 
          style = { currentlyPlayingName && height < 570 ? 
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

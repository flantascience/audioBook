import React  from 'react';
import {
  View,
  Platform,
  ScrollView,
  Image,
  Text,
  TextInput,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { styles } from './style';
import Toast from '../Toast/Toast';
import { author } from '../../Misc/Strings';
import { storeInput } from '../../Actions/userInput';
import { storeMedia } from '../../Actions/mediaFiles';
import { emailregex } from '../../Misc/Constants';
import { SimpleAnimation } from 'react-native-simple-animations';
import Audio from '../Audio/Audio';
import MediaOverview from '../MediaOverview/MediaOverview';

const dbRef = firebase.database().ref("/subscriptions");

class Author extends React.Component {

  componentDidMount(){
    this.fetchSubscribers();
  }

  fetchSubscribers = ()=> {
    dbRef.once('value', data=>{
      let emails = [];
      data.forEach(inf=>{
        let email = inf.val();
        emails.push(email);
        console.log(email);
      });
      this.props.storeMediaInf({emails});
    })
  }

  checkAvailability = userEmail=>{
    return new Promise(resolve=>{
      let { emails } = this.props;
      //console.log(this.props)
      if(emails.length > 0){
        let available = true;
        emails.map(email=>{
          if(userEmail.toLowerCase() === email.toLowerCase()){
            available = false;
            //console.log(available);
          }
        });
        resolve(available);
      }
    });
  }

  postSubscriber = ()=>{
    let { userEmail } = this.props;
    if(userEmail.match(emailregex)){
        this.checkAvailability(userEmail).then(available=>{
          if(available){
            dbRef.push(userEmail);
            let showToast = true;
            this.props.storeMediaInf({showToast, toastText: "You successfully subscribed" });
            setTimeout(()=>{
              this.props.storeMediaInf({showToast: !showToast, toastText: null });
            }, 800);
            this.fetchSubscribers();
          }else{
            let showToast = true;
            this.props.storeMediaInf({showToast, toastText: "You already subscribed!" });
            setTimeout(()=>{
              this.props.storeMediaInf({showToast: !showToast, toastText: null });
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

  tempSave = (text)=>{
    if(text.trim() === '') {
        return;
    }
    this.props.store(text);
  }

  render(){
    let {
      navigation,
      userEmail,
      showToast,
      toastText,
      currentlyPlaying, 
      loaded,
      selectedTrack,
      initCurrentlyPlaying,
      audioFiles,
      currentlyPlayingName,
      isChanging,
      showOverview
    } = this.props;
    let type = selectedTrack?audioFiles[selectedTrack].type:"local";
    let audioSource = selectedTrack?type === "local" ? audioFiles[selectedTrack].url : {uri: audioFiles[selectedTrack].url}:"";
    const playing = !isChanging?
      <Audio
        navigate = { navigation.navigate }
        audioSource={ audioSource } // Can be a URL or a local file
        audioFiles={audioFiles}
        pos={ selectedTrack }
        initCurrentlyPlaying = { initCurrentlyPlaying }
        style={styles.audioElement}
        currentlyPlayingName={ currentlyPlayingName }
      />: null;
    return (
      <View style={ styles.Home }>
        { !showOverview?
        <View style = { styles.homeMid }>
          <ScrollView>
            <View style = { styles.centerImageContainer }>
              <Image style={ styles.authorImage } source={require('./images/author.jpg')} />
            </View>
            <Text style = {styles.name}>{ author.name }</Text>
            <View style={ styles.introContainer }>
              <Text style={ styles.introText }>{ author.intro }</Text>
            </View>
            <View style={ styles.actionContainer }>
              <Text style={ styles.callToAction}>{ author.callToAction }</Text>
              { showToast?
                <Toast text={ toastText } />:
              null }
              <TextInput
                style={ styles.emailInput }
                autoCompleteType={'email'}
                textContentType={'emailAddress'}
                placeholder={ author.emailPlaceHolder }
                onChangeText={ this.tempSave }
              />
              <View style = { styles.buttonContainer }>
                <Button 
                  color={ Platform.OS === "android"?'#349DD3':'#888787' } 
                  title={ author.buttonText } 
                  onPress={ this.postSubscriber } 
                />
              </View>
            </View>
          </ScrollView>
        </View>:
        <SimpleAnimation 
            style={ styles.overviewContainer } 
            direction={'up'} 
            delay={100} 
            duration={500} 
            movementType={ 'slide' }
          >
            <MediaOverview navigate = { navigation.navigate } />
          </SimpleAnimation> }
          { selectedTrack? playing: null }
        <View style = { styles.homeFooter }>
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
    showTextinput: state.media.showTextinput
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

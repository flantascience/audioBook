/**
 * Sample React Native Home
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
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
import { author } from '../../Misc/Strings';
import { storeInput } from '../../Actions/userInput';
import { storeMedia } from '../../Actions/mediaFiles';

const db = firebase.database();

class Author extends React.Component {

  componentDidMount(){
    let newState = {
      screen: "Author"
    };
    this.props.storeMediaInf(newState);
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

  onPress = ()=>{

  }

  tempSave = (text)=>{
    if(text.trim() === '') {
        return;
    }
    this.props.store(text);
  }

  render(){
    let {
      navigation,
      userEmail
    } = this.props;
    return (
      <View style={ styles.Home }>
        <ScrollView style = { styles.homeMid }>
          <View style = { styles.centerImageContainer }>
            <Image style={ styles.authorImage } source={require('./images/author.jpg')} />
          </View>
          <Text style = {styles.name}>{ author.name }</Text>
          <View style={ styles.introContainer }>
            <Text style={ styles.introText }>{ author.intro }</Text>
          </View>
          <View style={ styles.actionContainer }>
            <Text style={ styles.callToAction}>{ author.callToAction }</Text>
            <TextInput
              style={ styles.emailInput }
              value = { userEmail }
              autoCompleteType={'email'}
              textContentType={'emailAddress'}
              placeholder={ author.emailPlaceHolder }
              onChangeText={ this.tempSave }
            />
            <View style = { styles.buttonContainer }>
              <Button 
                color={ Platform.OS === "android"?'#C7C6C6':'#888787' } 
                title={ author.buttonText } 
                onPress={ this.onPress } 
              />
            </View>
          </View>
        </ScrollView>
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
    screen: state.media.screen
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

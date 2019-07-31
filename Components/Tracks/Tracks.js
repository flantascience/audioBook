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
  Image,
  Text,
  TextInput,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import 'firebase/database';
import '../../Misc/helpers';
import TrackPlayer from 'react-native-track-player';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { styles } from './style';
import { storeMedia } from '../../Actions/mediaFiles';

const storage = firebase.storage();
const storageRef = storage.ref();

class Tracks extends React.Component {

  constructor(){
    super()
    this.state = {
      mediaFiles: []
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

  componentDidMount(){
    let mediaFiles = [];
    this.fetchFiles().then(res=>{
      res.items.forEach(function(itemRef) {
        // All the items under listRef.
        itemRef.getDownloadURL().then(res=>{
          mediaFiles.push(res);
        });
      });
    });
    this.setState({
      mediaFiles
    });
  }

  fetchFiles = ()=>{
    return new Promise((resolve, reject)=>{
      let audioFiles = storageRef.child('/audioFiles');
      audioFiles.listAll().then(res=>{
        resolve(res);
      }).catch(err=>{
        reject(err)
      });
    });
  }

  render(){
    let {
      navigation
    } = this.props;
    let {
      mediaFiles
    } = this.state;
    let mediaFilesLen = mediaFiles.length;
    return (
      <View style={ styles.Home }>
        <View style = { styles.homeMid }>
          { mediaFilesLen > 0?<View style = { styles.centerImageContainer }>
            { mediaFiles.map(url=>{
              return(
                <View>
                  <Text>{url}</Text>
                </View>
              )
            })}
          </View>: null }
        </View>
        <View style = { styles.homeFooter }>
          <Footer navigation={ navigation } />
        </View>
      </View>
    );
  }
}


const mapStateToProps = state => {
  return{
    mediaFiles: state.mediaFiles
  }
}

const mapDispatchToProps = dispatch => {
  return {
    store: (media) => {
      dispatch(storeMedia(media));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracks);

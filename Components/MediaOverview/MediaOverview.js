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
  Button,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import { storeInput } from '../../Actions/userInput';
import { storeMedia } from '../../Actions/mediaFiles';
import { 
  formatTime, 
  getCurrentTrack, 
  getTrack, 
  getPlayerState 
} from '../../Misc/helpers';
import poster from '../../Misc/media/part2-unschooling.jpg';

class MediaOverviews extends React.Component {

  componentDidMount(){
    getCurrentTrack().then(res=>{
      console.log(res);
    });
  }

  toggleOverview = ()=>{
    const { showOverview } = this.props;
    let newShowOverview = !showOverview;
    this.props.storeMediaInf({ showOverview: newShowOverview, showTextinput: false  });
  }

  render(){
    let {
      userEmail
    } = this.props;
    return (
      <ScrollView style = { styles.scrollView }>
        <View style={ styles.container }>
          <TouchableOpacity onPress={ this.toggleOverview } style={ styles.toggleTrackDetail }>
              <Icon
                  name={ `ios-arrow-down`}
                  size={ 30 }
              />
          </TouchableOpacity>
          <View style = { styles.posterContainer }>
            <Image 
              source={ poster }
              style={ styles.poster } 
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    userEmail: state.input.userEmail,
    screen: state.media.screen,
    showOverview: state.media.showOverview,
    showTextinput: state.media.showTextinput,
    volume: state.media.volume
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

export default connect(mapStateToProps, mapDispatchToProps)(MediaOverviews);

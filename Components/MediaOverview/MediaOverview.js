/**
 * Sample React Native Home
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React from 'react';
import {
  View,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { styles } from './styles';
import { storeInput } from '../../Actions/userInput';
import { storeMedia } from '../../Actions/mediaFiles';
import { 
  getCurrentTrack, 
} from '../../Misc/helpers';
import poster from '../../Misc/media/part2-unschooling.jpg';

class MediaOverviews extends React.Component {

  componentDidMount(){
    getCurrentTrack().then(res=>{
      //console.log(res);
    }).catch(err=>{
      console.log(err);
    })
  }

  toggleOverview = ()=>{
    const { showOverview } = this.props;
    let newShowOverview = !showOverview;
    this.props.storeMediaInf({ showOverview: newShowOverview, showTextinput: false  });
  }

  render(){
    let {
      userEmail,
      showTextinput
    } = this.props;
    /*if(!showTextinput){
      return (
        <ScrollView style = { styles.scrollView }>
          <View style={ styles.container }>
            <View style = { styles.posterContainer }>
              <Image 
                source={ poster }
                style={ styles.poster } 
              />
            </View>
          </View>
        </ScrollView>
      )
    }else{*/
      return (
        <View style={ styles.altContainer }>
          <Image 
            source={ poster }
            style={ styles.poster } 
          />
          {/*<TouchableOpacity onPress={ this.toggleOverview } style={ styles.toggleTrackDetail }>
              <Icon
                  name={ `ios-arrow-down`}
                  size={ 30 }
              />
          </TouchableOpacity>*/}
        </View>
      )
    /**} */ 
  }
}

const mapStateToProps = state => {
  return {
    userEmail: state.input.userEmail,
    screen: state.media.screen,
    showOverview: state.media.showOverview,
    showTextinput: state.media.showTextinput,
    volume: state.media.volume,
    paused: state.media.paused,
    screen: state.media.screen,
    showToast: state.media.showToast,
    toastText: state.media.toastText
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

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
import { addPlace } from '../../Actions/places';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { styles } from './style';


class Author extends React.Component {

  constructor(props){
    super(props);
    this.state= {
      placeName:"",
      paces: []
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

  onPress = () => {
    if(this.state.placeName.trim() === '') {
      return;
    }
    this.props.add(this.state.placeName);
  }

  render(){

    let {
      navigation
    } = this.props;
    return (
      <View style={ styles.Home }>
        <View style = { styles.homeMid }>
          <View style = { styles.centerImageContainer }>
            <Image style={ styles.centerImage } source={require('./images/author.jpg')} />
          </View>
        </View>
        <View style = { styles.homeFooter }>
          <Footer navigation={ navigation } />
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    placeName: state.places.placeName,
    places: state.places.places
  }
}

const mapDispatchToProps = dispatch => {
  return {
    add: (name) => {
      dispatch(addPlace(name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Author);

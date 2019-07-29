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
  Text,
  TextInput,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import { addPlace } from '../../Actions/places';
import Header from '../Header/Header';
import { styles } from './style';


class Home extends React.Component {

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
      placeName,
      places
    } = this.props;

    return (
      <View style={ styles.Home }>
        <Text>Audio Book</Text>
        <View><Text>{ placeName }</Text></View>
        <TextInput
          style = { styles.textInput }
          value={ this.state.placeName }
          onChangeText={ (value)=>{
            this.setState({
              placeName: value
            });
          } }
        />
        <Button onPress={ this.onPress } title={'Submit'} />
      </View>
    );
  }
}
const mapStateToProps = state => {
  console.log(state);
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);

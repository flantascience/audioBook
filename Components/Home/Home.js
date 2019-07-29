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
  Image
} from 'react-native';

import { styles } from './style';

export default class Home extends React.Component {

  static navigationOptions =({navigation})=> ({
    headerLeft: <Image style={ styles.navLogo } source={require('./images/crzy-head-shot-trans.png')} />,
    headerTitleStyle :{
        textAlign: 'center',
        justifyContent: 'center',
        color: '#FF6D00',
        alignItems: 'center'
    },
    headerStyle:{
        backgroundColor:'white',
    },
  })

  render(){
    return (
      <View style={ styles.Home }>
        <Text>Audio Book</Text>
      </View>
    );
  }
}

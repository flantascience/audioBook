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
  Image
} from 'react-native';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { styles } from './style';

class Home extends React.Component {

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

  render(){

    let {
      navigation
    } = this.props;
    return (
      <View style={ styles.Home }>
        <View style = { styles.homeMid }>
          <View style = { styles.centerImageContainer }>
            <Image style={ styles.centerImage } source={require('./images/sample-book-cover.jpg')} />
          </View>
        </View>
        <View style = { styles.homeFooter }>
          <Footer navigation={ navigation } />
        </View>
      </View>
    );
  }
}

export default Home;

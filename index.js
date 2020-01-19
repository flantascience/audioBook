/**
 * @format
 */
import React from 'react';
//import MusicControl from 'react-native-music-control';
import TrackPlayer from 'react-native-track-player';
import { AppRegistry, Easing } from 'react-native';
import { Home, Author, Tracks } from './Components';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import configureStore from './store';
import { DarkModeProvider } from 'react-native-dark-mode'

TrackPlayer.setupPlayer().then(()=>{
 TrackPlayer.updateOptions({
    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_SEEK_TO,
      TrackPlayer.CAPABILITY_JUMP_FORWARD,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      TrackPlayer.CAPABILITY_JUMP_BACKWARD,
      TrackPlayer.CAPABILITY_STOP
    ],
    compactCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_JUMP_FORWARD,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      TrackPlayer.CAPABILITY_JUMP_BACKWARD,
      TrackPlayer.CAPABILITY_SEEK_TO,
      TrackPlayer.CAPABILITY_STOP
    ]
  });
});
const store = configureStore();

const screenConfig = {
    duration: 1,
    easing: Easing.out(Easing.poly(4))
};

const MainNavigator = createStackNavigator({
    First: { screen: Home },
    Second: { screen: Tracks },
    Third: { screen: Author }
},  
{
    initialRouteName: 'First',
    headerMode: 'float',
    mode: 'modal',
    transitionConfig: sceneProps => ({
      transitionSpec: screenConfig,
      screenInterpolator: (sceneProps) => {
        if (sceneProps.scene.route.routeName === 'Second') {
          const { layout, position, scene } = sceneProps;
          const { index } = scene;
  
          const width = layout.initWidth;
          const translateX = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [width, 0, 0],
          });
  
          const opacity = position.interpolate({
            inputRange: [index - 1, index - 0.99, index],
            outputRange: [0, 1, 1],
          });
  
          return { opacity, transform: [{ translateX }] };
        }
      },
    })
});

const IniApp = createAppContainer(MainNavigator);

const App = ()=>(
  <Provider store = { store }> 
    <DarkModeProvider>
      <IniApp /> 
    </DarkModeProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(()=>require('./service'));

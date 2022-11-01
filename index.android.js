/* eslint-disable prettier/prettier */
/**
 * @format
 */
import React from 'react';
import { AppRegistry, Easing } from 'react-native';
import { Home, Author, TracksAndroid, PreLoad } from './Components';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import TrackPlayer, { Capability } from 'react-native-track-player';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import configureStore from './store';
import { DarkModeProvider } from 'react-native-dark-mode'

const store = configureStore();
TrackPlayer.setupPlayer().then(() => {
  TrackPlayer.updateOptions({
    alwaysPauseOnInterruption: true,
    waitForBuffer: true,
    stopWithApp: true,
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SeekTo,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.JumpBackward,
      Capability.JumpForward,
      Capability.Stop
    ],
    notificationCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SeekTo,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.JumpBackward,
      Capability.JumpForward,
      Capability.Stop
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop
    ]
  });
});

const screenConfig = {
  duration: 1,
  easing: Easing.out(Easing.poly(4))
};

const MainNavigator = createStackNavigator({
  First: { screen: PreLoad },
  Second: { screen: Home },
  Third: { screen: TracksAndroid },
  Fourth: { screen: Author }
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

const App = () => (
  <Provider store={store}>
    <DarkModeProvider>
      <IniApp />
    </DarkModeProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerEventHandler(() => require('./service'));

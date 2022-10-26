/* eslint-disable prettier/prettier */
/**
 * @format
 */
import React from 'react';
import { AppRegistry, Easing } from 'react-native';
import { Home, Author, TracksAndroid, PreLoad, Tip } from './Components';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import TrackPlayer, { Capability } from 'react-native-track-player';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import configureStore from './store';
import { DarkModeProvider } from 'react-native-dark-mode';

const store = configureStore();

TrackPlayer.setupPlayer();
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
    Capability.JumpForward,
    Capability.JumpBackward,
    Capability.Stop,
  ],
  notificationCapabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.SeekTo,
    Capability.SkipToNext,
    Capability.SkipToPrevious,
    Capability.JumpForward,
    Capability.JumpBackward,
    Capability.Stop,
  ],
  compactCapabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.SkipToNext,
    Capability.SkipToPrevious,
    Capability.Stop,
  ],
});

// const screenConfig = {
//   duration: 1,
//   easing: Easing.out(Easing.poly(4)),
// };

const Stack = createStackNavigator();

//{
//   First: { screen: PreLoad },
//   Second: { screen: Home },
//   Third: { screen: TracksAndroid },
//   Fourth: { screen: Author },
//   Fifth: { screen: Tip }
// },
//   {
//     initialRouteName: 'First',
//     headerMode: 'float',
//     mode: 'modal',
//     transitionConfig: sceneProps => ({
//       transitionSpec: screenConfig,
//       screenInterpolator: (sceneProps) => {
//         if (sceneProps.scene.route.routeName === 'Second') {
//           const { layout, position, scene } = sceneProps;
//           const { index } = scene;

//           const width = layout.initWidth;
//           const translateX = position.interpolate({
//             inputRange: [index - 1, index, index + 1],
//             outputRange: [width, 0, 0],
//           });

//           const opacity = position.interpolate({
//             inputRange: [index - 1, index - 0.99, index],
//             outputRange: [0, 1, 1],
//           });

//           return { opacity, transform: [{ translateX }] };
//         }
//       },
//     })
//   });

const App = () => (
  <Provider store={store}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DarkModeProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='First' component={PreLoad} />
            <Stack.Screen name='Second' component={Home} />
            <Stack.Screen name='Third' component={TracksAndroid} />
            <Stack.Screen name='Fourth' component={Author} />
            <Stack.Screen name='Fifth' component={Tip} />
          </Stack.Navigator>
        </NavigationContainer>
      </DarkModeProvider>
    </GestureHandlerRootView>
  </Provider>
);

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require('./service'));

/**
 * @format
 */
import React from 'react';
import { AppRegistry, Easing, Platform } from 'react-native';
import { Home, Author, Tracks, TracksAndroid, PreLoad, Tip } from './Components';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TrackPlayer from 'react-native-track-player';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import configureStore from './store';
import { DarkModeProvider } from 'react-native-dark-mode'

const store = configureStore();
const Android = Platform.OS === 'android';

Android ? TrackPlayer.setupPlayer().then(() => {
  TrackPlayer.updateOptions({
    alwaysPauseOnInterruption: true,
    waitForBuffer: true,
    stopWithApp: true,
    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_SEEK_TO,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      TrackPlayer.CAPABILITY_JUMP_FORWARD,
      TrackPlayer.CAPABILITY_JUMP_BACKWARD,
      TrackPlayer.CAPABILITY_STOP
    ],
    notificationCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_SEEK_TO,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      TrackPlayer.CAPABILITY_JUMP_FORWARD,
      TrackPlayer.CAPABILITY_JUMP_BACKWARD,
      TrackPlayer.CAPABILITY_STOP
    ],
    compactCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_STOP,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
    ]
  });
}) :
  null;

// const screenConfig = {
//   duration: 1,
//   easing: Easing.out(Easing.poly(4))
// };

const Stack = createStackNavigator();
// {  First: { screen: PreLoad },
//   Second: { screen: Home },
//   Third: { screen: Android ? TracksAndroid : Tracks },
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
    <DarkModeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='First' component={PreLoad} />
          <Stack.Screen name='Second' component={Home} />
          <Stack.Screen name='Third' component={Android ? TracksAndroid : Tracks} />
          <Stack.Screen name='Fourth' component={Author} />
          <Stack.Screen name='Fifth' component={Tip} />
        </Stack.Navigator>
      </NavigationContainer>
    </DarkModeProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => App);
Android ? TrackPlayer.registerPlaybackService(() => require('./service')) : null;
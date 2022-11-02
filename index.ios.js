/* eslint-disable prettier/prettier */
/**
 * @format
 */
import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import Home from './Components/Home/Home';
import Tracks from './Components/Tracks/Tracks';
import Header from './Components/Header/Header';
import Author from './Components/Author/Author';
import PreLoad from './Components/PreLoad/PreLoad';
//import Tip from './Components/Tip';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import TrackPlayer, { Capability } from 'react-native-track-player';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import configureStore from './store';
import { DarkModeProvider } from 'react-native-dark-mode';

const store = configureStore();
const Android = Platform.OS === 'android';

const currentMode = 'dark'; /* eventEmitter.currentMode; */

Android ? TrackPlayer.setupPlayer().then(() => {
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
      Capability.Stop,
    ],
    notificationCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SeekTo,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.JumpBackward,
      Capability.JumpForward,
      Capability.Stop,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ]
  });
}) :
  null;

const Stack = createStackNavigator();

const App = () => (
  <Provider store={store}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DarkModeProvider>
        <NavigationContainer>
          <Stack.Navigator
          >
            <Stack.Screen
              name='First'
              component={PreLoad}
              options={{
                headerTitleStyle: {
                  textAlign: 'center',
                  justifyContent: 'center',
                  color: '#FF6D00',
                  alignItems: 'center'
                },
                headerStyle: {
                  backgroundColor: currentMode === 'dark' ? '#212121' : '#EBEAEA',
                  height: 120,
                  borderBottomWidth: Android ? 0 : 1,
                  borderBottomColor: currentMode === 'dark' ? '#525253' : '#C7C6C6',
                },
                title: '',
                headerLeft: (props) => <Header {...props} Android={Android} />,
              }}
            />
            <Stack.Screen
              name='Second'
              component={Home}
              options={{
                headerTitle: "Home",
                headerTitleStyle: {
                  textAlign: 'center',
                  justifyContent: 'center',
                  color: 'rgba(0,0,0,0)',
                  alignItems: 'center'
                },
                headerStyle: {
                  backgroundColor: currentMode === 'dark' ? '#212121' : '#EBEAEA',
                  height: 120,
                  borderBottomWidth: Android ? 0 : 1,
                  borderBottomColor: currentMode === 'dark' ? '#525253' : '#C7C6C6',
                },
                title: '',
                headerLeft: (props) => <Header {...props} Android={Android} />,
              }}
            />
            <Stack.Screen
              name='Third'
              component={Tracks}
              options={{
                headerTitleStyle: {
                  textAlign: 'center',
                  justifyContent: 'center',
                  color: 'rgba(0,0,0,0)',
                  alignItems: 'center'
                },
                headerStyle: {
                  backgroundColor: currentMode === 'dark' ? '#212121' : '#EBEAEA',
                  height: 120,
                  borderBottomWidth: Android ? 0 : 1,
                  borderBottomColor: currentMode === 'dark' ? '#525253' : '#C7C6C6',
                },
                title: '',
                headerLeft: (props) => <Header {...props} Android={Android} />,
              }}
            />
            <Stack.Screen
              name='Fourth'
              component={Author}
              options={{
                headerTitleStyle: {
                  textAlign: 'center',
                  justifyContent: 'center',
                  color: 'rgba(0,0,0,0)',
                  alignItems: 'center'
                },
                headerStyle: {
                  backgroundColor: currentMode === 'dark' ? '#212121' : '#EBEAEA',
                  height: 120,
                  borderBottomWidth: Android ? 0 : 1,
                  borderBottomColor: currentMode === 'dark' ? '#525253' : '#C7C6C6',
                },
                title: '',
                headerLeft: (props) => <Header {...props} Android={Android} />,
              }}
            />
            {/* <Stack.Screen
              name='Fifth'
              component={Tip}
              options={{
                headerTitleStyle: {
                  textAlign: 'center',
                  justifyContent: 'center',
                  color: 'rgba(0,0,0,0)',
                  alignItems: 'center'
                },
                headerStyle: {
                  backgroundColor: currentMode === 'dark' ? '#212121' : '#EBEAEA',
                  height: 120,
                  borderBottomWidth: Android ? 0 : 1,
                  borderBottomColor: currentMode === 'dark' ? '#525253' : '#C7C6C6',
                },
                title: '',
                headerLeft: (props) => <Header {...props} Android={Android} />,
              }}
            /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </DarkModeProvider>
    </GestureHandlerRootView>
  </Provider>
);

AppRegistry.registerComponent(appName, () => App);

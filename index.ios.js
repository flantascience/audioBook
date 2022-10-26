/* eslint-disable prettier/prettier */
/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
// import { Home, Author, Tracks, PreLoad } from './Components';
import Home from './Components/Home/Home';
import Author from './Components/Author/Author';
import Tracks from './Components/Tracks/Tracks';
import PreLoad from './Components/PreLoad/PreLoad';
import Tip from './Components/Tip';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import configureStore from './store';
import { DarkModeProvider } from 'react-native-dark-mode'

const store = configureStore();

// const screenConfig = {
//   duration: 1,
//   easing: Easing.out(Easing.poly(4))
// };

const Stack = createStackNavigator();
// {
//   First: { screen: PreLoad },
//   Second: { screen: Home },
//   Third: { screen: Tracks },
//   Fourth: { screen: Author }
// },
//   {
//     initialRouteName: 'First',
//     headerMode: 'float',
//     mode: 'modal',
//     transitionConfig: sceneProps => ({
//       transitionSpec: screenConfig,
//       screenInterpolator: (sceneProps) => {
//         if (sceneProps.scene.route.routeName === 'First') {
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
          <Stack.Screen name='Third' component={Tracks} />
          <Stack.Screen name='Fourth' component={Author} />
          <Stack.Screen name='Fifth' component={Tip} />
        </Stack.Navigator>
      </NavigationContainer>
    </DarkModeProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => App);

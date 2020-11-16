/**
 * @format
 */
import React from 'react';
import { AppRegistry, Easing } from 'react-native';
import { Home, Author, Tracks, PreLoad, Tip } from './Components';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import configureStore from './store';
import { DarkModeProvider } from 'react-native-dark-mode'

const store = configureStore();

const screenConfig = {
    duration: 1,
    easing: Easing.out(Easing.poly(4))
};

const MainNavigator = createStackNavigator({
  First: { screen: PreLoad },
  Second: { screen: Home },
  Third: { screen: Tracks },
  Fourth: { screen: Author },
  Fifth: { screen: Tip }
},
{
    initialRouteName: 'First',
    headerMode: 'float',
    mode: 'modal',
    transitionConfig: sceneProps => ({
      transitionSpec: screenConfig,
      screenInterpolator: (sceneProps) => {
        if (sceneProps.scene.route.routeName === 'First') {
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

/**
 * @format
 */
import { AppRegistry, Easing, Animated } from 'react-native';
import { Home } from './Components';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { name as appName } from './app.json';

const screenConfig = {
    duration: 200,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
};

const MainNavigator = createStackNavigator({
    First: { screen: Home }
    //Second: { screen: PostDetailComponent }
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

const App = createAppContainer(MainNavigator);

AppRegistry.registerComponent(appName, () => App);

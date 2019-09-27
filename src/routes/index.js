import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import config from '@/config';

import Home from '../pages/Home';
import Doc from '../pages/Doc';

const StackNavigator = createStackNavigator(
  {
    HomeScreen: {
      screen: Home,
    },
    DocScreen: {
      screen: Doc,
    },
  },
  {
    headerMode: 'screen',
    initialRouteName: 'HomeScreen',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: config.themeColor,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
);

export default createAppContainer(StackNavigator);

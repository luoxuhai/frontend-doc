import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import config from '@/config';

import Home from '../pages/Home';
import Doc from '../pages/Doc';

// const MaterialTopTabNavigator = createMaterialTopTabNavigator(
//   {
//     HomeScreen: {
//       screen: Home,
//     },
//   },
//   {
//     initialRouteName: 'HomeScreen',
//   },
// );

const StackNavigator = createStackNavigator(
  {
    HomeScreen: {
      screen: Home,
      navigationOptions: () => ({
        title: 'web前端中文文档',
        headerStyle: {
          elevation: 0,
          backgroundColor: config.themeColor,
        },
      }),
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

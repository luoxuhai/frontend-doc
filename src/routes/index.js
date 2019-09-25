import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';

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
          backgroundColor: '#158bb8',
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
        backgroundColor: '#158bb8',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
);

export default createAppContainer(StackNavigator);

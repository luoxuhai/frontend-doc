import * as React from 'react';
import SplashScreen from 'react-native-splash-screen';
import App from './routes';
import './utils/storage';
// import 'frontend-doc/mock';

export default class Main extends React.Component {
  componentDidMount() {
    global.storage
      .load({
        key: 'stars',
        autoSync: false,
      })
      .catch(() => {
        global.storage.save({
          key: 'stars',
          data: [],
        });
      });
    setTimeout(SplashScreen.hide, 1500);
  }
  render() {
    return <App />;
  }
}

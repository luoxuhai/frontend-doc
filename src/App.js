import * as React from 'react';
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
  }
  render() {
    return <App />;
  }
}

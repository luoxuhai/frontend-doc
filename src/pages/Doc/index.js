import React, {PureComponent, Fragment} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableNativeFeedback,
  Button,
  Share,
  ToastAndroid,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Spinner from 'react-native-spinkit';
import {Menu, Divider, Provider, Appbar} from 'react-native-paper';
import {scaleSizeW, getScreenH} from '@/utils/utils';

export default class Doc extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      modalVisible: false,
    };
  }

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title'),
    headerStyle: {
      backgroundColor: '#158bb8',
    },
    headerRight: (
      <Menu
      // onDismiss={this._closeMenu}
      // anchor={<Text onPress={this._openMenu}>KK</Text>}
      >
        <Menu.Item onPress={() => {}} title="Item 1" />
        <Menu.Item onPress={() => {}} title="Item 2" />
        <Divider />
        <Menu.Item onPress={() => {}} title="Item 3" />
      </Menu>
    ),
  });

  onShare = async () => {
    const {describe, name} = this.props.navigation.state.params;
    await Share.share({
      title: 'web前端中文文档',
      message: `${name}: ${describe}`,
    });
  };

  render() {
    const {isVisible} = this.state;
    const {url} = this.props.navigation.state.params;
    return (
      <Fragment>
        <Spinner
          isVisible={isVisible}
          size={50}
          type="CircleFlip"
          color="#1ABC9C"
          accessibilityLabel="加载中"
          style={styles.spinner}
        />
        <WebView
          source={{uri: url}}
          scalesPageToFit={false}
          domStorageEnabled={true}
          textZoom={100}
          onLoadEnd={e => {
            const {loading} = e.nativeEvent;
            if (!loading) {
              this.setState(() => ({
                isVisible: loading,
              }));
            }
          }}
        />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    left: scaleSizeW(750 / 2 - 25),
    top: getScreenH() / 2 - 100,
    zIndex: 999,
  },
});

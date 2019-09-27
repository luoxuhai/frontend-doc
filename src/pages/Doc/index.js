import React, {PureComponent, Fragment} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Share,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Spinner from 'react-native-spinkit';
import {scaleSizeW, getScreenH} from '@/utils/utils';
import config from '@/config';

class PaperMenu extends PureComponent {
  state = {
    modalVisible: false,
    isStar: false,
  };

  docId = '';

  componentDidMount() {
    global.storage
      .load({
        key: 'stars',
        autoSync: false,
      })
      .then(stars => {
        global.storage
          .load({
            key: 'docId',
            autoSync: false,
          })
          .then(id => {
            this.docId = id;
            if (stars.includes(id)) {
              this.setState({
                isStar: true,
              });
            }
          });
      })
      .catch(() => {});
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onStar = () => {
    if (this.state.isStar) {
      global.storage
        .load({
          key: 'stars',
          autoSync: false,
        })
        .then(stars => {
          console.log(this.docId);
          global.storage.save({
            key: 'stars',
            data: stars.filter(e => e !== this.docId),
          });
          ToastAndroid.show('已取消收藏!', ToastAndroid.SHORT);
          this.setState({modalVisible: false, isStar: true});
        });
    } else {
      global.storage
        .load({
          key: 'docId',
          autoSync: false,
        })
        .then(res => {
          global.storage
            .load({
              key: 'stars',
              autoSync: false,
            })
            .then(stars => {
              global.storage.save({
                key: 'stars',
                data: Array.from(new Set([res, ...stars])),
              });
              ToastAndroid.show('已收藏!', ToastAndroid.SHORT);
              this.setState({modalVisible: false, isStar: true});
            })
            .catch(() => {
              global.storage.save({
                key: 'stars',
                data: [res],
              });
              ToastAndroid.show('已收藏!', ToastAndroid.SHORT);
              this.setState({modalVisible: false, isStar: true});
            });
        })
        .catch(err => {
          console.warn(err.message);
        });
    }
  };

  onShare = async () => {
    // const {describe, name} = this.props.navigation.state.params;
    await Share.share({
      title: 'web前端中文文档',
      message:
        '深入挖掘国外前端新领域，为中国 Web 前端开发人员提供优质文档！APP下载: https://coolapk.com/apk/org.frontend.doc',
    });

    this.setState({modalVisible: false});
  };

  render() {
    return (
      <Fragment>
        <TouchableNativeFeedback
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <View
            style={{
              justifyContent: 'center',
              marginRight: scaleSizeW(20),
              padding: scaleSizeW(20),
            }}>
            <Text style={{fontSize: scaleSizeW(34), color: '#fff'}}>更多</Text>
          </View>
        </TouchableNativeFeedback>

        <Modal
          animationType="fade"
          transparent
          hardwareAccelerated
          onRequestClose={() => this.setModalVisible(false)}
          visible={this.state.modalVisible}>
          <TouchableWithoutFeedback onPress={() => this.setModalVisible(false)}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View style={styles.modalContainer}>
                <TouchableNativeFeedback onPress={() => this.onStar()}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>
                      {this.state.isStar ? '取消收藏' : '收藏'}
                    </Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                  onPress={() => {
                    this.onShare();
                  }}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>分享</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Fragment>
    );
  }
}

export default class Doc extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      modalVisible: false,
    };
  }

  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title'),
    headerStyle: {
      backgroundColor: config.themeColor,
    },
    headerRight: (
      <View style={{flex: 1}}>
        <PaperMenu />
      </View>
    ),
  });

  componentDidMount() {
    const {_id} = this.props.navigation.state.params;
    global.storage.save({
      key: 'docId',
      data: _id,
    });
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  onBackAndroid = () => {
    const {goBack, setParams} = this.props.navigation;
    setParams({a: '回调参数'});
    goBack();
  };

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  render() {
    const {isVisible} = this.state;
    const {url} = this.props.navigation.state.params;
    return (
      <Fragment>
        <Spinner
          isVisible={isVisible}
          size={scaleSizeW(50)}
          type="CircleFlip"
          color={config.themeColor}
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
    top: getScreenH() / 2 - scaleSizeW(100),
    zIndex: 999,
  },

  modalContainer: {
    position: 'absolute',
    top: getScreenH() / 2 - scaleSizeW(120),
    left: scaleSizeW(750 / 2 - 200),
    width: scaleSizeW(400),
    height: scaleSizeW(240),
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: scaleSizeW(10),
    elevation: 4,
    backgroundColor: '#fff',
  },

  button: {
    width: scaleSizeW(400),
    height: scaleSizeW(80),
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#000',
    fontSize: scaleSizeW(34),
  },
});

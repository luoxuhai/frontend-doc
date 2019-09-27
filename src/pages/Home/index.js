import React, {Component, Fragment} from 'react';
import {FlatList, StatusBar, BackHandler, ToastAndroid} from 'react-native';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import Card from './components/Card';
import Loading from '@/components/Loading';
import {getDocs, getDocsById} from '@/services/doc';
import {scaleSizeW} from '@/utils/utils';
import config from '@/config';

const ITEM_HEIGHT = scaleSizeW(220);

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: {},
      isLoading: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      isRefreshing: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      offset: null,
      tabs: [
        {
          label: '我的收藏',
        },
        {
          label: '前端框架',
        },
        {
          label: '语言标准',
        },
        {
          label: 'Vue生态',
        },
        {
          label: 'React 生态',
        },
        {
          label: 'Angular 生态',
        },
        {
          label: 'Node.js 生态',
        },
        {
          label: '可视化',
        },
        {
          label: '其他',
        },
      ],
    };

    this.current = 1;
    this.page = [1];
    this.per_page = [10];
    this.total = [1];
  }

  static navigationOptions = ({navigation}) => ({
    title: 'web前端中文文档',
    headerStyle: {
      elevation: 0,
      backgroundColor: config.themeColor,
    },
  });

  componentDidMount() {
    this.queryDocs(1);
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  onBackAndroid = () => {
    if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
      BackHandler.exitApp();
      return;
    }
    this.lastBackPressed = Date.now();
    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
    return true;
  };

  handleEnterClick = (_id, url, title) => {
    const {navigate} = this.props.navigation;
    navigate('DocScreen', {
      _id,
      url,
      title,
      callBack: e => {
        console.log('e: ', e);
      },
    });
  };

  queryDocs = (key, refresh = true) => {
    const {docs, tabs, isLoading, isRefreshing} = this.state;
    if (!this.page[key]) {
      this.page[key] = 1;
    }
    if (!this.per_page[key]) {
      this.per_page[key] = 10;
    }
    if (!this.total[key]) {
      this.total[key] = 1;
    }

    if (this.page[key] > this.total[key]) {
      isLoading[key] = isRefreshing[key] = false;
      this.setState(() => ({
        isLoading,
        isRefreshing,
      }));
      return;
    } else {
      isLoading[key] = true;
      this.setState(() => ({
        isLoading,
      }));
    }

    getDocs({
      page: this.page[key] || 1,
      per_page: this.per_page[key] || 10,
      label: tabs[key].label,
    }).then(res => {
      const {docs: newDocs, total, per_page} = res.data;
      this.setState(() => ({
        docs: {
          ...docs,
          ...{
            [key]: refresh ? newDocs : [...docs[key], ...newDocs],
          },
        },
      }));

      if (this.page >= total) {
        isLoading[key] = false;
        this.setState(() => ({
          isLoading,
        }));
      }
      this.page[key]++;
      this.per_page[key] = per_page;
      this.total[key] = total || 1;
      isRefreshing[key] = false;
      this.setState(() => ({
        isRefreshing,
      }));
    });
  };

  onRefresh = () => {
    const {isRefreshing} = this.state;
    isRefreshing[this.current] = true;
    this.page[this.current] = 1;
    this.setState({
      isRefreshing,
    });
    if (this.current === 0) {
      this.getStars();
    } else {
      this.queryDocs(this.current);
    }
  };

  onEndReached = () => {
    if (this.current === 0) {
      this.getStars();
    } else {
      this.queryDocs(this.current, false);
    }
  };

  onChangeTab = e => {
    if (e.i === 0) {
      this.getStars(e.i);
    } else if (this.current === e.i || !this.state.docs[e.i]) {
      this.setState(() => ({
        offset: 0,
      }));
      this.page[e.i] = 1;
      this.queryDocs(e.i);
    }
    this.current = e.i;
  };

  getStars = key => {
    const {docs, isRefreshing, isLoading} = this.state;

    global.storage
      .load({
        key: 'stars',
        autoSync: false,
      })
      .then(id => {
        getDocsById({id: JSON.stringify(id)}).then(res => {
          const {docs: newDocs} = res.data;
          isLoading[key] = isRefreshing[key] = false;
          this.setState({
            docs: {
              ...docs,
              ...{
                [0]: newDocs,
              },
            },
            isLoading,
            isRefreshing,
          });
        });
      });
  };

  render() {
    const {docs, tabs, isLoading, isRefreshing, offset} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="light-content" backgroundColor={config.themeColor} />
        <ScrollableTabView
          style={{backgroundColor: config.blankColor}}
          renderTabBar={() => (
            <ScrollableTabBar
              style={{
                borderBottomWidth: 0,
                elevation: 4,
              }}
            />
          )}
          onChangeTab={this.onChangeTab}
          initialPage={1}
          scrollWithoutAnimation={true}
          tabBarUnderlineStyle={{backgroundColor: config.themeColor}}
          tabBarBackgroundColor="#FFFFFF"
          tabBarActiveTextColor={config.themeColor}
          tabBarInactiveTextColor="#999"
          tabBarTextStyle={{fontSize: scaleSizeW(34)}}>
          {tabs.map((e, i) => (
            <FlatList
              key={e.label}
              tabLabel={e.label.replace(' ', '')}
              onRefresh={this.onRefresh}
              onEndReached={this.onEndReached}
              refreshing={isRefreshing[i]}
              onEndReachedThreshold={1}
              scrollToOffset={{offset}}
              getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              ListFooterComponent={() => {
                return <Loading isLoading={isLoading[i]} />;
              }}
              data={docs[i]}
              renderItem={({item}) => (
                <Card doc={item} onEnterClick={this.handleEnterClick} />
              )}
            />
          ))}
        </ScrollableTabView>
      </Fragment>
    );
  }
}

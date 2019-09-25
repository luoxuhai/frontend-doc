import React, {Component, PureComponent, Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  View,
  Text,
  StatusBar,
} from 'react-native';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import Card from './components/Card';
import Loading from '@/components/Loading';
import {getDocs} from '@/services/doc';
import {scaleSizeW} from '@/utils/utils';

const ITEM_HEIGHT = scaleSizeW(220);

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: {},
      // current: 1,
      // page: [1],
      // per_page: [10],
      // total: [1],
      isLoading: false,
      isRefreshing: false,
      offset: null,
      tabs: [
        {
          tabLabel: '我的收藏',
        },
        {
          tabLabel: '前端框架',
        },
        {
          tabLabel: '语言标准',
        },
        {
          tabLabel: 'React生态',
        },
        {
          tabLabel: 'Angular生态',
        },
        {
          tabLabel: 'Node.js生态',
        },
        {
          tabLabel: '可视化',
        },
        {
          tabLabel: '其他',
        },
      ],
    };

    this.current = 1;
    this.page = [1];
    this.per_page = [10];
    this.total = [1];
  }

  componentDidMount() {
    this.queryDocs(1);
  }

  handleEnterClick = (url, title) => {
    const {navigation} = this.props;
    navigation.navigate('DocScreen', {
      url,
      title,
    });
  };

  queryDocs = (key, refresh = true) => {
    const {docs} = this.state;
    if (this.page[key] > this.total[key]) {
      this.setState(() => ({
        isLoading: false,
      }));
      return;
    } else {
      this.setState(() => ({
        isLoading: true,
      }));
    }

    getDocs().then(res => {
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
        this.setState(() => ({
          isLoading: false,
        }));
      }
      this.page[key]++;
      this.per_page[key] = per_page;
      this.total[key] = total || 1;
      this.setState(() => ({
        // page,
        // per_page,
        // total,
        isRefreshing: false,
      }));
    });
  };

  onRefresh = () => {
    // const {current} = this.state;
    this.setState(() => ({
      isRefreshing: true,
    }));
    this.queryDocs(this.current);
  };

  onEndReached = () => {
    // const {current} = this.state;
    this.queryDocs(this.current, false);
  };

  onChangeTab = e => {
    // this.setState(() => ({
    //   current: e.i,
    // }));
    if (this.current === e.i || !this.state.docs[e.i]) {
      this.setState(() => ({
        offset: 0,
      }));

      this.queryDocs(e.i);
    }
    this.current = e.i;
  };

  render() {
    const {docs, tabs, isLoading, isRefreshing, offset} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />
        <ScrollableTabView
          style={{backgroundColor: '#f7f7f7'}}
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
          tabBarUnderlineStyle={{backgroundColor: '#158bb8'}}
          tabBarBackgroundColor="#FFFFFF"
          tabBarActiveTextColor="#158bb8"
          tabBarInactiveTextColor="#999"
          tabBarTextStyle={{fontSize: scaleSizeW(34)}}>
          {tabs.map((e, i) => (
            <FlatList
              key={e.tabLabel}
              tabLabel={e.tabLabel}
              onRefresh={this.onRefresh}
              onEndReached={this.onEndReached}
              refreshing={isRefreshing}
              onEndReachedThreshold={100}
              scrollToOffset={{offset}}
              getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              ListFooterComponent={() => {
                return <Loading isLoading={isLoading} />;
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

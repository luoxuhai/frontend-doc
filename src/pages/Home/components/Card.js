import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableNativeFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {scaleSizeW} from '@/utils/utils';
import config from '@/config';

export default class Card extends Component {
  static propTypes = {
    onEnterClick: PropTypes.func,
    doc: PropTypes.object,
  }
  render() {
    const { url, name, describe, logo, _id } = this.props.doc;
    return (
      <TouchableNativeFeedback onPress={() => this.props.onEnterClick(_id, url, name, describe)}>
        <View style={styles.container}>
          <FastImage
            style={styles.logo}
            source={{
              uri: logo,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View style={styles.descContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.desc} numberOfLines={3}>
              {describe}
            </Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scaleSizeW(10),
    marginTop: scaleSizeW(20),
    padding: scaleSizeW(10),
    width: scaleSizeW(730),
    height: scaleSizeW(200),
    backgroundColor: '#fff',
  },

  logo: {
    width: scaleSizeW(130),
    height: scaleSizeW(130),
  },

  descContainer: {
    flex: 1,
    marginLeft: scaleSizeW(30),
    justifyContent: 'space-between',
  },

  desc: {
    fontSize: scaleSizeW(26),
    color: '#9e9e9e',
    lineHeight: scaleSizeW(32),
  },

  name: {
    marginBottom: scaleSizeW(10),
    fontSize: scaleSizeW(36),
    fontWeight: '500',
    color: config.themeColor,
  },
});

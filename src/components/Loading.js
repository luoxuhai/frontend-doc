import React, {PureComponent} from 'react';
import {Text, View, ActivityIndicator, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {scaleSizeW} from '@/utils/utils';

export default class Loading extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool,
    tip: PropTypes.string,
  };
  render() {
    const {isLoading, tip = '没有更多了'} = this.props;
    return (
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" animating={true} />
        ) : (
          <Text style={styles.text}>{tip}</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: scaleSizeW(100),
    justifyContent: 'center',
  },

  text: {
    textAlign: 'center',
    fontSize: scaleSizeW(32),
  },
});

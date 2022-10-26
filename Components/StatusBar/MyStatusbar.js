/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StatusBar } from 'react-native';
import styles from './styles';

const MyStatusbar = ({ backgroundColor, short, ...props }) => (
  <View style={[short ? styles.shortStatusBar : styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

export default MyStatusbar;
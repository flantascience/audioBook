import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Button from '../Button/Button';
import { purchaseOverview } from '../../Misc/Strings';
import { connect } from 'react-redux';
import styles from './styles';

const PurchaseOverview = ({dark, toggleView, onPurchase, onRestore, textStyle, containerStyle}) => {
  return (
    <View style={ dark ? styles.mainContainerDark : styles.mainContainer}>
      <View style={containerStyle ? containerStyle : dark ? styles.containerDark : styles.container}>
        <TouchableOpacity onPress={toggleView} style={ dark ? styles.closeOverviewDark : styles.closeOverview }>
          <View style={ dark ? styles.closeOverviewDarkText : styles.closeOverviewText }>
            <Icon 
              color={ dark ? '#fff' : '#000' }
              name={ Platform.OS === "ios" ? `ios-close` : `md-close` }
              size={ 30 }
            />
          </View>
        </TouchableOpacity>
        <Text style={textStyle ? textStyle : dark ? styles.titleTextDark : styles.titleText}>{ purchaseOverview.intro }</Text>
        <View style={styles.buttonsContainer}>
          <Button onPress={onPurchase} style={dark ? styles.buttonStyleDark : styles.buttonStyle} title={'Purchase'} />
          <Button onPress={onRestore} style={dark ? styles.buttonStyleDark : styles.buttonStyle} title={'Restore'} />
        </View>
      </View>
    </View>
  )
}

const mapStateToProps = state => {
  return {
    genInfo: state.genInfo
  }
}

export default connect(mapStateToProps)(PurchaseOverview);
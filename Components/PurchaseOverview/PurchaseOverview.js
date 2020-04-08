import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import Button from '../Button/Button';
import { purchaseOverview } from '../../Misc/Strings';
import { connect } from 'react-redux';
import styles from './styles';

const PurchaseOverview = ({dark, isPurchasing, toggleView, onPurchase, onRestore, textStyle, containerStyle}) => {
    useEffect(() => {
        console.log(isPurchasing)
    })
  return (
    <View style={ dark ? styles.mainContainerDark : styles.mainContainer}>
      <View style={ !isPurchasing ? containerStyle ? containerStyle : dark ? styles.containerDark : styles.container : styles.containerProcessing}>
        { !isPurchasing ? 
        <TouchableOpacity onPress={toggleView} style={ dark ? styles.closeOverviewDark : styles.closeOverview }>
          <View style={ dark ? styles.closeOverviewDarkText : styles.closeOverviewText }>
            <Icon 
              color={ dark ? '#fff' : '#000' }
              name={ Platform.OS === "ios" ? `ios-close` : `md-close` }
              size={ 30 }
            />
          </View>
        </TouchableOpacity> :
        null }
        { !isPurchasing ? 
        <View>
            <Text style={textStyle ? textStyle : dark ? styles.titleTextDark : styles.titleText}>{ purchaseOverview.intro }</Text>
            <View style={styles.buttonsContainer}>
                <Button onPress={onPurchase} style={dark ? styles.buttonStyleDark : styles.buttonStyle} title={'Purchase'} />
                <Button onPress={onRestore} style={dark ? styles.buttonStyleDark : styles.buttonStyle} title={'Restore'} />
            </View>
        </View> :
        <ActivityIndicator 
            size="large" 
            color="#D4D4D4"
            style={{ marginTop: "10%" }}
        /> 
        }
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
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './style';


const Toast = ({text, dark}) => {
    return(
        <View style={ dark ? styles.containerDark : styles.container }>
            <Text style={ dark ? styles.textDark : styles.text }>{ text }</Text>
        </View>
    )
}

export default Toast;




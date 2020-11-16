import React from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import {
    Platform,
    Text,
    TouchableOpacity
} from 'react-native';
import { styles } from './style';

const mode = 'dark'; //eventEmitter.currentMode;
const IconButton = ({name, active, onPress, ...props})=>{

    return(
        <TouchableOpacity onPress={ onPress } style={ props.style}>
            <Icon
                name={ Platform.OS === "ios" ? `ios-${name}` : `md-${name}`}
                size={ props.size }
                style={ props.iconStyle }
            />
            <Text style={ active && mode === 'dark' ? styles.iconTextActive : styles.iconText }>{ props.text }</Text>
        </TouchableOpacity>
    )
}

export default IconButton;
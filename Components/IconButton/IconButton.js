import React from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import propTypes from 'prop-types';
import {
    Platform,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { styles } from './style';
const IconButton = ({name, onPress, ...props})=>{
    return(
        <TouchableOpacity onPress={ onPress } style={ props.style}>
            <Icon
                name={ Platform.OS === "ios" ? `ios-${name}` : `md-${name}`}
                size={ props.size }
                style={ styles.icon }
            />
            <Text style={ styles.iconText }>{ props.text }</Text>
        </TouchableOpacity>
    )
}

IconButton.defaultProps = {
    size: 30
}

IconButton.propTypes = {
    size: propTypes.number
}

export default IconButton;
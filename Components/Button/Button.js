import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from './styles';

const Button = ({ title, onPress, dark }) => {
    return (
        <TouchableOpacity 
            style={ dark ? styles.buttonStyleDark : styles.buttonStyle }
            onPress = { onPress }
        >
            <Text style={ styles.buttonText }>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

Button.propTypes = {
    title: PropTypes.string.isRequired,
    style: PropTypes.object,
    onPress: PropTypes.func.isRequired
}

export default Button;
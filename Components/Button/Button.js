import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from './styles';

const Button = props => {
    const { title, style, onPress } = props;
    return (
        <TouchableOpacity 
            style={ style || styles.buttonStyle }
            onPress = { onPress}
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
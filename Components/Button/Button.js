/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from './styles';

const Button = ({ title, image, imageStyle, onPress, dark, style, textStyle }) => {
    return (
        <TouchableOpacity
            style={style ? style : dark ? styles.buttonStyleDark : styles.buttonStyle}
            onPress={onPress}
        >
            {title ? <Text style={textStyle ? textStyle : styles.buttonText}>
                {title}
            </Text> : null}
            <Image style={imageStyle} source={image} />
        </TouchableOpacity>
    )
}

Button.propTypes = {
    title: PropTypes.string,
    style: PropTypes.object,
    onPress: PropTypes.func.isRequired,
    image: PropTypes.number,
    imageStyle: PropTypes.object
}

export default Button;
import React from 'react';
import Iconicon from "../Icon/Iconicon";
import {
    View,
    Text,
    Image
} from 'react-native';
import { footer } from '../../Misc/Strings';
import { styles } from './style';

const Footer = ()=>{
    return(
        <View style={ styles.container }>
            <Iconicon
                name={'home'}
                style = { styles.icon }
            />
        </View>
    )
}

export default Footer;

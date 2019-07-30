import React from 'react';
import IconButton from "../IconButton/IconButton";
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
            <IconButton
                name={'home'}
                style = { styles.icon }
                text={'Home'}
            />
            <IconButton
                name={'volume-high'}
                style = { styles.icon }
                text={'Tracks'}
            />
            <IconButton
                name={'person'}
                style = { styles.icon }
                text={'Author'}
            />
        </View>
    )
}

export default Footer;

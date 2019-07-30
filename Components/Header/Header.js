import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';
import { header } from '../../Misc/Strings';
import { styles } from './style';

const Header = ()=>{
    return(
        <View style={ styles.header }>
            <View style={ styles.navLogoConatiner }>
                <Image style={ styles.navLogo } source={require('./images/crzy-head-shot-trans.png')} />
            </View>
            <View style={ styles.headerTextContainer}>
                <Text style={ styles.headerText }>{ header.headerText }</Text>
                <Text style = { styles.subHeaderText }>{ header.subHeaderText }</Text>
            </View>
        </View>
    )
}

export default Header;

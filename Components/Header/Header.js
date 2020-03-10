import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    Image
} from 'react-native';
import { header } from '../../Misc/Strings';
import { styles } from './style';
import { eventEmitter } from 'react-native-dark-mode'

const Header = ({ playingIntro, Android }) => {
    const [mode = eventEmitter.currentMode, changeMode] = useState();
    useEffect(() => {
        let currentMode = eventEmitter.currentMode;
        changeMode(currentMode);
    })

    if (!playingIntro || !Android)
    return(
        <View style={ styles.header }>
            <View style={ styles.headerElementsContainer}>
                <View style={ styles.navLogoConatiner }>
                    <Image style={ styles.navLogo } source={require('./images/crzy-head-shot-trans.png')} />
                </View>
                <View style={ styles.textContainer }>
                    <Text style={ mode === 'light' ? styles.headerText : styles.headerTextAlt }>{ header.headerText }</Text>
                    <Text style = { mode === 'light' ? styles.subHeaderText : styles.subHeaderTextAlt }>{ header.subHeaderText }</Text>
                </View>
            </View>
        </View>
    ) 
    else return null;
}

const mapStateToProps = state => {
    return {
        playingIntro: state.media.playingIntro
    }  
}

export default connect(mapStateToProps)(Header);

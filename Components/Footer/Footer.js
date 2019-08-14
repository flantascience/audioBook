import React from 'react';
import IconButton from "../IconButton/IconButton";
import {
    View,
    Text,
    Image
} from 'react-native';
import { footer } from '../../Misc/Strings';
import { styles } from './style';

const Footer = ({ navigation, playing, ...props })=>{
    const { navigate } = navigation;
    function goTo(place){
        navigate(place);
    }
    return(
        <View>
            <View style={ styles.container }>
                <IconButton
                    onPress={ ()=>goTo(footer.home.place) }
                    name={'home'}
                    style = { styles.icon }
                    size={ 35 }
                    text={ footer.home.text }
                />
                <IconButton
                    onPress={ ()=>goTo(footer.tracks.place) }
                    name={'volume-high'}
                    place={ footer.tracks.place }
                    style = { styles.icon }
                    size={ 35 }
                    text={ footer.tracks.text }
                />
                <IconButton
                    onPress={ ()=>goTo(footer.author.place) }
                    name={'person'}
                    place={ footer.author.place }
                    size={ 35 }
                    style = { styles.icon }
                    text={ footer.author.text }
                />
            </View>
        </View>
    )
}

export default Footer;

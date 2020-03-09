import React, { useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import styles from './style';
import soundDark from './sound-play_clear_bg.gif';
import soundLight from './sound-play_white_bg.gif';
import preSoundDark from './sound-play_clear_bg.png';
import preSoundLight from './sound-play_white_bg.png'


const SoundBar = ({ dark, playing }) => {

  useEffect(() => {}, [])

  return (
    <View style={ styles.container }>
      { playing ? 
      <Image style={ styles.soundbar } source={dark ? soundDark : soundLight} /> :
      <Image style={ styles.soundbar } source={dark ? preSoundDark : preSoundLight} /> }
    </View>
  )
}

export default SoundBar;
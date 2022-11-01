/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import styles from './style';
import soundDark from './images/sound-play_clear_bg.gif';
import soundLight from './images/sound-play_white_bg.gif';
import preSoundDark from './images/sound_before_start_clear.png';
import preSoundLight from './images/sound_before_start_white.png';

const SoundBar = ({ dark, playing }) => {
  useEffect(() => { }, []);
  return (
    <View style={styles.container}>
      {playing ?
        <Image style={styles.soundbar} source={dark ? soundDark : soundLight} /> :
        <Image style={styles.soundbar} source={dark ? preSoundDark : preSoundLight} />}
    </View>
  );
};

export default SoundBar;

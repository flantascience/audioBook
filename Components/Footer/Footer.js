import React from 'react';
import { connect } from 'react-redux';
import IconButton from "../IconButton/IconButton";
import {
    View,
    Text,
    Image
} from 'react-native';
import { footer } from '../../Misc/Strings';
import { storeMedia } from '../../Actions/mediaFiles';
import { styles } from './style';

const Footer = (props)=>{
    const { navigate } = props.navigation;
    console.log(props)
    const goTo = (place)=>{
        toggleOverview().then(res=>{
            if(res === "hidden")
                navigate(place);
        }); 
    }

    const toggleOverview = ()=>{
        return new Promise(resolve=>{
            props.store({ showOverview: false });
            resolve('hidden');
        })

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

const mapStateToProps = state => {
    return{
      screen: state.media.screen,
      currentlyPlayingName: state.media.currentlyPlayingName,
      initCurrentlyPlaying: state.media.initCurrentlyPlaying,
      audioFiles: state.media.audioFiles,
      buttonsActive: state.media.buttonsActive,
      showOverview: state.media.showOverview,
      selectedTrackId: state.media.selectedTrackId,
      loaded: state.media.loaded,
      selectedTrack: state.media.selectedTrack,
      currentPostion: state.media.currentPostion,
      showTextinput: state.media.showTextinput
    }
  }

const mapDispatchToProps = dispatch => {
    return {
        store: (media) => {
            dispatch(storeMedia(media));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Footer);

import React from 'react';
import { connect } from 'react-redux';
import IconButton from "../IconButton/IconButton";
import {
    View
} from 'react-native';
import { footer } from '../../Misc/Strings';
import { storeMedia } from '../../Actions/mediaFiles';
import { styles } from './style';

const Footer = (props)=>{
    const { navigate } = props.navigation;
    let { screen, currentlyPlayingName } = props;
    let currPlayingNameLen = currentlyPlayingName.length;
    let hike = currPlayingNameLen > 1?true:false;
    //console.log(props)
    const goTo = (place)=>{
        toggleOverview().then(res=>{
            if(res === "hidden")
                navigate(place);
        }); 
    }

    const toggleOverview = ()=>{
        return new Promise(resolve=>{
            props.store({ showOverview: false, showTextinput: false });
            resolve('hidden');
        });
    }
    return(
        <View style= { hike?styles.altOuterContainer:styles.outerContainer }>
            <View style={ hike?styles.altContainer:styles.container }>
                <IconButton
                    onPress={ ()=>{
                        let newState = {
                            screen: "Home"
                        };
                        props.store(newState);
                        goTo(footer.home.place);
                    } }
                    name={'home'}
                    style = { styles.icon }
                    iconStyle = { screen === "Home"?styles.altIconText:styles.iconText }
                    size={ 25 }
                    text={ footer.home.text }
                />
                <IconButton
                    onPress={ ()=>{
                        let newState = {
                            screen: "Tracks"
                        };
                        props.store(newState);
                        goTo(footer.tracks.place);
                    }}
                    name={'volume-high'}
                    place={ footer.tracks.place }
                    style = { styles.icon }
                    iconStyle = { screen === "Tracks"?styles.altIconText:styles.iconText }
                    size={ 25 }
                    text={ footer.tracks.text }
                />
                <IconButton
                    onPress={ ()=>{
                        let newState = {
                            screen: "Author"
                        };
                        props.store(newState);
                        goTo(footer.author.place); 
                    }}
                    name={'person'}
                    place={ footer.author.place }
                    size={ 25 }
                    style = { styles.icon }
                    iconStyle = { screen === "Author"?styles.altIconText:styles.iconText }
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
      showTextinput: state.media.showTextinput,
      paused: state.media.paused
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

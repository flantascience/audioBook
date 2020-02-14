import TrackPlayer from 'react-native-track-player';

module.exports = async ()=> {
    //code goes here
    TrackPlayer.addEventListener('remote-play', async () => {
        TrackPlayer.play();
        //this.props.store({ paused: false });
    });

    TrackPlayer.addEventListener('remote-pause', async () => {
        TrackPlayer.pause();
        //this.props.store({ paused: true });
    });

    TrackPlayer.addEventListener('remote-stop', async () => {
        TrackPlayer.stop();
        //this.props.store({ paused: true });
    });

    TrackPlayer.addEventListener('remote-previous', async () => {
        TrackPlayer.skipToPrevious();
    });
  
    TrackPlayer.addEventListener('remote-next', async () => {
        TrackPlayer.skipToNext();
    });
}
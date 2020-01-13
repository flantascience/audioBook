import TrackPlayer from 'react-native-track-player';

module.exports = async ()=> {
    //code goes here
    TrackPlayer.addEventListener('remote-play', async ()=> {
      TrackPlayer.play();
    });
    TrackPlayer.addEventListener('remote-pause', async ()=> {
      TrackPlayer.pause();
    });
    TrackPlayer.addEventListener('remote-stop', async ()=> {
      TrackPlayer.stop();
    });
}
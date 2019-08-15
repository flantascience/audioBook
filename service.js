import TrackPlayer from 'react-native-track-player';
import configureStore from './store';
const store = configureStore();

module.exports = async data=> {
    //code goes here
    this.onRemotePlay = TrackPlayer.addEventListener('remote-play', async data=> {
        TrackPlayer.play();
      });
      this.onRemotePause = TrackPlayer.addEventListener('remote-pause', async data=> {
        TrackPlayer.pause();
      });
      this.onRemoteRewind = TrackPlayer.addEventListener('remote-jump-backward', async data=> {
        //let { currentPostion } = data.state;
        TrackPlayer.getPosition().then(res=>{
          let currPos = Math.floor(parseFloat(res));
          let newPos = currPos - 10;
          TrackPlayer.seekTo(newPos);
        }).catch(err=>{
          console.log(err)
        })
      });
      this.onRemoteFastForward = TrackPlayer.addEventListener('remote-jump-forward', async data=> {
        TrackPlayer.getPosition().then(res=>{
          let currPos = Math.floor(parseFloat(res));
          let newPos = currPos + 15;
          TrackPlayer.seekTo(newPos);
        }).catch(err=>{
          console.log(err)
        })
      });
      this.onRemoteSkipBack = TrackPlayer.addEventListener('remote-previous', async data=> {
        //let { currentPostion } = data.state;
        TrackPlayer.getPosition().then(res=>{
          let currPos = Math.floor(parseFloat(res));
          let newPos = currPos - 10;
          TrackPlayer.seekTo(newPos);
        }).catch(err=>{
          console.log(err)
        })
      });
      this.onRemoteSkipForward = TrackPlayer.addEventListener('remote-next', async data=> {
        TrackPlayer.getPosition().then(res=>{
          let currPos = Math.floor(parseFloat(res));
          let newPos = currPos + 15;
          TrackPlayer.seekTo(newPos);
        }).catch(err=>{
          console.log(err)
        })
      });
}
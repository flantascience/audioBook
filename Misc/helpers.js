import TrackPlayer from "react-native-track-player";

export const formatTime = (inSeconds) => {
    let time = Math.floor(parseInt(inSeconds)/60);
    let rem = parseInt(inSeconds) % 60;
    let formattedTime = "00:00";
    if(time === 0 && rem > 0){
        formattedTime =  "00:" + showTwoPlaces(rem);
    }else if(time >= 1 && time <= 60){
        let minutes = Math.floor(parseInt(inSeconds)/60);
        let seconds = parseInt(inSeconds) % 60;
        formattedTime = showTwoPlaces(minutes) + ":" + showTwoPlaces(seconds);
    }else if(time > 60){
        let hours = Math.floor(parseInt(inSeconds)/3600);
        let minsNsecs = parseInt(inSeconds) % 3600;
        let minutes = Math.floor(parseInt(minsNsecs)/60);
        seconds = parseInt(minsNsecs) % 60;
        formattedTime = showTwoPlaces(hours) + ":" + showTwoPlaces(minutes) + ":" + showTwoPlaces(seconds); 
        
    } 
    return formattedTime;
}

export const getCurrentTrack = async ()=> {

    let currentTrack = await TrackPlayer.getCurrentTrack();
    return currentTrack;
    
}
export const getTrack = async (trackId)=> {

    let track = await TrackPlayer.getTrack(trackId);
    return track;
} 
export const getPlayerState = async ()=> {

    let state = await TrackPlayer.getState();
    return state;

}
export const removeTrack =  () => {
    return new Promise(resolve => {
        TrackPlayer.reset().then(() => {
            resolve("removed");
        }).catch(err => {
            resolve({ message: err.message});
        }); 
    })
}

export const getDuration = async ()=> {
    let duration = await TrackPlayer.getDuration();
    return duration;
}

export const showTwoPlaces = (num) => {
    num = num.toString();
    let numLen = num.length;
    if(numLen == 2){
        return(num);
    }else if(numLen === 1){
        num = "0"+ num;
        return(num);
    }else{
        return("00");
    }
}

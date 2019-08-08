import firebase from "react-native-firebase";

export const storageRef = firebase.storage().ref();

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

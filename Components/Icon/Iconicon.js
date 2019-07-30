import React from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import {
    Platform
} from 'react-native';

const Iconicon = ({name, ...props})=>{
    return(
        <Icon
            name={Platform.OS === "ios" ? `ios-${name}` : `md-${name}`}
            {...props}
        />
    )
}

export default Iconicon;
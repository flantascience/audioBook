import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import PropTypes from 'prop-types';

const Refs = props => {
    let { styles, referencesInfo, showRefs } = props;
    const goTo = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if(supported)
                Linking.openURL(url).catch(error=>{
                    console.log(error);
                });
            else
                console.log("unsupported");
        })
    }
    return(
        <View style={ styles.refsContainer }>
            <View style = { styles.refsBody }>
            { referencesInfo.length > 0 && showRefs?
                Object.keys(referencesInfo).map(ref=>{
                    let text = referencesInfo[ref].text;
                    let url = referencesInfo[ref].url || "";
                    let urlLength = url.length;
                    let number = referencesInfo[ref].number;
                    if(referencesInfo[ref])
                        return(
                        <View key={ref}>
                            <Text>{ " - " + number + ". " + text }</Text>
                            { urlLength>1?<TouchableOpacity onPress={ ()=>goTo(url) }><Text style={ styles.link }>( Link )</Text></TouchableOpacity>:null }
                        </View>)
                    else
                        return 
                }):
                null
            }
            </View>
        </View>
    )

}

Refs.propsTypes = {
    styles: PropTypes.object.isRequired,
    references: PropTypes.array,
    toggleRefsView: PropTypes.func,
    show: PropTypes.bool.isRequired
}

export default Refs;
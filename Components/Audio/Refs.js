import React from 'react';
import { View, Text, Linking } from 'react-native';
import { refsStrings } from '../../Misc/Strings';
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
            {   showRefs && referencesInfo.length > 0?
                <View style={ styles.transparencyStatementContainer } >
                    <Text>
                        <Text style={ styles.transparencyStatementTitle }>
                            { refsStrings.transparencyStatementTitle }
                        </Text>
                        <Text style={ styles.transparencyStatementText }>
                            { refsStrings.transparencyStatementText }
                        </Text>
                    </Text>
                </View>:
                null
            }
            { 
                showRefs?
                referencesInfo.length > 0?
                Object.keys(referencesInfo).map(ref=>{
                    if(referencesInfo[ref]){
                        let text = referencesInfo[ref].text;
                        let url = referencesInfo[ref].url || "";
                        let urlLength = url.length;
                        let number = referencesInfo[ref].number;
                        return(
                        <View style={ styles.refRowContainer } key={ref}>
                            <Text style={ styles.refText }>
                                { " - " + number + ". " + text }
                                { urlLength>1?<Text onPress={ ()=>goTo(url) } style={ styles.link }>( Link )</Text>:null }
                            </Text>
                        </View>)
                    }else
                        return 
                }):
                <View style={ styles.refRowContainer }>
                    <Text style={ styles.noRefsText }>
                        { refsStrings.noRefs }
                    </Text>
                </View>:
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
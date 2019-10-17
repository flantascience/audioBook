import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

const Refs = props => {
    let { styles, referencesInfo, toggleRefsView, showRefs } = props;
    return(
        <View style={ styles.refsContainer }>
           <TouchableOpacity onPress = { ()=>toggleRefsView() } style={ styles.refsAccordionHeader }>
               <Text style={{ flex: 8, textAlign: "center", fontWeight: "bold" }}>References and Links</Text>
               <Icon style={{ flex:1 }} name="ios-arrow-dropdown" size={25} />
            </TouchableOpacity>
            <View style = { styles.refsBody }>
            { referencesInfo.length > 0 && showRefs?
                Object.keys(referencesInfo).map(ref=>{
                    if(referencesInfo[ref])
                        return(<Text key={ref}>{String(parseInt(ref) + 1) + " - " + referencesInfo[ref]}</Text>)
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
import React, {/* useEffect */} from 'react';
import { 
    View, 
    Text, 
    Linking, 
    ActivityIndicator,
    Dimensions
} from 'react-native';
import firebase from 'react-native-firebase';
import { refsStrings } from '../../Misc/Strings';
import PropTypes from 'prop-types';

const Analytics = firebase.analytics();
const width = Dimensions.get('window').width;
const Refs = ({ styles, fetching, connected, referencesInfo, references, showRefs, currentlyPlayingName, dark }) => {
    /*useEffect(() => {
        console.log(connected);
    }, [])*/
    const showStatement = references.length > 0;
    const goTo = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Analytics.logEvent('references_clicked_prod', {tracks: currentlyPlayingName, urls: url});
                Linking.openURL(url).catch(error => {
                    console.log(error);
                });
            }
            else console.log("unsupported");
        })
    }
    return(
        <View style={ styles.refsContainer }>
            <View style = { styles.refsBody }>
            {  showRefs && referencesInfo.length > 0 ?
                <View style={ styles.transparencyStatementContainer } >
                    <Text>
                        <Text style={ dark ? styles.transparencyStatementTitleDark : styles.transparencyStatementTitle }>
                            { showStatement ? refsStrings.transparencyStatementTitle : null }
                        </Text>
                        <Text style={ dark ? styles.transparencyStatementTextDark : styles.transparencyStatementText }>
                            { showStatement ? refsStrings.transparencyStatementText : null }
                        </Text>
                    </Text>
                </View>:
                null
            }
            {
                showRefs ?
                references.length > 0 ?
                referencesInfo.length > 0 ?
                Object.keys(referencesInfo).map(ref => {
                    if (referencesInfo[ref]) {
                        let text = referencesInfo[ref].text;
                        let url = referencesInfo[ref].url || "";
                        let urlLength = url.length;
                        let number = referencesInfo[ref].number;
                        return(
                        <View style={ styles.refRowContainer } key={ref}>
                            <Text style={ dark ? styles.refTextDark : styles.refText }>
                                { " - " + number + ". " + text + ' ' }
                                { urlLength > 1 ?
                                <Text onPress={ () => goTo(url) } style={ dark ? styles.linkDark : styles.link }>Link</Text> : 
                                null }
                            </Text>
                        </View>)
                    }
                    else return 
                }) :
                <Text style = { dark ? styles.noRefsTextDark : styles.noRefsText }>
                    { connected ? refsStrings.noRefs : refsStrings.noConnection }
                </Text> :
                <View style={ styles.refRowContainer }>
                    { fetching && connected ? 
                        <View style={{display: 'flex', width: width - 70}}>
                            <ActivityIndicator
                                size="small" 
                                color={ dark ? "#D4D4D4" : "#000" }
                                style={{ marginBottom: "10%" }}
                            />
                        </View> : 
                    null }
                </View> :
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
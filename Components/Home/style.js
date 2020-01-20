import { StyleSheet, Dimensions } from 'react-native';
import {
    Colors
} from 'react-native/Libraries/NewAppScreen';

export const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    Home: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    homeMid: {
        flex:6,
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        overflow: "hidden"
    },
    overviewContainer: {
        flex: 6,
        overflow: "hidden",
        marginBottom: 40,
        backgroundColor: '#fff'
    },
    IntroductionVideoBeforeLoad: {
        display: "none",
    },
    IntroductionVideo: {
        position: "absolute",
        backgroundColor: "#000",
        bottom:0,
        left: 0,
        right:0,
        top:0
    },
    thumb: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    altOverviewContainer: {
        flex: 2,
        //overflow: "hidden",
        //marginBottom: 30,
        backgroundColor: '#fff'
    },
    altAltOverviewContainer: {
        flex: 2,
        //overflow: "hidden",
        marginBottom: 30,
        backgroundColor: '#fff'
    },
    longAltOverviewContanier: {
        flex: 2,
        //overflow: "hidden",
        marginBottom: -20,
        backgroundColor: '#fff'
    },
    longerAltOverviewContanier: {
        flex: 2,
        //overflow: "hidden",
        marginBottom: -35,
        backgroundColor: '#fff'
    },
    homeFooter: {
        flex:1,
        backgroundColor: "#EBEAEA"
    },
    homeFooterDark: {
        flex:1,
        backgroundColor: "#212121"
    },
    altHomeFooter: {
        height: 60,
        backgroundColor: "#EBEAEA"
    },
    altHomeFooterDark: {
        height: 60,
        backgroundColor: "#212121"
    },
    centerImageContainer: {
        display: "flex",
        flexDirection: "column",
        flex:1,
        alignContent: "center",
        justifyContent: "center"
    },
    centerImage: {
        width: "100%"
    },
    textInput: {
        borderColor: "#A9A8A8",
        borderWidth: 1,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
    audioElement: {
        minHeight: 50,
        elevation: 10,
        zIndex: 1000
    }
});
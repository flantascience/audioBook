import { StyleSheet } from 'react-native';
import {
    Colors
  } from 'react-native/Libraries/NewAppScreen';
import { eventEmitter } from 'react-native-dark-mode';

const mode = eventEmitter.currentMode;
const dark = mode === 'dark';

export const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: dark ? '#000' : '#fff',
    },
    text: {
        color: dark ? '#fff' : '#000',
        marginTop: 50,
        textAlign: 'center'
    },
    Home: {
        display: "flex",
        flexDirection: "column",
        height: "100%"
    },
    homeMid: {
        flex:6,
        overflow: "hidden"
    },
    homeMidDark: {
        flex:6,
        overflow: "hidden",
        backgroundColor: '#000'
    },
    overviewContainer: {
        flex: 6,
        overflow: "hidden",
        backgroundColor: dark ? '#0D0D0D' : '#fff'
    },
    altOverviewContainer: {
        flex: 2,
        //overflow: "hidden",
        //marginBottom: 30,
        backgroundColor: dark ? '#0D0D0D' : '#fff'
    },
    altAltOverviewContainer: {
        flex: 2,
        //overflow: "hidden",
        marginBottom: 30,
        backgroundColor: dark ? '#0D0D0D' : '#fff'
    },
    longAltOverviewContanier: {
        flex: 2,
        //overflow: "hidden",
        marginBottom: -20,
        backgroundColor: dark ? '#0D0D0D' : '#fff'
    },
    longerAltOverviewContanier: {
        flex: 2,
        //overflow: "hidden",
        marginBottom: -35,
        backgroundColor: dark ? '#0D0D0D' : '#fff'
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
        flexDirection: "row"
    },
    centerImage: {
        flex: 1
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
    toastContainer: {
        zIndex: 100000
    },
    trackContainer: {
        paddingTop: 5
    },
    track: {
        borderBottomColor: "rgba(0,0,0, 0.2)",
        borderBottomWidth: 0.5,
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20
    },
    trackDark: {
        borderBottomColor: "#212121",
        borderBottomWidth: 0.5,
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20
    },
    iconsContainer: {
        display: 'flex',
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
        minWidth: 25,
        flex: 2
    },
    trackIcon: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center"
    },
    trackTextWrapper: {
        display: "flex",
        minHeight: 50,
        flexDirection: "column",
        flex: 6
    },
    trackTitle: {
        flex: 1,
        fontWeight: "bold",
        fontSize: 16
    },
    trackTitleDark: {
        flex: 1,
        fontWeight: "bold",
        fontSize: 16,
        color: '#fff'
    },
    trackLength: {
        flex: 1,
        fontSize: 13
    },
    trackLengthDark: {
        flex: 1,
        fontSize: 13,
        color: '#fff'
    },
    audioElement: {
        minHeight: 50,
        elevation: 10,
        zIndex: 1000
    },
    audioElementDark: {
        minHeight: 50,
        backgroundColor: '#0D0D0D',
        elevation: 10,
        zIndex: 1000
    },
    permanentMessage: {
        padding: 10,
        fontSize: 12,
        textAlign: "center",
        fontWeight: "bold",
        backgroundColor: "#EBEAEA",
        fontStyle: "italic"
    },
    nowPlayingText: {
        fontSize: 12
    },
    nowPlayingTextDark: {
        fontSize: 12,
        color: '#fff'
    }
});
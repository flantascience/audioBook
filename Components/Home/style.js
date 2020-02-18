import { StyleSheet, Dimensions, Platform } from 'react-native';
import {
    Colors
} from 'react-native/Libraries/NewAppScreen';
import { eventEmitter } from 'react-native-dark-mode';

const iOS = Platform.OS === "ios" ? true : false;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const mode = eventEmitter.currentMode;
const dark = mode === 'dark';

export const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    Home: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: dark ? '#0D0D0D' : '#fff'
    },
    homeMid: {
        flex:6,
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: dark ? '#0D0D0D' : '#fff'
    },
    overviewContainer: {
        flex: 6,
        overflow: "hidden",
        marginBottom: 40,
        backgroundColor: dark ? '#0D0D0D' : '#fff'
    },
    IntroductionVideoBeforeLoad: {
        display: "none",
    },
    IntroductionVideo: {
        position: "absolute",
        backgroundColor: "#000",
        height,
        bottom:0,
        left: 0,
        right:0,
        top:0
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
    thumb: {
        height,
        width,
        resizeMode: 'contain'
    },
    playButtonContainer: {
        position: 'absolute',
        display:'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        left: 0,
        right: 0,
        bottom: width > 550 ? '25%' : '23%'
    },
    playButton: {
        display:'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderRightWidth: iOS ? 0.5 : 0,
        borderBottomWidth: iOS ? 0.5 : 0,
        borderRightColor: '#757575',
        borderBottomColor: '#757575',
        elevation: iOS ? 0 : 10,
        width: 130,
        height: 50,
        backgroundColor: '#EA4F4F',
    },
    centerImageContainer: {
        display: "flex",
        flexDirection: "column",
        flex:1,
        height: height - 180,
        width,
        alignContent: "center",
        alignItems: "center",
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
    },
    audioElementDark: {
        minHeight: 50,
        backgroundColor: '#0D0D0D',
        elevation: 10,
        zIndex: 1000
    }
});
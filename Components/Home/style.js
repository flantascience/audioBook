import { StyleSheet, Dimensions, Platform } from 'react-native';
import {
    Colors
} from 'react-native/Libraries/NewAppScreen';
//import { eventEmitter } from 'react-native-dark-mode';

const iOS = Platform.OS === "ios" ? true : false;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const currentMode = 'dark'; /* eventEmitter.currentMode; */

const mode = currentMode;
const dark = mode === 'dark';

//console.log(height)

export const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: dark ? '#000' : '#fff',
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
        height: height > 600 ? height - 100 : height - 50,
        bottom:0,
        left: 0,
        right:0,
        top: 0
    },
    altOverviewContainer: {
        flex: 2,
        backgroundColor: dark ? '#0D0D0D' : '#fff'
    },
    altAltOverviewContainer: {
        flex: 2,
        marginBottom: 30,
        backgroundColor: dark ? '#0D0D0D' : '#fff'
    },
    longAltOverviewContanier: {
        flex: 2,
        marginBottom: -20,
        backgroundColor: dark ? '#0D0D0D' : '#fff'
    },
    longerAltOverviewContanier: {
        flex: 2,
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
        height: height > 800 ? height - 200 : 
        height > 600 ? height - 180 : 
        height - 160,
        width,
        resizeMode: 'cover'
    },
    mainTextThumb: {
        position: 'absolute',
        display:'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        left: 0,
        right: 0,
        top: height > 800 ? '23%' : 
        height > 600 ? '20%' : 
        '20%'
    },
    mainTextThumbImg: {
        resizeMode: 'contain',
        width: '90%'
    },
    pressStart: {
        resizeMode: 'contain',
        marginTop: height > 800 ? '20%' : '10%',
        width: '50%'
    },
    playButtonContainer: {
        position: 'absolute',
        display:'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        left: 0,
        right: 0,
        bottom: height > 800 ? '33%' : 
        height > 600 ? '30%' : 
        '25%'
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
        height: 35,
        //paddingTop: 5,
        backgroundColor: '#6FDA44',
    },
    playButtonText: {
        color: '#fff', 
        fontSize: 15, 
        fontFamily: 'Arial', 
        fontWeight: 'bold'
    },
    centerImageContainer: {
        display: "flex",
        flexDirection: "column",
        flex:1,
        height: height > 800 ? 
        height - 220 : height > 600 ? 
        height - 180 : height - 160,
        width,
        borderWidth: 0,
        backgroundColor: dark ? '#000' : '#fff',
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
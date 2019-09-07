import { StyleSheet } from 'react-native';
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
        height: "100%"
    },
    homeMid: {
        flex:6,
        overflow: "hidden"
    },
    overviewContainer: {
        flex: 6,
        overflow: "hidden",
        marginBottom: 40
    },
    altOverviewContainer: {
        flex: 2,
        //overflow: "hidden",
        //marginBottom: 30,
    },
    altAltOverviewContainer: {
        flex: 2,
        //overflow: "hidden",
        marginBottom: 30,
    },
    homeFooter: {
        flex:1,
        backgroundColor: "#EBEAEA"
    },
    altHomeFooter: {
        height: 60,
        backgroundColor: "#EBEAEA"
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
    trackContainer: {
        paddingTop: 5
    },
    track: {
        borderBottomColor: "rgba(0,0,0, 0.2)",
        borderBottomWidth: 0.5,
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20
    },
    trackIcon: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    trackTextWrapper: {
        display: "flex",
        minHeight: 50,
        flexDirection: "column",
        flex: 5
    },
    trackTitle: {
        flex: 1,
        fontWeight: "bold",
        fontSize: 18
    },
    trackLength: {
        flex: 1,
        fontSize: 14
    },
    audioElement: {
        minHeight: 50,
        elevation: 10
    },
    permanentMessage: {
        padding: 10,
        fontSize: 12,
        textAlign: "center",
        fontWeight: "bold",
        backgroundColor: "#EBEAEA",
        fontStyle: "italic"
    }
});
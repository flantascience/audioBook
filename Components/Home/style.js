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
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        overflow: "hidden"
    },
    overviewContainer: {
        flex: 6,
        overflow: "hidden",
        marginBottom: 30
    },
    altOverviewContainer: {
        flex: 1,
        //overflow: "hidden",
        marginBottom: 30
    },
    homeFooter: {
        flex:1,
        padding: 5
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
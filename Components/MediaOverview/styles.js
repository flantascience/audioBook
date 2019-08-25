import { StyleSheet } from 'react-native';
import {
    Colors
  } from 'react-native/Libraries/NewAppScreen';

export const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
        marginBottom: 30
    },
    homeMid: {
        flex:6,
        overflow: "hidden"
    },
    container: {
        display: "flex",
        flexDirection: "column",
        minHeight: 100,
        overflow: "hidden",
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    toggleTrackDetail: {

    },
    posterContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center"
    },
    poster: {
        flex: 1,
        height: 150
    }
});
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
    homeFooter: {
        flex:1,
        padding: 5
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
    centerImageContainer: {
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    authorImage: {
        marginTop: 5,
        height: 200,
        width: 200,
        borderRadius: 100
    },
    name: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 25,
        paddingBottom: 20,
        textTransform: "capitalize"
    },
    introContainer: {
        borderTopColor: "#C7C6C6",
        borderBottomColor: "#C7C6C6",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        marginLeft: 40,
        marginRight: 40,
        paddingTop: 20,
        paddingBottom: 20,
        marginTop: 5,
    },
    introText: {
        textAlign: "center",
        padding: 10,
        fontSize: 17,
    },
    callToAction: {
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: "center",
        fontSize: 25,
        paddingTop: 20,
        paddingBottom: 20,
        fontWeight: "200"
    },
    actionContainer: {
        alignContent: "center",
        justifyContent: "center",
    },
    emailInput: {
        marginTop: 5,
        marginLeft: 30,
        marginRight: 30,
        padding: 5,
        borderColor: "#C7C6C6",
        borderWidth: 1
    },
    buttonContainer:{
        marginTop: 5,
        marginLeft: 30,
        marginRight: 30,
        paddingTop: 20,
        paddingBottom: 20
    },
    audioElement: {
        minHeight: 50,
        elevation: 10
    }
});
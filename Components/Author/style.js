import { StyleSheet } from 'react-native';
import {
    Colors
  } from 'react-native/Libraries/NewAppScreen';

export const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: "#fff"
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
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    authorImage: {
        marginTop: 5,
        height: 150,
        width: 150,
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
    altButtonContainer:{
        marginTop: 5,
        marginLeft: 30,
        marginRight: 30,
        borderColor: "#C7C6C6",
        backgroundColor: "#C7C6C6",
        borderWidth: 1,
    },
    audioElement: {
        minHeight: 50,
        elevation: 10
    },
    spacer: {
        height: 70
    }
});
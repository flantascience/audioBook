import { StyleSheet } from 'react-native';

const mode = 'dark' // eventEmitter.currentMode;
const dark = mode === 'dark';

export const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: dark ? '#000' : '#fff',
    },
    scrollViewDark: {
        backgroundColor: "#000"
    },
    Home: {
        display: "flex",
        flexDirection: "column",
        height: "100%"
    },
    tip_button: {
        padding: 10,
        marginVertical: 3,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ffffff"
    },
    homeMid: {
        flex: 6,
        overflow: "hidden"
    },
    homeMidDark: {
        flex: 6,
        overflow: "hidden",
        backgroundColor: '#000'
    },
    overviewContainer: {
        flex: 6,
        overflow: "hidden",
        marginBottom: 40,
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
        flex: 1,
        backgroundColor: "#EBEAEA"
    },
    homeFooterDark: {
        flex: 1,
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
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    authorImage: {
        marginTop: 30,
        height: 150,
        width: 150,
        borderRadius: 100
    },
    authorTitle: {
        textAlign: "center",
        fontSize: 14,
        paddingBottom: 20
    },
    authorTitleDark: {
        textAlign: "center",
        fontSize: 14,
        paddingBottom: 20,
        color: '#fff'
    },
    name: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 25,
        textTransform: "capitalize"
    },
    nameDark: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 25,
        textTransform: "capitalize",
        color: '#fff'
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
    introContainerDark: {
        borderTopColor: "#757575",
        borderBottomColor: "#757575",
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
    introTextDark: {
        textAlign: "center",
        padding: 10,
        fontSize: 17,
        color: '#fff'
    },
    loading_overlay: {
        position: 'absolute', 
        left: 0, 
        top: 0, 
        bottom: 100,
        right: 0, 
        display: 'flex', 
        backgroundColor: 'rgba(0,0,0, 0.9)', 
        justifyContent:'center', 
        alignItems: 'center',
        zIndex: 1000
    },
    callToAction: {
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: "center",
        fontSize: 18,
        paddingTop: 20,
        paddingBottom: 20,
        fontWeight: "200"
    },
    callToActionDark: {
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: "center",
        fontSize: 18,
        paddingTop: 20,
        paddingBottom: 20,
        fontWeight: "200",
        color: '#fff'
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
    emailInputDark: {
        marginTop: 5,
        marginLeft: 30,
        marginRight: 30,
        padding: 5,
        borderColor: "#757575",
        borderWidth: 1,
        color: '#fff'
    },
    buttonContainer: {
        marginTop: 5,
        marginLeft: 30,
        marginRight: 30,
        paddingTop: 5,
        paddingBottom: 5
    },
    altButtonContainer: {
        marginTop: 5,
        marginLeft: 30,
        marginRight: 30
    },
    button: {
        marginTop: 10,
        marginBottom: 5,
        padding: 10,
        backgroundColor: "#000",
        borderRadius: 2
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
    spacer: {
        height: 70
    }
});
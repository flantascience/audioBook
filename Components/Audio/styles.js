import { StyleSheet, Platform } from 'react-native';
const showBorder = Platform.OS === "ios"?true:false;

export const styles = StyleSheet.create({
    reflection: {
        transform: [{ scaleX: -1 }],
    },
    elContainer: {
        flex:2
    },
    container:{
        display: "flex",
        flexDirection: "column",
        minHeight: 125,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: "#C7C6C6",
        borderWidth: showBorder?1:0,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 0.5,
    },
    altContiner: {
        display: "flex",
        flexDirection: "column",
        minHeight: 125,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: "#C7C6C6",
        borderWidth: showBorder?1:0,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 0.5,
    },
    refsContainer: {
        flex: 6,
        marginTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
        display: "flex",
        zIndex: 0,
        alignItems: "flex-start",
        alignContent: "flex-start",
        flexDirection: "column"
    },
    refsAccordionHeader: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        padding: 10,
        marginTop: 10,
        marginLeft: 30,
        marginRight: 30,
        borderColor: "#C7C6C6",
        borderWidth: 1,
        alignItems: "center",
        zIndex: 100
    },
    refsBody: {
        flex: 20,
        zIndex: 1,
        padding: 10
    },
    refText: {
        fontSize: 12
    },
    noRefsText: {
        fontWeight: "bold",
        fontStyle: "italic"
    },
    transparencyStatementContainer: {
        padding: 4
    },
    transparencyStatementTitle: {
        fontWeight: "bold",
        fontSize: 10,
        fontStyle: "italic"
    },
    transparencyStatementText: {
        fontSize: 10,
        fontStyle: "italic"
    },
    spaceFiller: {
        height: 10
    },
    altSpaceFiller: {
        display: "none"
    },
    toggleTrackDetail: {
        paddingLeft: 10,
        flex: 1
    },
    controllerContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row"
    },
    altControllerContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 100
    },
    audioTitle: {

    },
    altAudioTitle: {
        paddingLeft: 30,
        fontSize: 25,
        fontWeight: "400"
    },
    textDisplay: {
        flex: 5
    },
    textScrollView: {
        flex:1,
        overflow: "hidden"
    },
    textContainer: {
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        marginTop: 20,
        paddingBottom: 20,
        height: "60%"
    },
    altTextDisplay: {
        flex: 2
    },
    buttonGroup: {
        flex: 3,
        display: "flex",
        flexDirection: "row"
    },
    altButtonGroup: {
        flex: 2,
        display: "flex",
        flexDirection: "row"
    },
    groupedButtons: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        //justifyContent: "center"
    },
    altGroupedButtons: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        //justifyContent: "center"
    },
    slider: {
        height: 20,
        justifyContent: "flex-start",
        zIndex: 10000
    },
    volumeSlider: {
        flex: 1
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
    questionareText: {
        marginTop: 5,
        marginLeft: 30,
        marginRight: 30,
        borderColor: "#E0E2E8",
        minHeight: 50,
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 15,
        color: "#000",
        borderWidth: 1
    },
    volumeContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 50
    },
    trackTimeContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        //minHeight: 20,
        marginLeft: 10,
        marginRight: 10,
        zIndex: 10000
    },
    altTrackTimeContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 50,
        marginLeft: 10,
        marginRight: 10
    },
    trackTimeCounterContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        margin: 0
    },
    sliderContainer: {
        color: "#000"
    },
    trackElapsedTime: {
        flex:1,
        alignContent: "flex-start"
    },
    trackRemainingTime: {
        flex:1,
        alignItems: "flex-end"
    },
    volumeImagesContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row"
    },
    volumeDown: {
        flex:1,
        alignContent: "flex-start"
    },
    volumeUp: {
        flex: 1,
        alignItems: "flex-end"
    },
    volumeImage: {
        width: 15,
        height: 20
    },
    trackTime: {

    },
    poster: {
        height: 150
    },
    link: {
        fontStyle: 'italic',
        color: "#2055D4",
        textDecorationLine: "underline",
        textDecorationStyle: "solid"
    },
    refRowContainer: {
    },
    refText: {
        alignSelf: "flex-start"
    },
    refLink: {
        alignSelf: "flex-start"
    },
    questionnaireTitle: {
        fontWeight: "bold",
        fontSize: 17,
        marginLeft: 30,
        marginRight: 30,
        padding: 5,
        textAlign: "center"
    },
    questionnaireLabel: {
        marginLeft: 30,
        marginRight: 30,
        padding: 5
    }
});
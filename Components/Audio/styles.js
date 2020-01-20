import { StyleSheet, Platform, Dimensions } from 'react-native';
const showBorder = Platform.OS === "ios"?true:false;
const height = Math.round(Dimensions.get('window').height);
console.log(height)

export const styles = StyleSheet.create({
    reflection: {
        transform: [{ scaleX: -1 }],
    },
    elContainer: {
        flex:2,
        display: 'flex'
    },
    container:{
        display: "flex",
        flexDirection: "column",
        minHeight: height < 813? 125 : 155,
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
        minHeight: height < 813? 125 : 155,
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
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        fontWeight: "bold",
        fontStyle: "italic",
        textAlign: "center"
    },
    transparencyStatementContainer: {
        padding: 4,
        marginBottom: 10
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
    audioTitle: {},
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
        overflow: "hidden",
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
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
    closePlayerContainer: {
        position: "absolute",
        left: 1,
        borderWidth: 0,
        backgroundColor: "#fff",
        top: showBorder?-30:-24,
        borderColor: "#C7C6C6",
        borderBottomColor: "#fff",
        borderWidth: showBorder?1:0,
        elevation: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 0.2,
        display: "flex",
        alignItems: "center",
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 15,
        paddingRight: 15
    },
    closePlayer: {
        fontSize: 20
    },
    slider: {
        height: 20,
        justifyContent: "flex-start",
        zIndex: 10000
    },
    volumeSlider: {
        flex: 1
    },
    button: {
        marginTop: 10,
        marginBottom: 5,
        padding: 10,
        backgroundColor: "#000",
        borderRadius: 2
    },
    buttonContainer:{
        marginTop: 5,
        marginLeft: 30,
        marginRight: 30,
        paddingTop: 5,
        paddingBottom: 5
    },
    altButtonContainer:{
        marginTop: 5,
        marginLeft: 30,
        marginRight: 30
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
        alignContent: "center",
        justifyContent: "center"
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
        marginTop: 20,
        padding: 5
    }
});
import { StyleSheet, Platform, Dimensions } from 'react-native';
const showBorder = Platform.OS === "ios" ? true : false;
const height = Math.round(Dimensions.get('window').height);

export const styles = StyleSheet.create({
    reflection: {
        transform: [{ scaleX: -1 }],
    },
    elContainer: {
        flex:2,
        display: 'flex',
        backgroundColor: '#fff'
    },
    elContainerDark: {
        flex:2,
        display: 'flex',
        backgroundColor: '#0D0D0D'
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
        backgroundColor: '#fff'
    },
    containerDark:{
        display: "flex",
        flexDirection: "column",
        minHeight: height < 813? 125 : 155,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: "#3C3C3C",
        borderWidth: showBorder?0.5:0,
        elevation: 1,
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
        backgroundColor: '#fff'
    },
    altContinerDark: {
        display: "flex",
        flexDirection: "column",
        minHeight: height < 813? 125 : 155,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: "#3C3C3C",
        borderWidth: showBorder?0.5:0,
        elevation: 1,
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
    refsAccordionHeaderDark: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        padding: 10,
        marginTop: 10,
        marginLeft: 30,
        marginRight: 30,
        borderColor: "#3C3C3C",
        borderWidth: 0.5,
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
    refTextDark: {
        fontSize: 12,
        color: '#fff'
    },
    noRefsText: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        fontWeight: "bold",
        fontStyle: "italic",
        textAlign: "center"
    },
    noRefsTextDark: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        fontWeight: "bold",
        fontStyle: "italic",
        textAlign: "center",
        color: '#fff'
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
    transparencyStatementTitleDark: {
        fontWeight: "bold",
        fontSize: 10,
        fontStyle: "italic",
        color: '#fff'
    },
    transparencyStatementText: {
        fontSize: 10,
        fontStyle: "italic"
    },
    transparencyStatementTextDark: {
        fontSize: 10,
        fontStyle: "italic",
        color: '#fff'
    },
    spaceFiller: {
        height: 10
    },
    spaceFillerDark: {
        height: 10,
        backgroundColor: '#0D0D0D'
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
        color: '#000'
    },
    audioTitleDark: {
        color: '#fff'
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
        position: 'absolute',
        left: 1,
        borderWidth: 0,
        backgroundColor: "#fff",
        top: showBorder ? -29 : -26,
        borderColor: "#C7C6C6",
        borderWidth: showBorder ? 1 : 0,
        borderBottomWidth: 0,
        elevation: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 0.2,
        display: "flex",
        alignItems: "flex-start",
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 15,
        paddingRight: 15, 
        textAlign: 'left'
    },
    closePlayerContainerDark: {
        position: 'absolute',
        left: 1,
        borderWidth: 0,
        backgroundColor: "#0D0D0D",
        top: showBorder ? -28 : -26,
        borderColor: "#757575",
        borderWidth: showBorder ? 0.5 : 0,
        borderBottomWidth: 0,
        elevation: 0,
        shadowColor: '#D4D4D4',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 0.2,
        display: "flex",
        alignItems: "flex-start",
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 15,
        paddingRight: 15,
        textAlign: 'left'
    },
    closePlayer: {
        fontSize: 20
    },
    closePlayerDark: {
        fontSize: 20,
        color: '#fff'
    },
    slider: {
        height: 20,
        justifyContent: "flex-start",
        zIndex: 10000
    },
    sliderDark: {
        height: 20,
        width: 20,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: "flex-start",
        color: '#fff',
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
    questionareTextDark: {
        marginTop: 5,
        marginLeft: 30,
        marginRight: 30,
        borderColor: "#E0E2E8",
        minHeight: 50,
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 15,
        color: "#fff",
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
        zIndex: 10000,
        backgroundColor: '#fff'
    },
    trackTimeContainerDark: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        //minHeight: 20,
        marginLeft: 10,
        marginRight: 10,
        zIndex: 10000,
        backgroundColor: '#0D0D0D'
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
        marginTop: Platform.OS === 'ios' ? 10 : 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        backgroundColor: '#fff'
    },
    trackTimeCounterContainerDark: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        marginTop: Platform.OS === 'ios' ? 10 : 0,
        backgroundColor: '#0D0D0D'
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
        color: '#000'
    },
    trackTimeDark: {
        color: '#fff'
    },
    poster: {
        height: 150
    },
    link: {
        fontWeight: 'bold',
        color: "#2055D4",
        paddingLeft: 5,
        textDecorationLine: "underline",
        textDecorationStyle: "solid"
    },
    linkDark: {
        fontWeight: 'bold',
        color: "#fff",
        paddingLeft: 5,
        textDecorationLine: "underline",
        textDecorationStyle: "solid"
    },
    refRowContainer: {
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center"
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
    questionnaireTitleDark: {
        fontWeight: "bold",
        fontSize: 17,
        marginLeft: 30,
        marginRight: 30,
        padding: 5,
        textAlign: "center",
        color: '#fff'
    },
    questionnaireLabel: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        padding: 5
    },
    questionnaireLabelDark: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        padding: 5,
        color: '#fff'
    }
});
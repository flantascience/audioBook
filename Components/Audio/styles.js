import { StyleSheet, Platform } from 'react-native';
const showBorder = Platform.OS === "ios"?true:false;

export const styles = StyleSheet.create({
    reflection: {
        transform: [{ scaleX: -1 }],
    },
    elContainer: {
        //padding: 5
    },
    container:{
        display: "flex",
        flexDirection: "column",
        minHeight: 100,
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
        minHeight: 300,
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10
    },
    spaceFiller: {
        flex: 6
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
    altTextDisplay: {
        flex: 2
    },
    buttonGroup: {
        flex: 3,
        display: "flex",
        flexDirection: "row"
    },
    altButtonGroup: {
        flex: 3,
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
        flex: 1,
        justifyContent: "flex-start"
    },
    volumeSlider: {
        flex: 1
    },
    questionareText: {
        margin: 5,
        borderColor: "#E0E2E8",
        minHeight: 50,
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
        marginRight: 10
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

    }
});
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container:{
        display: "flex",
        flexDirection: "column",
        minHeight: 100,
        paddingTop: 10,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 10,
        borderTopColor: "#C7C6C6",
        borderTopWidth: 1,
        borderBottomColor: "#7B7A7A",
        borderBottomWidth: 1
    },
    toggleTrackDetail: {
        flex: 1
    },
    controllerContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row"
    },
    textDisplay: {
        flex: 4
    },
    buttonGroup: {
        flex: 3,
        display: "flex",
        flexDirection: "row"
    },
    groupedButtons: {
        flex: 1
    },
    slider: {
        flex: 1
    }
});
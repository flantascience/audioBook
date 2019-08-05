import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container:{
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
    }
});
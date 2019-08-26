import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row"
    },
    iconText: {
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#000"
    },
    altIconText: {
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#A9A8A8"
    },
    icon: {
        alignContent: "center",
        justifyContent: "center",
        flex: 1,
        padding: 5
    },
    activeIcon: {
        alignContent: "center",
        justifyContent: "center",
        flex: 1,
        padding: 5
    }
});
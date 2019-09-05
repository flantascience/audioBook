import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    outerContainer: {
        borderTopColor: "#C7C6C6",
        borderTopWidth: 1,
        backgroundColor: "#EBEAEA"
    },
    altOuterContainer: {
        borderTopColor: "#C7C6C6",
        borderTopWidth: 1,
        backgroundColor: "#EBEAEA",
        paddingBottom: 20
    },
    container: {
        display: "flex",
        flexDirection: "row"
    },
    altContainer: {
        paddingTop: 10,
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
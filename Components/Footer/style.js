import { StyleSheet, Platform } from 'react-native';
const Android = Platform.OS === 'android';

export const styles = StyleSheet.create({
    outerContainer: {
        borderTopColor: "#C7C6C6",
        borderTopWidth: Android ? 0 : 1,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#EBEAEA",
        alignContent: "center",
        alignItems: "center"
    },
    outerContainerDark: {
        borderTopColor: "#525253",
        borderTopWidth: Android ? 0 : 1,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#212121",
        alignContent: "center",
        alignItems: "center"
    },
    altOuterContainer: {
        borderTopColor: "#C7C6C6",
        borderTopWidth: Android ? 0 : 1,
        backgroundColor: "#EBEAEA",
        paddingBottom: 20,
        alignContent: "center",
        alignItems: "center"
    },
    altOuterContainerDark: {
        borderTopColor: "#525253",
        borderTopWidth: Android ? 0 : 1,
        backgroundColor: "#212121",
        paddingBottom: 20,
        alignContent: "center",
        alignItems: "center"
    },
    container: {
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center"
    },
    altContainer: {
        paddingTop: 10,
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center"
    },
    iconText: {
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#A9A8A8"
    },
    iconTextDark: {
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#757575"
    },
    altIconText: {
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#000"
    },
    altIconTextDark: {
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#fff"
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
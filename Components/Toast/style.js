import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 40,
        top: 90,
        paddingRight: 40,
        width: "100%",
        alignContent: "center",
        justifyContent: "center",
        zIndex: 1000
    },
    containerDark: {
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 10,
        top: 90,
        paddingLeft: 40,
        paddingRight: 40,
        width: "100%",
        alignContent: "center",
        justifyContent: "center",
        zIndex: 1000
    },
    text: {
        flex: 1,
        textAlign: "center",
        color: "#fff",
        borderRadius: 2,
        padding: 20,
        backgroundColor: "rgba(0,0,0, 0.6)"
    },
    textDark: {
        flex: 1,
        textAlign: "center",
        color: "#fff",
        borderColor: '#0D0D0D',
        borderRadius: 2,
        padding: 20,
        backgroundColor: "rgba(0,0,0, 1)"
    }
})
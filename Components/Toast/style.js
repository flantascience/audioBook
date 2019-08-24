import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 10,
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
        borderRadius: 5,
        padding: 20,
        backgroundColor: "rgba(0,0,0, 0.6)"
    }
})
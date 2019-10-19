import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    navLogoConatiner: {
        flex: 2,
        alignItems: "flex-end",
        justifyContent: "flex-end"
    },
    navLogo: {
        height: 57,
        width: 50,
    },
    header: {
        width: 300
    },
    headerElementsContainer: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    textContainer: {
        flex: 3,
        display: "flex",
        flexDirection: "column"
    },
    headerText:{
        textTransform: "uppercase",
        fontSize: 18,
        textAlign: "center",
        alignItems: "center",
        fontWeight: "bold",
    },
    subHeaderText: {
        fontSize: 14,
        textAlign: "center",
        alignItems: "center",
        fontWeight: "500",
    }
});
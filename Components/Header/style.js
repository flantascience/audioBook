import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    navLogoConatiner: {
        flex: 2,
        alignItems: "flex-end"
    },
    navLogo: {
        marginLeft: 10,
        marginRight: 10,
        height: 57,
        width: 50,
    },
    header: {
        width: 350,
        display: "flex",
        flexDirection: "row"
    },
    headerTextContainer: {
        flex: 4,
        alignContent: "center",
        justifyContent: "center"
    },
    headerText:{
        textTransform: "uppercase",
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
    subHeaderText: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "500",
    }
});
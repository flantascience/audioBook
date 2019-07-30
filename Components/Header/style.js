import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    navLogoConatiner: {
        flex: 1
    },
    navLogo: {
        marginLeft: 10,
        marginRight: 10,
        height: 50,
        width: 50,
    },
    header: {
        width: 350,
        display: "flex",
        flexDirection: "row"
    },
    headerTextContainer: {
        flex: 3
    },
    headerText:{
        textTransform: "uppercase",
        fontSize: 20,
        fontWeight: "bold",
    },
    subHeaderText: {
        fontSize: 16,
        fontWeight: "500",
    }
});
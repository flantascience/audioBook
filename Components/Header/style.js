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
        width: 300,
        display: "flex",
        flexDirection: "row"
    },
    headerTextContainer: {
        flex: 3
    },
    headerText:{
        fontSize: 20,
        fontWeight: "bold",
    },
    subHeaderText: {
        fontSize: 14,
        fontWeight: "500",
    }
});
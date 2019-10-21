import { StyleSheet, Dimensions } from 'react-native';
const headerWidth = Dimensions.get('window').width;
const imageContainerFlex = headerWidth < 330?2:2;
const textContainerFlex = headerWidth < 330?5:4;
export const styles = StyleSheet.create({
    navLogoConatiner: {
        flex: imageContainerFlex,
        alignItems: "flex-end",
        justifyContent: "flex-end"
    },
    navLogo: {
        height: 57,
        width: 50,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        width: headerWidth,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    headerElementsContainer: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    textContainer: {
        flex: textContainerFlex,
        display: "flex",
        flexDirection: "column"
    },
    headerText:{
        textTransform: "uppercase",
        fontSize: 18,
        width: 180,
        textAlign: "center",
        fontWeight: "bold",
    },
    subHeaderText: {
        fontSize: 14,
        width: 180,
        textAlign: "center",
        fontWeight: "500",
    }
});
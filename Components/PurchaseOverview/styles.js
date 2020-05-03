import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0, 0.6)',
    padding: 5,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000
  },
  mainContainerDark: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255, 0.4)',
    padding: 5,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000
  },
  activityIndicatorContainer: {
    width: 200,
    height: 50
  },
  closeOverviewDark: {
    display: 'flex',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    right: 5,
    top: 0
  },
  closeOverview: {
    display: 'flex',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    right: 5,
    top: 0
  },
  closeOverviewDarkText: {
    fontSize: 15,
    color: '#fff'
  },
  closeOverviewText: {
    fontSize: 15,
    color: '#000'
  },
  container: {
    display: 'flex',
    backgroundColor: '#fff',
    padding: 5,
    margin: 30,
    borderRadius: 6,
    zIndex: 1000
  },
  containerDark: {
    display: 'flex',
    backgroundColor: '#000',
    padding: 5,
    margin: 30,
    borderRadius: 6,
    zIndex: 1000
  },
  containerProcessing: {
    display: 'flex',
    backgroundColor: 'rgba(255,255,255, 0)',
    padding: 5,
    margin: 30,
    borderRadius: 6,
    zIndex: 1000
  },
  titleText: {
    padding: 6,
    display: 'flex',
    color: '#000'
  },
  titleTextDark: {
    padding: 6,
    display: 'flex',
    color: '#fff'
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  buttonStyle: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 2
  },
  buttonStyleDark: {
    flex: 1,
    margin:5,
    padding: 10,
    backgroundColor: "#212121",
    borderRadius: 2
  }
});

export default styles;
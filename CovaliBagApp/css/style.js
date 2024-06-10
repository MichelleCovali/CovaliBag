import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");
const baseWidth = 375; // Base screen width, e.g., iPhone X
const baseHeight = 667; // Base screen height

function responsiveWidth(num) {
  return (width * num) / baseWidth;
}

function responsiveHeight(num) {
  return (height * num) / baseHeight;
}

function responsiveFontSize(fontSize) {
  return (fontSize * width) / baseWidth;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewStyle: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginTop: responsiveHeight(20),
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(10),
    position: "relative",
  },
  toggleButton: {
    position: "absolute",
    left: 10,
    top: 10,
    zIndex: 2,
    padding: responsiveWidth(20),
    borderRadius: responsiveWidth(20),
    backgroundColor: "transparent",
  },
  modeIcon: {
    width: responsiveWidth(24),
    height: responsiveHeight(24),
  },
  logoBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 65,
  },
  logo: {
    marginBottom: responsiveHeight(20),
    width: responsiveWidth(120),
    height: responsiveHeight(100),
    resizeMode: "contain",
  },
  text: {
    marginLeft: responsiveWidth(30),
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  titleSelect: {
    fontSize: responsiveFontSize(24),
    marginTop: responsiveHeight(-20),
  },
  textDarkMain: {
    color: "#E4BF7C",
  },
  textLightMain: {
    color: "#000000",
  },
  titleBags: {
    fontSize: responsiveFontSize(32),
    fontWeight: "bold",
    marginBottom: responsiveHeight(-30),
  },
  cardLight: {
    backgroundColor: "white",
  },
  cardDark: {
    backgroundColor: "#E4BF7C",
  },
  bagBox: {
    width: responsiveWidth(310),
    height: responsiveHeight(330),
    margin: responsiveWidth(30),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginTop: responsiveHeight(20),
    marginBottom: responsiveHeight(20),
  },
  bagImage: {
    width: responsiveWidth(300),
    height: responsiveHeight(220),
    resizeMode: "contain",
    margin: responsiveWidth(30),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  footer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: responsiveWidth(32),
  },
  limitedEdition: {
    fontSize: responsiveFontSize(16),
    marginBottom: responsiveHeight(5),
  },
  modelName: {
    fontSize: responsiveFontSize(22),
    fontWeight: "bold",
    marginRight: responsiveWidth(10),
    marginBottom: responsiveHeight(10),
  },
  warningIcon: {
    width: responsiveWidth(35),
    height: responsiveHeight(35),
  },
  warningIconRedDot: {
    position: 'absolute',
    top: responsiveHeight(10),
    right: responsiveWidth(10),
  },
  warningRow: {
    marginRight: responsiveWidth(10),
  },
  plusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: responsiveHeight(10),
    marginTop: responsiveHeight(10),
  },
  plusIcon: {
    width: responsiveWidth(60),
    height: responsiveHeight(50),
  },
  lightModeBackground: {
    backgroundColor: "#E4BF7C",
  },
  darkModeBackground: {
    backgroundColor: "#393939",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    flex:1,
    width: width * 0.9,
    maxHeight: height * 0.5,
    margin:20,
    marginTop:60,
    backgroundColor: "#E4BF7C",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView2: {
    flex:1,
    width: width * 0.9,
    maxHeight: height * 0.40,
    margin:20,
    marginTop:60,
    backgroundColor: "#E4BF7C",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: responsiveFontSize(18),
  },
  defaultImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin:5,
  },
  defaultBagImage: {
    width: 55, // set the desired width
    height: 55, // set the desired height
    margin: 2, // add margin if needed
    resizeMode: "contain",
    borderRadius: 10,
    borderWidth: 2,
  },
  selectedBagImage: {
    justifyContent:"space-evenly",
    borderColor: "blue",
    borderWidth: 2,
  },
  buttonsContainer:{
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  AddCancelContainer: {
    flexDirection: 'row', // Arrange children in a row
    justifyContent: 'space-between', // Distribute space between buttons
    width: '60%', // Adjust the width as needed
  },
  RemoveCancelContainer: {
    flexDirection: 'row', // Arrange children in a row
    justifyContent: 'space-between', // Distribute space between buttons,
    width:"70%",
  },
  RenameDeleteCancelContainer: {
    flexDirection: 'row', // Arrange children in a row
    justifyContent: 'space-between', // Distribute space between buttons,
    width:"100%",
    margin:10,
  },
  addItemIcon: {
    width: responsiveWidth(30),
    height: responsiveHeight(30),
    marginTop: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  itemName: {
    fontSize: responsiveFontSize(16),
    marginRight: responsiveWidth(10),
  },
  itemNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: responsiveWidth(10),
  },
  redBackground: {
    backgroundColor: 'red',
    padding:5,
    height:40,
    justifyContent:"center",
    textAlign:"center",
    margin:5,
    borderRadius:5,
  },
  cancelButtonText:{
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold', // Make text bold
  },
  darkBackground:{
    backgroundColor: '#393939',
    padding:5,
    height:40,
    justifyContent:"center",
    textAlign:"center",
    margin:5,
    borderRadius:5,
  },
  CancelContainer: {
    backgroundColor: 'red',
    height:40,
    justifyContent:"center",
    textAlign:"center",
    margin:3,
    borderRadius:5,
  },
});

export default styles;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";

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

const Menu = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ScrollView
      style={[
        styles.scrollViewStyle,
        isDarkMode ? styles.darkMode : styles.lightMode,
      ]}
    >
      <View style={[styles.container]}>
        <View style={styles.header}>
          <ToggleModeButton isDarkMode={isDarkMode} onPress={toggleMode} />
        </View>
        <View style={styles.logoBox}>
          <Image
            source={
              isDarkMode
                ? require("./assets/Logo1.png")
                : require("./assets/main.png")
            }
            style={styles.logo}
          />
        </View>
        <View style={styles.text}>
          <Text
            style={[isDarkMode ? styles.darkMode : styles.lightMode, styles]}
          >
            select
          </Text>
          <Text
            style={[isDarkMode ? styles.titleBagsDark : styles.titleBagsLight]}
          >
            Bags
          </Text>
        </View>
        <View style={[isDarkMode ? styles.bagBoxDark : styles.bagBoxLight]}>
          <Image source={require("./assets/bag.png")} style={styles.bagImage} />
          <View style={styles.infoRow}>
            <View style={styles.footer}>
              <Text style={styles.limitedEdition}>limited edition</Text>
              <Text style={styles.modelName}>Model Covali</Text>
            </View>
            <View style={styles.warningRow}>
              <Image
                source={require("./assets/warning-icon.png")}
                style={styles.warningIcon}
              />
            </View>
          </View>
        </View>
        <View style={styles.plusRow}>
          <Image
            source={
              isDarkMode
                ? require("./assets/plusIconDark.png")
                : require("./assets/plusIconLight.png")
            }
            style={styles.plusIcon}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const ToggleModeButton = ({ isDarkMode, onPress }) => {
  return (
    <TouchableOpacity style={styles.toggleButton} onPress={onPress}>
      <Image
        source={
          isDarkMode
            ? require("./assets/darkmode.png")
            : require("./assets/lightmode.png")
        }
        style={styles.modeIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollViewStyle: {
    flex: 1,
  },
  header: {
    marginTop: responsiveHeight(60),
    width: "100%",
    flexDirection: "row",
    marginLeft: responsiveWidth(20),
  },
  toggleButton: {
    padding: responsiveWidth(20),
    borderRadius: responsiveWidth(20),
    backgroundColor: "transparent",
  },
  modeIcon: {
    width: responsiveWidth(24),
    height: responsiveHeight(24),
  },
  logoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  titleSelectLight: {
    color: "#000000",
    fontSize: responsiveFontSize(24),
  },
  titleSelectDark: {
    color: "#E4BF7C",
    fontSize: responsiveFontSize(24),
  },
  titleBagsDark: {
    fontSize: responsiveFontSize(32),
    fontWeight: "bold",
    color: "#E4BF7C",
  },
  titleBagsLight: {
    fontSize: responsiveFontSize(32),
    fontWeight: "bold",
    color: "#000000",
  },
  bagBoxLight: {
    margin: responsiveWidth(30),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  bagBoxDark: {
    margin: responsiveWidth(30),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E4BF7C",
    borderRadius: 20,
  },
  bagImage: {
    width: responsiveWidth(300),
    height: responsiveHeight(300),
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
  warningRow: {
    marginRight: responsiveWidth(10),
  },
  plusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: responsiveHeight(40),
  },
  plusIcon: {
    width: responsiveWidth(60),
    height: responsiveHeight(50),
  },
  lightMode: {
    backgroundColor: "#E4BF7C",
  },
  darkMode: {
    backgroundColor: "#393939",
  },
});

export default Menu;

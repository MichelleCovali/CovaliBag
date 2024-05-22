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
import { SafeAreaView } from "react-native-safe-area-context";
import FlipCard from "react-native-flip-card";

const { width, height } = Dimensions.get("window");
const baseWidth = 375; // Base screen width, e.g., iPhone X
const baseHeight = 667; // Base screen height

const bags = [
  { id: 0, name: "Bag 1", imageUrl: require("./assets/bag.png") },
  { id: 1, name: "Bag 2", imageUrl: require("./assets/bag.png") },
  { id: 2, name: "Bag 3", imageUrl: require("./assets/bag2.jpg") },
];

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

  const getCurrentColorThemeBackground = () => {
    return isDarkMode ? styles.darkModeBackground : styles.lightModeBackground;
  };

  const getCurrentColorThemeTextMain = () => {
    return isDarkMode ? styles.textDarkMain : styles.textLightMain;
  };
  const getCurrentColorThemeBagBox = () => {
    return isDarkMode ? styles.cardDark : styles.cardLight;
  };

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ScrollView
      style={[styles.scrollViewStyle, getCurrentColorThemeBackground()]}
    >
      <View style={[styles.container]}>
        <View style={styles.header}>
          <ToggleModeButton isDarkMode={isDarkMode} onPress={toggleMode} />
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
        </View>
        <View style={styles.text}>
          <Text
            // What is that ?
            style={[
              isDarkMode
                ? styles.darkModeBackground
                : styles.lightModeBackground,
              styles,
            ]}
          >
            select
          </Text>
          <Text style={[getCurrentColorThemeTextMain(), styles.titleBags]}>
            Bags
          </Text>
        </View>
        <SafeAreaView style={styles.scrollContaine}>
          <ScrollView horizontal>
            {bags.map((bag) => (
              <FlipCard
                flipHorizontal={true}
                flipVertical={false}
                friction={6}
                key={bag.id}
              >
                {/* Front of card */}
                <View style={[getCurrentColorThemeBagBox(), styles.bagBox]}>
                  <Image source={bag.imageUrl} style={styles.bagImage} />
                  <View style={styles.infoRow}>
                    <View style={styles.footer}>
                      <Text style={styles.limitedEdition}>limited edition</Text>
                      <Text style={styles.modelName}>{bag.name}</Text>
                    </View>
                    <View style={styles.warningRow}>
                      <Image
                        source={require("./assets/warning-icon.png")}
                        style={styles.warningIcon}
                      />
                    </View>
                  </View>
                </View>
                {/* back of card */}
                <View style={[styles.backPage, getCurrentColorThemeBagBox()]}>
                  <Text style={styles.limitedEdition}>limited edition</Text>
                  <Text style={styles.modelName}>{bag.name}</Text>
                </View>
              </FlipCard>
            ))}
          </ScrollView>
        </SafeAreaView>
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
  textDarkMain: {
    color: "#E4BF7C",
  },
  textLightMain: {
    color: "#000000",
  },
  titleBags: {
    fontSize: responsiveFontSize(32),
    fontWeight: "bold",
  },
  // titleBagsDark: {
  //   fontSize: responsiveFontSize(32),
  //   fontWeight: "bold",
  //   color: "#E4BF7C",
  // },
  // titleBagsLight: {
  //   fontSize: responsiveFontSize(32),
  //   fontWeight: "bold",
  //   color: "#000000",
  // },
  cardLight: {
    backgroundColor: "white",
  },
  cardDark: {
    backgroundColor: "#E4BF7C",
  },
  bagBox: {
    width: responsiveWidth(310),
    height: responsiveHeight(410),
    margin: responsiveWidth(30),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  bagBoxLight: {
    width: responsiveWidth(310),
    height: responsiveHeight(410),
    margin: responsiveWidth(30),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  bagBoxDark: {
    width: responsiveWidth(310),
    height: responsiveHeight(410),
    margin: responsiveWidth(30),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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

  lightModeBackground: {
    backgroundColor: "#E4BF7C",
  },
  darkModeBackground: {
    backgroundColor: "#393939",
  },
  backPage: {
    width: responsiveWidth(310),
    height: responsiveHeight(410),
    margin: responsiveWidth(30),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  backPageLight: {
    width: responsiveWidth(310),
    height: responsiveHeight(410),
    margin: responsiveWidth(30),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  backPageDark: {
    width: responsiveWidth(310),
    height: responsiveHeight(410),
    margin: responsiveWidth(30),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E4BF7C",
    borderRadius: 20,
  },
});

export default Menu;

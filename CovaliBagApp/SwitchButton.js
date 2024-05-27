import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
} from "react-native";

const SwitchButton = ({ isDarkMode, onToggle }) => {
  const [checked, setChecked] = useState(isDarkMode);
  const position = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(position, {
      toValue: checked ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [checked]);

  const toggleSwitch = () => {
    setChecked(!checked);
    onToggle(!checked);
  };

  const moonScale = position.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const sunScale = position.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const moonRotation = position.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const sunRotation = position.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  return (
    <TouchableOpacity onPress={toggleSwitch} style={styles.toggle}>
      <Animated.View
        style={[
          styles.icon,
          { transform: [{ scale: moonScale }, { rotate: moonRotation }] },
        ]}
      >
        <Image source={require("./assets/moon.png")} style={styles.iconImage} />
      </Animated.View>
      <Animated.View
        style={[
          styles.icon,
          { transform: [{ scale: sunScale }, { rotate: sunRotation }] },
        ]}
      >
        <Image source={require("./assets/sun.png")} style={styles.iconImage} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggle: {
    backgroundColor: "#fff",
    width: 56,
    height: 56,
    borderRadius: 28, // 50% of width/height to make it circular
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: 32,
    height: 32,
  },
});

export default SwitchButton;

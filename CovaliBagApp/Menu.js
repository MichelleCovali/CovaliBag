import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Menu = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkMode : styles.lightMode]}>
      <View style={styles.header}>
        <ToggleModeButton isDarkMode={isDarkMode} onPress={toggleMode} />
        <Image
          source={isDarkMode ? require('./assets/Logo1.png') : require('./assets/main.png')}
          style={[styles.logo, { position: 'absolute', top: 0, left: 105 }]}
        />
      </View>

      <Text style={[styles.menuText, isDarkMode ? styles.lightText : styles.darkText]}>
        Welcome to the Menu!
      </Text>
    </View>
  );
};

const ToggleModeButton = ({ isDarkMode, onPress }) => {
  return (
    <TouchableOpacity style={styles.toggleButton} onPress={onPress}>
      <Image
        source={isDarkMode ? require('./assets/darkmode.png') : require('./assets/lightmode.png')}
        style={styles.modeIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Default light mode background color
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
  },
  menuText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  lightText: {
    color: 'white', // Text color in light mode
  },
  darkText: {
    color: 'white', // Text color in dark mode
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  modeIcon: {
    width: 24,
    height: 24,
  },
  logo: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    resizeMode: 'contain', // Make sure the logo fits within the specified dimensions
    marginLeft: 10, // Spacing between button and logo
  },
  lightMode: {
    backgroundColor: '#E4BF7C', // Light mode background color
  },
  darkMode: {
    backgroundColor: '#393939', // Dark mode background color
  },
});

export default Menu;

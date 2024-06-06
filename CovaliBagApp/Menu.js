import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Modal, TextInput, Button, FlatList, Switch, Alert, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FlipCard from "react-native-flip-card";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from './css/style'; // Ensure this path is correct
import './task'; // Ensure this path is correct

const LOCATION_TASK_NAME = 'background-location-task';

const { width, height } = Dimensions.get("window");
const baseWidth = 375; // Base screen width, e.g., iPhone X
const baseHeight = 667; // Base screen height

const initialBags = [
  { id: 0, name: "Model Covali", imageUrl: require("./assets/bag.png"), items: [] },
  { id: 1, name: "Model 2", imageUrl: require("./assets/bag.png"), items: [] },
  { id: 2, name: "Model 3", imageUrl: require("./assets/bag2.jpg"), items: [] },
];

const defaultBagImages = [
  require("./assets/bag_brown.png"),
  require("./assets/bag_black_white.jpg"),
  require("./assets/bag_pink.jpg"),
  require("./assets/bag_white.jpg"),
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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [bags, setBags] = useState(initialBags);
  const [isBagModalVisible, setIsBagModalVisible] = useState(false);
  const [newBagName, setNewBagName] = useState("");
  const [selectedBagImage, setSelectedBagImage] = useState(defaultBagImages[0]);
  const [selectedBag, setSelectedBag] = useState(null);
  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRemoveBagModalVisible, setIsRemoveBagModalVisible] = useState(false);
  const backgroundColor = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== 'granted') {
        Alert.alert('Permission to access background location was denied');
        return;
      }

      configureBackgroundLocation();
    })();
    loadBags();
  }, []);

  const configureBackgroundLocation = async () => {
    try {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 1, // Minimum distance in meters
      });
    } catch (error) {
      console.error("Error configuring background location:", error);
      // Handle error, display a message, or fallback gracefully
    }
  };

  const getCurrentColorThemeBackground = () => {
    return isDarkMode ? styles.darkModeBackground : styles.lightModeBackground;
  };

  const getCurrentColorThemeTextMain = () => {
    return isDarkMode ? styles.textDarkMain : styles.textLightMain;
  };

  const getCurrentColorThemeBagBox = () => {
    return isDarkMode ? styles.cardDark : styles.cardLight;
  };

  const animateBackgroundColor = (toValue) => {
    Animated.timing(backgroundColor, {
      toValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const toggleMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    animateBackgroundColor(isDarkMode ? 0 : 1);
  };

  const addNewBag = async () => {
    const newBag = {
      id: bags.length,
      name: newBagName,
      imageUrl: selectedBagImage,
      items: [],
    };
    const updatedBags = [...bags, newBag];
    setBags(updatedBags);
    await AsyncStorage.setItem('bags', JSON.stringify(updatedBags));
    setIsBagModalVisible(false);
    setNewBagName("");
    setSelectedBagImage(defaultBagImages[0]);
  };

  const addItemToBag = async () => {
    if (!selectedBag) return;
    const updatedBags = bags.map((bag) => {
      if (bag.id === selectedBag.id) {
        return {
          ...bag,
          items: [...bag.items, { id: bag.items.length, name: newItemName, status: "green", isOn: false, location: null }],
        };
      }
      return bag;
    });
    setBags(updatedBags);
    await AsyncStorage.setItem('bags', JSON.stringify(updatedBags));
    setIsItemModalVisible(false);
    setNewItemName("");
    setSelectedItem(null);
  };

  const renameItem = async (itemId, newName) => {
    if (!selectedBag) return;
    const updatedBags = bags.map((bag) => {
      if (bag.id === selectedBag.id) {
        return {
          ...bag,
          items: bag.items.map((item) =>
            item.id === itemId ? { ...item, name: newName } : item
          ),
        };
      }
      return bag;
    });
    setBags(updatedBags);
    await AsyncStorage.setItem('bags', JSON.stringify(updatedBags));
    setIsItemModalVisible(false);
    setNewItemName("");
    setSelectedItem(null);
  };

  const deleteItem = async (itemId) => {
    if (!selectedBag) return;
    const updatedBags = bags.map((bag) => {
      if (bag.id === selectedBag.id) {
        return {
          ...bag,
          items: bag.items.filter((item) => item.id !== itemId),
        };
      }
      return bag;
    });
    setBags(updatedBags);
    await AsyncStorage.setItem('bags', JSON.stringify(updatedBags));
    setIsItemModalVisible(false);
    setSelectedItem(null);
  };

  const removeBag = async () => {
    const updatedBags = bags.filter(bag => bag.id !== selectedBag.id);
    setBags(updatedBags);
    await AsyncStorage.setItem('bags', JSON.stringify(updatedBags));
    setIsRemoveBagModalVisible(false);
    setSelectedBag(null);
  };

  const toggleItemOnOff = async (bagId, itemId) => {
    console.log(`Toggling item ${itemId} in bag ${bagId}`); // Debugging statement
    const updatedBags = bags.map((bag) => {
      if (bag.id === bagId) {
        const updatedItems = bag.items.map((item) => {
          if (item.id === itemId) {
            const newItem = { ...item, isOn: !item.isOn };
            console.log(`New item state: ${JSON.stringify(newItem)}`); // Debugging statement
            if (newItem.isOn) {
              saveItemLocation(newItem);
            } else {
              // Clear the saved location when the item is turned off
              newItem.location = null;
            }
            return newItem;
          }
          return item;
        });
        return { ...bag, items: updatedItems };
      }
      return bag;
    });
    setBags(updatedBags);
    await AsyncStorage.setItem('bags', JSON.stringify(updatedBags));
    console.log(`Updated bags: ${JSON.stringify(updatedBags)}`); // Debugging statement
  };

  const saveItemLocation = async (item) => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      const updatedBags = bags.map((bag) => {
        if (selectedBag && bag.id === selectedBag.id) { // Check if selectedBag is not null
          const updatedItems = bag.items.map((bagItem) => {
            if (bagItem.id === item.id) {
              return { ...bagItem, location: location.coords };
            }
            return bagItem;
          });
          return { ...bag, items: updatedItems };
        }
        return bag;
      });
      setBags(updatedBags);
      await AsyncStorage.setItem('bags', JSON.stringify(updatedBags));
      console.log(`Location saved for item: ${JSON.stringify(item)}`); // Debugging statement
    } catch (error) {
      console.error("Error saving item location: ", error);
    }
  };

  const loadBags = async () => {
    const storedBags = await AsyncStorage.getItem('bags');
    if (storedBags) {
      setBags(JSON.parse(storedBags));
    }
  };

  const interpolatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E4BF7C", "#393939"],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolatedBackgroundColor }]}>
      <ScrollView style={styles.scrollViewStyle}>
        <View style={styles.header}>
          <ToggleModeButton isDarkMode={isDarkMode} onPress={toggleMode} />
          <View style={styles.logoBox}>
            <Image
              source={isDarkMode ? require("./assets/Logo1.png") : require("./assets/main.png")}
              style={styles.logo}
            />
          </View>
        </View>
        <View style={styles.text}>
          <Text style={[getCurrentColorThemeTextMain(), styles.titleSelect]}>Select</Text>
          <Text style={[getCurrentColorThemeTextMain(), styles.titleBags]}>Bags</Text>
        </View>
        <SafeAreaView style={styles.scrollContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {bags.map((bag) => (
              <FlipCard flipHorizontal={true} flipVertical={false} friction={6} key={bag.id}>
                {/* Front of card */}
                <View style={[getCurrentColorThemeBagBox(), styles.bagBox]}>
                  <Image source={bag.imageUrl} style={styles.bagImage} />
                  <TouchableOpacity
                    style={styles.warningIconRedDot}
                    onPress={() => {
                      setSelectedBag(bag);
                      setIsRemoveBagModalVisible(true);
                    }}
                  >
                    <Image source={require("./assets/warning-icon.png")} style={styles.warningIcon} />
                  </TouchableOpacity>
                  <View style={styles.infoRow}>
                    <View style={styles.footer}>
                      <Text style={styles.limitedEdition}>limited edition</Text>
                      <Text style={styles.modelName}>{bag.name}</Text>
                    </View>
                    <View style={styles.warningRow}>
                      <Image source={require("./assets/warning-icon.png")} style={styles.warningIcon} />
                    </View>
                  </View>
                </View>
                {/* Back of card */}
                <View style={[styles.bagBox, getCurrentColorThemeBagBox()]}>
                  <Text style={styles.limitedEdition}>limited edition</Text>
                  <Text style={styles.modelName}>{bag.name}</Text>
                  <FlatList
                    data={bag.items}
                    renderItem={({ item }) => (
                      <View style={styles.itemRow}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedItem(item);
                            setSelectedBag(bag);
                            setNewItemName(item.name);
                            setIsItemModalVisible(true);
                          }}
                        >
                          <Text style={styles.itemName}>{item.name}</Text>
                          <View style={[styles.statusIndicator, { backgroundColor: item.status }]} />
                        </TouchableOpacity>
                        <Switch
                          value={item.isOn}
                          onValueChange={() => toggleItemOnOff(bag.id, item.id)}
                        />
                      </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedBag(bag);
                      setSelectedItem(null);
                      setNewItemName("");
                      setIsItemModalVisible(true);
                    }}
                  >
                    <Image
                      source={require("./assets/plusIconDark.png")} // Replace with the path to your add item icon
                      style={styles.addItemIcon}
                    />
                  </TouchableOpacity>
                </View>
              </FlipCard>
            ))}
          </ScrollView>
        </SafeAreaView>
        <View style={styles.plusRow}>
          <TouchableOpacity onPress={() => setIsBagModalVisible(true)}>
            <Image
              source={isDarkMode ? require("./assets/plusIconDark.png") : require("./assets/plusIconLight.png")}
              style={styles.plusIcon}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Bag Modal */}
      <Modal animationType="slide" transparent={true} visible={isBagModalVisible} onRequestClose={() => setIsBagModalVisible(false)}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add a New Bag</Text>
          <TextInput style={styles.input} placeholder="Enter Bag Name" value={newBagName} onChangeText={setNewBagName} />
          <Text style={styles.modalText}>Select an Image</Text>
          <View style={styles.defaultImagesContainer}>
            {defaultBagImages.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedBagImage(image)}>
                <Image source={image} style={[styles.defaultBagImage, selectedBagImage === image && styles.selectedBagImage]} />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.buttonsContainer}>
            <View style={styles.AddCancelContainer}>
              <TouchableOpacity style={styles.darkBackground} onPress={addNewBag}>
                <Text style={styles.cancelButtonText}>ADD BAG</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.redBackground} onPress={() => setIsBagModalVisible(false)} >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add/Rename Item Modal */}
      <Modal animationType="slide" transparent={true} visible={isItemModalVisible} onRequestClose={() => setIsItemModalVisible(false)}>
        <View style={styles.modalView2}>
          <Text style={styles.modalText}>{selectedItem ? "Edit Item" : "Add New Item"}</Text>
          <TextInput style={styles.input} placeholder="Enter Item Name" value={newItemName} onChangeText={setNewItemName} />
          <View style={styles.buttonsContainer2}>
          <View style={styles.RenameDeleteCancelContainer}>
          <TouchableOpacity style={styles.darkBackground} onPress={() => {
              if (selectedItem) {
                renameItem(selectedItem.id, newItemName);
              } else {
                addItemToBag();
              }
            }}>
                <Text style={styles.cancelButtonText}>{selectedItem ? "RENAME ITEM" : "ADD ITEM"}</Text>
          </TouchableOpacity>
          
          {selectedItem && selectedBag && (
            <>
              <TouchableOpacity style={styles.darkBackground} onPress={() => { deleteItem(selectedItem.id); setIsItemModalVisible(false);}}>
                <Text style={styles.cancelButtonText}>DELETE ITEM</Text>
              </TouchableOpacity>
            </>
          )}
          </View>
        </View>
        <View style={styles.buttonsContainer2}>
          <TouchableOpacity style={styles.redBackground} onPress={() => setIsItemModalVisible(false)}>
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
        </View>
      </Modal>

      {/* Remove Bag Modal */}
      <Modal animationType="slide" transparent={true} visible={isRemoveBagModalVisible} onRequestClose={() => setIsRemoveBagModalVisible(false)}>
        <View style={styles.modalView2}>
          <Text style={styles.modalText}>Are you sure you want to remove this bag and all its items?</Text>
          <View style={styles.buttonsContainer}>
            <View style={styles.RemoveCancelContainer}>
              <TouchableOpacity style={styles.darkBackground} onPress={removeBag}>
                <Text style={styles.cancelButtonText}>REMOVE BAG</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.redBackground} onPress={() => setIsRemoveBagModalVisible(false)}>
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const ToggleModeButton = ({ isDarkMode, onPress }) => {
  return (
    <TouchableOpacity style={styles.toggleButton} onPress={onPress}>
      <Image source={isDarkMode ? require("./assets/darkmode.png") : require("./assets/lightmode.png")} style={styles.modeIcon} />
    </TouchableOpacity>
  );
};

export default Menu;

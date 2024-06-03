import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  Button,
  FlatList,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FlipCard from "react-native-flip-card";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import styles from '../css/style';

const LOCATION_TASK_NAME = 'background-location-task';

const { width, height } = Dimensions.get("window");
const baseWidth = 375; // Base screen width, e.g., iPhone X
const baseHeight = 667; // Base screen height

const initialBags = [
  { id: 0, name: "Model Covali", imageUrl: require("../assets/bag.png"), items: [] },
  { id: 1, name: "Model 2", imageUrl: require("../assets/bag.png"), items: [] },
  { id: 2, name: "Model 3", imageUrl: require("../assets/bag2.jpg"), items: [] },
];

const defaultBagImages = [
  require("../assets/bag.png"),
  require("../assets/bag.png"),
  require("../assets/bag.png"),
  require("../assets/bag.png"),
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

const RogerApp = () => {
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

  useEffect(() => {
    configureBackgroundLocation();
  }, []);

  const configureBackgroundLocation = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 1, // Minimum distance in meters
      });
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

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addNewBag = () => {
    const newBag = {
      id: bags.length,
      name: newBagName,
      imageUrl: selectedBagImage,
      items: [],
    };
    setBags([...bags, newBag]);
    setIsBagModalVisible(false);
    setNewBagName("");
    setSelectedBagImage(defaultBagImages[0]);
  };

  const addItemToBag = () => {
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
    setIsItemModalVisible(false);
    setNewItemName("");
    setSelectedItem(null);
  };

  const renameItem = (itemId, newName) => {
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
    setIsItemModalVisible(false);
    setNewItemName("");
    setSelectedItem(null);
  };

  const deleteItem = (itemId) => {
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
    setIsItemModalVisible(false);
    setSelectedItem(null);
  };

  const removeBag = () => {
    const updatedBags = bags.filter(bag => bag.id !== selectedBag.id);
    setBags(updatedBags);
    setIsRemoveBagModalVisible(false);
    setSelectedBag(null);
  };

  const toggleItemOnOff = (bagId, itemId) => {
    const updatedBags = bags.map((bag) => {
      if (bag.id === bagId) {
        const updatedItems = bag.items.map((item) => {
          if (item.id === itemId) {
            const newItem = { ...item, isOn: !item.isOn };
            if (newItem.isOn) {
              saveItemLocation(newItem);
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
  };

  const saveItemLocation = async (item) => {
    let location = await Location.getCurrentPositionAsync({});
    const updatedBags = bags.map((bag) => {
      if (bag.id === selectedBag.id) {
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
  };

  const checkDistanceFromItems = (location) => {
    bags.forEach(bag => {
      bag.items.forEach(item => {
        if (item.isOn && item.location) {
          const distance = calculateDistance(location, item.location);
          if (distance > 0.5) {
            Notifications.scheduleNotificationAsync({
              content: {
                title: "Item Missing",
                body: `You are missing the item "${item.name}" in bag "${bag.name}"`,
              },
              trigger: null,
            });
          }
        }
      });
    });
  };

  const calculateDistance = (location1, location2) => {
    const rad = (x) => (x * Math.PI) / 180;
    const R = 6378137; // Earth’s mean radius in meter
    const dLat = rad(location2.latitude - location1.latitude);
    const dLong = rad(location2.longitude - location1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(location1.latitude)) *
        Math.cos(rad(location2.latitude)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance / 1000; // returns the distance in kilometers
  };

  return (
    <SafeAreaView style={[styles.container, getCurrentColorThemeBackground()]}>
      <ScrollView style={styles.scrollViewStyle}>
        <View style={styles.header}>
          <ToggleModeButton isDarkMode={isDarkMode} onPress={toggleMode} />
          <View style={styles.logoBox}>
            <Image
              source={isDarkMode ? require("../assets/Logo1.png") : require("../assets/main.png")}
              style={styles.logo}
            />
          </View>
        </View>
        <View style={styles.text}>
          <Text style={[getCurrentColorThemeTextMain(), styles.titleSelect]}>select</Text>
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
                    <Image source={require("../assets/warning-icon.png")} style={styles.warningIcon} />
                  </TouchableOpacity>
                  <View style={styles.infoRow}>
                    <View style={styles.footer}>
                      <Text style={styles.limitedEdition}>limited edition</Text>
                      <Text style={styles.modelName}>{bag.name}</Text>
                    </View>
                    <View style={styles.warningRow}>
                      <Image source={require("../assets/warning-icon.png")} style={styles.warningIcon} />
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
                      source={require("../assets/plusIconDark.png")} // Replace with the path to your add item icon
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
              source={isDarkMode ? require("../assets/plusIconDark.png") : require("../assets/plusIconLight.png")}
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
          <Button title="Add Bag" onPress={addNewBag} />
          <Button title="Cancel" onPress={() => setIsBagModalVisible(false)} />
        </View>
      </Modal>

      {/* Add/Rename Item Modal */}
      <Modal animationType="slide" transparent={true} visible={isItemModalVisible} onRequestClose={() => setIsItemModalVisible(false)}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{selectedItem ? "Edit Item" : "Add New Item"}</Text>
          <TextInput style={styles.input} placeholder="Enter Item Name" value={newItemName} onChangeText={setNewItemName} />
          <Button
            title={selectedItem ? "Rename Item" : "Add Item"}
            onPress={() => {
              if (selectedItem) {
                renameItem(selectedItem.id, newItemName);
              } else {
                addItemToBag();
              }
            }}
          />
          {selectedItem && selectedBag && (
            <>
              <Button
                title="Delete Item"
                onPress={() => {
                  deleteItem(selectedItem.id);
                  setIsItemModalVisible(false);
                }}
              />
            </>
          )}
          <Button title="Cancel" onPress={() => setIsItemModalVisible(false)} />
        </View>
      </Modal>

      {/* Remove Bag Modal */}
      <Modal animationType="slide" transparent={true} visible={isRemoveBagModalVisible} onRequestClose={() => setIsRemoveBagModalVisible(false)}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Are you sure you want to remove this bag and all its items?</Text>
          <Button title="Remove Bag" onPress={removeBag} />
          <Button title="Cancel" onPress={() => setIsRemoveBagModalVisible(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const ToggleModeButton = ({ isDarkMode, onPress }) => {
  return (
    <TouchableOpacity style={styles.toggleButton} onPress={onPress}>
      <Image source={isDarkMode ? require("../assets/darkmode.png") : require("../assets/lightmode.png")} style={styles.modeIcon} />
    </TouchableOpacity>
  );
};

export default RogerApp;


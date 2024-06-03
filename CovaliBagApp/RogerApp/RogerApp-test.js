import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FlipCard from "react-native-flip-card";
import styles from '../css/style';

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
          items: [...bag.items, { id: bag.items.length, name: newItemName, status: "green" }],
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
                    <Image source={require("../assets/trashDarker.png")} style={styles.warningIcon} />
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
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedItem(item);
                          setSelectedBag(bag);
                          setNewItemName(item.name);
                          setIsItemModalVisible(true);
                        }}
                        style={styles.itemRow}
                      >
                        <Text style={styles.itemName}>{item.name}</Text>
                        <View style={[styles.statusIndicator, { backgroundColor: item.status }]} />
                      </TouchableOpacity>
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

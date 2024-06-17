import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import styles from "../css/style";
import { useLocalStorageReducer } from "../hooks/useLocalStorage";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import BagCard from "./BagCard";
import { addData, deleteData, updateData } from "../utils/socket";
import bagsManager from "../utils/items";
import AsyncStorage from "@react-native-async-storage/async-storage";

AsyncStorage.clear();

const LOCATION_TASK_NAME = "background-location-task";

const defaultBagImages = [
  require("../assets/bag_brown.png"),
  require("../assets/bag_black_white.jpg"),
  require("../assets/bag_pink.jpg"),
  require("../assets/bag_white.jpg"),
];

const MAIN_BAG_IP = "10.110.110.185";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const Menu = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isBagModalVisible, setIsBagModalVisible] = useState(false);
  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [isRemoveBagModalVisible, setIsRemoveBagModalVisible] = useState(false);
  const [isRenameBagModalVisible, setIsRenameBagModalVisible] = useState(false);
  const backgroundColor = useRef(new Animated.Value(isDarkMode ? 1 : 0));

  const [bags, bagsDispatcher] = useLocalStorageReducer("bags", bagsManager, [
    {
      id: 0,
      address: MAIN_BAG_IP,
      port: 8765,
      name: "Covali Bag",
      imageUrl: require("../assets/bag.png"),
      items: [],
    },
  ]);

  console.log("Bags:", bags); 

  const [newBagName, setNewBagName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [selectedBag, setSelectedBag] = useState(null);
  const [selectedBagSocket, setSelectedBagSocket] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedBagImage, setSelectedBagImage] = useState(defaultBagImages[0]);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // useEffect(() => {
  // 	(async () =>
  // 		await scheduleNotification(
  // 			"You've got mail! 📬",
  // 			'Here is the notification body',
  // 			{ data: 'goes here' },
  // 			{ seconds: 2 },
  // 		))();
  // }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== "granted") {
        Alert.alert("Permission to access background location was denied");
        return;
      }

      await configureBackgroundLocation();
    })();
  }, []);

  const configureBackgroundLocation = async () => {
    try {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 1,
      });
    } catch (error) {
      console.error("Error configuring background location:", error);
    }
  };

  const getCurrentColorThemeTextMain = () => {
    return isDarkMode ? styles.textDarkMain : styles.textLightMain;
  };

  const animateBackgroundColor = (toValue) => {
    Animated.timing(backgroundColor.current, {
      toValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const toggleMode = useCallback(() => {
    setIsDarkMode((prevMode) => !prevMode);
    animateBackgroundColor(isDarkMode ? 0 : 1);
  }, [isDarkMode]);

  // const addBagPressHandler = useCallback((bag) => {
  // 	setSelectedBag(bag);
  // 	setSelectedBagSocket(new WebSocket(`ws://${MAIN_BAG_IP}:8765`));
  // 	setSelectedItem(null);
  // 	setNewItemName("");
  // 	setIsItemModalVisible(true);
  // }, []);

  const addBagPressHandler = useCallback((bag, socket) => {
    setSelectedBag(bag);
    setSelectedBagSocket(socket);
    setSelectedItem(null);
    setNewItemName("");
    setIsItemModalVisible(true);
  }, []);

  const editBagItemPressHandler = useCallback((item, bag, socket) => {
    setSelectedItem(item);
    setSelectedBagSocket(socket);
    setSelectedBag(bag);
    setNewItemName(item.name);
    setIsItemModalVisible(true);
  }, []);

  const editBagPressHandler = useCallback((bag) => {
    setSelectedBag(bag);
    setIsRenameBagModalVisible(true);
  }, []);

  const addNewBag = async () => {
    const newBag = {
      id: bags.length,
      address: MAIN_BAG_IP,
      port: 8765,
      name: newBagName,
      imageUrl: selectedBagImage,
      items: [],
    };

    bagsDispatcher({
      type: "ADD_BAG",
      newBagId: bags.length,
      newBagName,
      selectedBagImage,
    });

    console.log("Adding new bag:", newBag); 

    setIsBagModalVisible(false);
    setNewBagName("");
    setSelectedBagImage(defaultBagImages[0]);
  };

  const addItemToBag = async () => {
    if (!selectedBag) return;

    const newItem = {
      id: Math.floor(Math.random() * 200000) + 1,
      name: newItemName,
      status: "red",
      isOn: false,
      location: null,
    };

    console.log("Adding new item:", newItem); 

    bagsDispatcher({ type: "ADD_ITEM", bagId: selectedBag.id, newItem });

    console.log("SelectedBagSocket: " + selectedBagSocket);
    addData(selectedBagSocket, newItem);

    setIsItemModalVisible(false);
    setNewItemName("");
    setSelectedItem(null);
  };

  const renameItem = async (itemId, name) => {
    if (!selectedBag) return;

    console.log("Renaming item:", itemId, name); 

    bagsDispatcher({
      type: "RENAME_ITEM",
      bagId: selectedBag.id,
      itemId,
      name,
    });

    console.log("selectedBagSocket: " + selectedBagSocket);
    updateData(selectedBagSocket, itemId, { ...item, name });

    setIsItemModalVisible(false);
    setNewItemName("");
    setSelectedItem(null);
  };

  const deleteItem = async (itemId) => {
    if (!selectedBag) return;

    console.log("Deleting item:", itemId); 

    bagsDispatcher({ type: "DELETE_ITEM", bagId: selectedBag.id, itemId });

    deleteData(selectedBagSocket, itemId);

    setIsItemModalVisible(false);
    setSelectedItem(null);
  };

  const removeBag = async () => {
    if (!selectedBag) return;

    console.log("Removing bag:", selectedBag);

    bagsDispatcher({ type: "DELETE_BAG", id: selectedBag.id });

    setIsRemoveBagModalVisible(false);
    setSelectedBag(null);

    console.log("Bag removed successfully");
  };

  const renameBag = async () => {
    if (!selectedBag) return;

    console.log("Renaming bag:", selectedBag.id, newBagName); 

    bagsDispatcher({
      type: "RENAME_BAG",
      id: selectedBag.id,
      newName: newBagName,
    });

    setIsRenameBagModalVisible(false);
    setNewBagName("");
    setSelectedBag(null);

    console.log("Bag renamed successfully");
  };

  const interpolatedBackgroundColor = useMemo(
    () =>
      backgroundColor.current.interpolate({
        inputRange: [0, 1],
        outputRange: ["#E4BF7C", "#393939"],
      }),
    [backgroundColor]
  );

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: interpolatedBackgroundColor },
      ]}
    >
      <ScrollView style={styles.scrollViewStyle}>
        <View style={styles.header}>
          <ToggleMode isDarkMode={isDarkMode} onPress={toggleMode} />
          <View style={styles.logoBox}>
            <Image
              source={
                isDarkMode
                  ? require("../assets/Logo1.png")
                  : require("../assets/main.png")
              }
              style={styles.logo}
            />
          </View>
        </View>
        <View style={styles.text}>
          <Text style={[getCurrentColorThemeTextMain(), styles.titleSelect]}>
            Select
          </Text>
          <Text style={[getCurrentColorThemeTextMain(), styles.titleBags]}>
            Bags
          </Text>
        </View>
        <SafeAreaView style={styles.scrollContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {bags.map((bag) => (
              <BagCard
                key={bag.id}
                bag={bag}
                bagsDispatcher={bagsDispatcher}
                isDarkMode={isDarkMode}
                editBagItemPressHandler={editBagItemPressHandler}
                addBagPressHandler={addBagPressHandler}
                editBagPressHandler={editBagPressHandler}
              />
            ))}
          </ScrollView>
        </SafeAreaView>

        <View style={styles.plusRow}>
          <TouchableOpacity onPress={() => setIsBagModalVisible(true)}>
            <Image
              source={
                isDarkMode
                  ? require("../assets/plusIconDark.png")
                  : require("../assets/plusIconLight.png")
              }
              style={styles.plusIcon}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Bag Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isBagModalVisible}
        onRequestClose={() => setIsBagModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add a New Bag</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Bag Name"
            value={newBagName}
            onChangeText={setNewBagName}
          />
          <Text style={styles.modalText}>Select an Image</Text>
          <View style={styles.defaultImagesContainer}>
            {defaultBagImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedBagImage(image)}
              >
                <Image
                  source={image}
                  style={[
                    styles.defaultBagImage,
                    selectedBagImage === image && styles.selectedBagImage,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.buttonsContainer}>
            <View style={styles.AddCancelContainer}>
              <TouchableOpacity
                style={styles.darkBackground}
                onPress={addNewBag}
              >
                <Text style={styles.cancelButtonText}>ADD BAG</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.redBackground}
                onPress={() => setIsBagModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add/Rename Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isItemModalVisible}
        onRequestClose={() => setIsItemModalVisible(false)}
      >
        <View style={styles.modalView2}>
          <Text style={styles.modalText}>
            {selectedItem ? "Edit Item" : "Add New Item"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Item Name"
            value={newItemName}
            onChangeText={setNewItemName}
          />
          <View style={styles.buttonsContainer2}>
            <View style={styles.RenameDeleteCancelContainer}>
              <TouchableOpacity
                style={styles.darkBackground}
                onPress={() => {
                  if (selectedItem) {
                    renameItem(selectedItem.id, newItemName);
                  } else {
                    addItemToBag();
                  }
                }}
              >
                <Text style={styles.cancelButtonText}>
                  {selectedItem ? "RENAME ITEM" : "ADD ITEM"}
                </Text>
              </TouchableOpacity>

              {selectedItem && selectedBag && (
                <>
                  <TouchableOpacity
                    style={styles.darkBackground}
                    onPress={() => {
                      deleteItem(selectedItem.id);
                      setIsItemModalVisible(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>DELETE ITEM</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
          <View style={styles.buttonsContainer2}>
            <TouchableOpacity
              style={styles.redBackground}
              onPress={() => setIsItemModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Remove Bag Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRemoveBagModalVisible}
        onRequestClose={() => setIsRemoveBagModalVisible(false)}
      >
        <View style={styles.modalView2}>
          <Text style={styles.modalText}>
            Are you sure you want to remove this bag and all its items?
          </Text>
          <View style={styles.buttonsContainer}>
            <View style={styles.RemoveCancelContainer}>
              <TouchableOpacity
                style={styles.darkBackground}
                onPress={removeBag}
              >
                <Text style={styles.cancelButtonText}>REMOVE BAG</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.redBackground}
                onPress={() => setIsRemoveBagModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rename Bag Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRenameBagModalVisible}
        onRequestClose={() => setIsRenameBagModalVisible(false)}
      >
        <View style={styles.modalView2}>
          <Text style={styles.modalText}>Rename Bag</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter New Bag Name"
            value={newBagName}
            onChangeText={setNewBagName}
          />
          <View style={styles.buttonsContainer}>
            <View style={styles.AddCancelContainer}>
              <TouchableOpacity
                style={styles.darkBackground}
                onPress={renameBag}
              >
                <Text style={styles.cancelButtonText}>RENAME BAG</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.darkBackground}
                onPress={() => setIsRemoveBagModalVisible(true)}
              >
                <Text style={styles.cancelButtonText}>REMOVE BAG</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.CancelContainer}>
              <TouchableOpacity
                style={styles.redBackground}
                onPress={() => setIsRenameBagModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const ToggleMode = ({ isDarkMode, onPress }) => {
  return (
    <TouchableOpacity style={styles.toggleButton} onPress={onPress}>
      <Image
        source={
          isDarkMode
            ? require("../assets/darkmode.png")
            : require("../assets/lightmode.png")
        }
        style={styles.modeIcon}
      />
    </TouchableOpacity>
  );
};

export default memo(Menu);

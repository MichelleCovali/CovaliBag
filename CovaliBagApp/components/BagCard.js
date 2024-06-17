import {
  Image,
  Text,
  FlatList,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import FlipCard from "react-native-flip-card";

import { useRBP } from "../hooks/useRBP";
import { updateData } from "../utils/socket";
import styles from "../css/style";
import { memo } from "react";

const BagCard = ({
  bag,
  bagsDispatcher,
  isDarkMode,
  editBagItemPressHandler,
  addBagPressHandler,
  editBagPressHandler,
}) => {
  const [isAvailable, socket] = useRBP(
    bag.address,
    bag.port,
    bag.id,
    bagsDispatcher
  );

  console.log("Bag", bag); 

  console.log("Available", isAvailable); 

  const getCurrentColorThemeBagBox = () => {
    return isDarkMode ? styles.cardDark : styles.cardLight;
  };

  const toggleItemOnOff = (item) => {
    // console.log(Toggling item ${item.id} in bag ${bag.id})

    bagsDispatcher({ type: "TOGGLE_ITEM", bagId: bag.id, itemId: item.id });

    updateData(socket, item.id, { ...item, isOn: !item.isOn });

    console.log("Item toggled"); 
  };

  return (
    <FlipCard flipHorizontal={true} flipVertical={false} friction={6}>
      {/* Front of card */}
      <View style={[getCurrentColorThemeBagBox(), styles.bagBox]}>
        <Image source={bag.imageUrl} style={styles.bagImage} />
        <View style={styles.infoRow}>
          <View style={styles.footer}>
            <Text style={styles.limitedEdition}>Limited Edition</Text>
            <Text style={styles.modelName}>{bag.name}</Text>
          </View>
          <View style={styles.warningRow}>
            <Image
              source={require("../assets/warning-icon.png")}
              style={styles.warningIcon}
            />
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
                onPress={() => editBagItemPressHandler(item, bag, socket)}
                style={styles.itemNameContainer}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: item.status },
                  ]}
                />
              </TouchableOpacity>
              <Switch
                value={item.isOn}
                onValueChange={() => toggleItemOnOff(item)}
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        <TouchableOpacity
          onPress={() => addBagPressHandler(bag, socket)}
          disabled={!isAvailable}
        >
          <Image
            source={require("../assets/plusIconDark.png")} 
            style={styles.addItemIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.warningIconRedDot}
          onPress={() => editBagPressHandler(bag, socket)}
        >
          <Image
            source={require("../assets/option.png")}
            style={styles.warningIcon}
          />
        </TouchableOpacity>
      </View>
    </FlipCard>
  );
};

export default memo(BagCard);

import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, Button, Animated, Dimensions, Modal, Alert } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import styles from './css/css';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const [bags, setBags] = useState([
    {
      id: '1',
      name: 'Model Covali',
      image: require('./assets/bag.png'),
      items: [
        { id: '1', name: 'Wallet', present: true },
        { id: '2', name: 'Phone', present: true },
        { id: '3', name: 'Keys', present: false },
        { id: '4', name: 'Perfume', present: true },
      ],
    },
  ]);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [newBagName, setNewBagName] = useState('');
  const [currentBagIndex, setCurrentBagIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [isAddingBag, setIsAddingBag] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // flip feature for bag box - item box
  const flipToFront = (index) => {
    Animated.spring(flipAnim, {
      toValue: 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => setFlippedIndex(null));
  };

  const flipToBack = (index) => {
    Animated.spring(flipAnim, {
      toValue: 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => setFlippedIndex(index));
  };

  const toggleItem = (bagIndex, itemId) => {
    setBags((prevBags) =>
      prevBags.map((bag, index) =>
        index === bagIndex
          ? {
              ...bag,
              items: bag.items.map((item) =>
                item.id === itemId ? { ...item, present: !item.present } : item
              ),
            }
          : bag
      )
    );
  };


  const addItem = (bagIndex) => {
    if (newItem.trim()) {
      setBags((prevBags) =>
        prevBags.map((bag, index) =>
          index === bagIndex
            ? {
                ...bag,
                items: [...bag.items, { id: (bag.items.length + 1).toString(), name: newItem, present: true }],
              }
            : bag
        )
      );
      setNewItem('');
      setModalVisible(false);
    }
  };

  const addBag = () => {
    if (newBagName.trim()) {
      setBags((prevBags) => [
        ...prevBags,
        {
          id: (prevBags.length + 1).toString(),
          name: newBagName,
          image: require('./assets/bag.png'),
          items: [],
        },
      ]);
      setNewBagName('');
      setModalVisible(false);
    }
  };

  const handleItemPress = (bagIndex, item) => {
    setSelectedItem({ bagIndex, ...item });
    setNewItemName(item.name);
    setModalVisible(true);
    setIsAddingBag(false);
  };

  const renameItem = () => {
    setBags((prevBags) =>
      prevBags.map((bag, index) =>
        index === selectedItem.bagIndex
          ? {
              ...bag,
              items: bag.items.map((item) =>
                item.id === selectedItem.id ? { ...item, name: newItemName } : item
              ),
            }
          : bag
      )
    );
    setModalVisible(false);
  };

  const removeItem = () => {
    setBags((prevBags) =>
      prevBags.map((bag, index) =>
        index === selectedItem.bagIndex
          ? {
              ...bag,
              items: bag.items.filter((item) => item.id !== selectedItem.id),
            }
          : bag
      )
    );
    setModalVisible(false);
  };

  const removeBag = (bagIndex) => {
    Alert.alert(
      "Remove Bag",
      "Are you sure you want to remove this bag?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setBags((prevBags) => prevBags.filter((_, index) => index !== bagIndex));
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(currentBagIndex, item)}>
      <View style={[styles.itemContainer, isDarkMode ? styles.darkItemContainer : styles.lightItemContainer]}>
        <Text style={[styles.itemText, isDarkMode ? styles.darkText : styles.lightText]}>{item.name}</Text>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: item.present ? 'green' : 'red' },
          ]}
        />
      </View>
    </TouchableOpacity>
  );

  const renderBag = ({ item, index }) => {
    const isFlipped = flippedIndex === index;

    const frontAnimatedStyle = {
      transform: [
        {
          rotateY: flipAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
          }),
        },
      ],
    };

    const backAnimatedStyle = {
      transform: [
        {
          rotateY: flipAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['180deg', '360deg'],
          }),
        },
      ],
    };

    return (
      <View style={styles.bagContainer}>
        <Animated.View style={[styles.flipCard, frontAnimatedStyle, isFlipped && { display: 'none' }]}>
          <TouchableOpacity onPress={() => flipToBack(index)} style={[styles.bagBox, isDarkMode ? styles.darkBox : styles.lightBox]}>
            <Image
              source={item.image}
              style={styles.bagImage}
            />
            <Text style={[styles.bagText, isDarkMode ? styles.darkText : styles.lightText]}>{item.name}</Text>
            <TouchableOpacity onPress={() => removeBag(index)} style={styles.removeBagButton}>
              <Text style={styles.removeBagButtonText}>Remove Bag</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle, !isFlipped && { display: 'none' }]}>
          <TouchableOpacity onPress={() => flipToFront(index)} style={styles.itemsListContainer}>
            <FlatList
              data={item.items}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={styles.itemsList}
            />
            <TouchableOpacity onPress={() => { setModalVisible(true); setSelectedItem(null); setIsAddingBag(false); }} style={styles.addButton}>
              <Image source={require('./assets/lightPlus.png')} style={styles.itemPlusIcon} />
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const onGestureEvent = (event) => {
    if (flippedIndex === null && event.nativeEvent.translationX < -50 && currentBagIndex < bags.length - 1) {
      setCurrentBagIndex(currentBagIndex + 1);
    } else if (flippedIndex === null && event.nativeEvent.translationX > 50 && currentBagIndex > 0) {
      setCurrentBagIndex(currentBagIndex - 1);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };


  return (
    <>
      <View style={[styles.header, isDarkMode ? styles.darkHeader : styles.lightHeader]}>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Image source={isDarkMode ? require('./assets/darkmode.png') : require('./assets/lightmode.png')} style={styles.themeIcon} />
        </TouchableOpacity>
      </View>
      <View style={[styles.logoContainer, isDarkMode ? styles.darkLogoContainer : styles.lightLogoContainer]}>
        <Image source={isDarkMode ? require('./assets/Logo1.png') : require('./assets/Logo.png')} style={styles.logo} />
      </View>
      <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
        <Text style={[styles.selectText, isDarkMode ? styles.darkSelectText : styles.lightSelectText]}>select</Text>
        <Text style={[styles.title, isDarkMode ? styles.darkTitle : styles.lightTitle]}>Bags</Text>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <FlatList
            data={bags}
            renderItem={renderBag}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
            onScroll={(event) => {
              const currentIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentBagIndex(currentIndex);
            }}
          />
        </PanGestureHandler>
      </View>
      {flippedIndex === null && (
        <TouchableOpacity onPress={() => { setModalVisible(true); setIsAddingBag(true); }} style={[styles.addBagButton, isDarkMode ? styles.darkAddBagButton : styles.lightAddBagButton]}>
          <Image source={require('./assets/plusIconDark.png')} style={styles.bagPlusIcon} />
        </TouchableOpacity>
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkModalContent : styles.lightModalContent]}>
            {isAddingBag ? (
              <>
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>Add New Bag</Text>
                <TextInput
                  style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                  placeholder="New Bag Name"
                  placeholderTextColor={isDarkMode ? '#ccc' : '#333'}
                  value={newBagName}
                  onChangeText={setNewBagName}
                />
                <Button title="Add Bag" onPress={addBag} />
              </>
            ) : selectedItem ? (
              <>
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>Rename or Remove Item</Text>
                <TextInput
                  style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                  placeholder="Item Name"
                  placeholderTextColor={isDarkMode ? '#ccc' : '#333'}
                  value={newItemName}
                  onChangeText={setNewItemName}
                />
                <Button title="Rename" onPress={renameItem} />
                <Button title="Remove" onPress={removeItem} />
              </>
            ) : (
              <>
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>Add New Item</Text>
                <TextInput
                  style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                  placeholder="New Item"
                  placeholderTextColor={isDarkMode ? '#ccc' : '#333'}
                  value={newItem}
                  onChangeText={setNewItem}
                />
                <Button title="Add Item" onPress={() => addItem(currentBagIndex)} />
              </>
            )}
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default HomeScreen;

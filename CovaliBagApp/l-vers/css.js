import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  logoContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  themeToggle: {
    position: 'absolute',
    left: 20,
  },

  // dark - light icon mode row background
  darkHeader: {
    backgroundColor: '#333',
  },
  lightHeader: {
    backgroundColor: '#f5dfb8',
  },

  // logo row background
  darkLogoContainer: {
    backgroundColor: '#333',
  },
  lightLogoContainer: {
    backgroundColor: '#f5dfb8',
  },
  themeIcon: {
    width: 30,
    height: 30,
  },
  logo: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // body background
  darkContainer: {
    backgroundColor: '#333',
  },
  lightContainer: {
    backgroundColor: '#f5dfb8',

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  // 'select' text color
  darkSelectText: {
    color: '#e4bf7c',
  },
  lightSelectText: {
    color: '#333',
  },

  // bag text color
  darkTitle: {
    color: '#e4bf7c',
    marginBottom: 20,
  },
  lightTitle: {
    color: '#333',
    marginBottom: 20,
  },

  // bag - item text color
//   darkText: {
//     color: '#444',
//   },
//   lightText: {
//     color: '#444',
//   },

  bagContainer: {
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  flipCard: {
    width: '85%',
    height: 380,
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  bagBox: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // bag box container background color
  darkBox: {
    backgroundColor: '#e4bf7c',
  },
  lightBox: {
    backgroundColor: '#f0ede1',
  },

  bagImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  bagText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },

//    each item box - background color
  darkItemContainer: {
    backgroundColor: '#e4bf7c',
  },
  lightItemContainer: {
    backgroundColor: '#fff',
  },

  itemText: {
    fontSize: 18,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  itemsList: {
    width: '100%',
    marginTop: 20,
  },
  itemsListContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // add items button - icon
  addButton: {
    marginTop: 20,
    // backgroundColor: '#333',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // bag name text color
  itemPlusIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  bagPlusIcon: {
    width: 60,
    height: 60,
    tintColor: '#fff',
  },

  // add bag icon - background
  addBagButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkAddBagButton: {
    backgroundColor: '#444',
  },
  lightAddBagButton: {
    backgroundColor: '#f5dfb8',
  },


  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  // add bag + items | content background color
  darkModalContent: {
    backgroundColor: '#fff',
  },
  lightModalContent: {
    backgroundColor: '#fff',
  },


  input: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },

  // input | text + background color
  darkInput: {
    backgroundColor: '#f0f0f0',
    color: '#000',
  },
  lightInput: {
    backgroundColor: '#f0f0f0',
    color: '#000',
  },

  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 20,
  },
  removeBagButton: {
    marginTop: 10,
  },
  removeBagButtonText: {
    color: 'red',
    fontSize: 16,
  },
  

//   darkBagText: {
//     color: '#1b4083',
//   },
//   lightBagText: {
//     color: '#1b4083',
//   },
});

export default styles;

import * as Notifications from "expo-notifications";

const bagsManager = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD_BAG":
      return [
        ...state,
        {
          id: action.newBagId,
          address: "10.110.110.185",
          port: 8765,
          name: action.newBagName,
          imageUrl: action.selectedBagImage,
          items: [],
        },
      ];
    case "RENAME_BAG":
      return state.map((bag) =>
        bag.id === action.id ? { ...bag, name: action.newName } : bag
      );
    case "DELETE_BAG":
      return state.filter((bag) => bag.id !== action.id);
    case "SET_ITEMS":
      const { items } = state.filter((bag) => bag.id === action.bagId)[0];

      const updatedItems = items.filter(
        (newItem, index) => action.items[index]?.isOn !== newItem.isOn
      );

      updatedItems.forEach((item) => {
        (async () =>
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Item ${item.name} is now ${!item.isOn ? "on" : "off"}`,
              body: `Item ${item.name} in bag ${action.bagId} is now ${
                !item.isOn ? "on" : "off"
              }`,
              data: {},
            },
            trigger: { seconds: 5 },
          }))();
      });

      return state.map((bag) =>
        bag.id === action.bagId ? { ...bag, items: action.items } : bag
      );
    case "ADD_ITEM":
      return state.map((bag) =>
        bag.id === action.bagId
          ? { ...bag, items: [...bag.items, action.newItem] }
          : bag
      );
    case "RENAME_ITEM":
      return state.map((bag) =>
        bag.id === action.bagId
          ? {
              ...bag,
              items: bag.items.map((item) =>
                item.id === action.itemId
                  ? { ...item, name: action.name }
                  : item
              ),
            }
          : bag
      );
    case "DELETE_ITEM":
      return state.map((bag) =>
        bag.id === action.bagId
          ? {
              ...bag,
              items: bag.items.filter((item) => item.id !== action.itemId),
            }
          : bag
      );
    case "TOGGLE_ITEM":
      return state.map((bag) =>
        bag.id === action.bagId
          ? {
              ...bag,
              items: bag.items.map((item) =>
                item.id === action.itemId ? { ...item, isOn: !item.isOn } : item
              ),
            }
          : bag
      );
    default:
      return state;
  }
};

export default bagsManager;

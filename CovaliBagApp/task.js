import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log("Received new locations", locations);

    // Implement the logic to check distances from items and send notifications
    checkDistanceFromItems(locations[0]);
  }
});

const checkDistanceFromItems = (location) => {
  // Fetch the stored items and their saved locations
  // Check if the current location is far from any of the stored item locations
  // If so, send a notification

  const bags = getBags(); // This function should retrieve the bags from storage
  bags.forEach(bag => {
    bag.items.forEach(item => {
      if (item.isOn && item.location) {
        const distance = calculateDistance(location.coords, item.location);
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

// Placeholder function for fetching bags from storage
const getBags = () => {
  // Implement the logic to fetch the bags from AsyncStorage or other storage
  return [];
};

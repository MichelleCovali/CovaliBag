import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BlackScreen from "./BlackScreen";
import mihaelapp from "./mihaelapp";
import DarylApp from "./DarylApp";
import Menu from "./Menu";
import RogerApp from "./RogerApp/RogerApp";
import Menu2 from "./Menu2";
import LoadingAnimation from "./LoadingAnimation";


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BlackScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="BlackScreen" component={BlackScreen} />
        {/* <Stack.Screen name="LoadingAnimation" component={LoadingAnimation} /> */}
        {/* <Stack.Screen name="Menu" component={Menu} /> */}
        {/* <Stack.Screen name="DarylApp" component={DarylApp} /> */}
        {/* <Stack.Screen name="Menu2" component={Menu2} /> */}
        {/* <Stack.Screen name="Menu2" component={Menu2} /> */}
        {/* <Stack.Screen name="mihaelapp" component={mihaelapp} /> */}
        {/* <Stack.Screen name="Menu" component={Menu} /> */}
        <Stack.Screen name="RogerApp" component={RogerApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BlackScreen from "./BlackScreen";
import Menu from "./Menu";
import mihaelapp from "./mihaelapp";
import DarylApp from "./DarylApp";
import rogerapp from "./rogerapp";
import Menu2 from "./Menu2";


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
        {/* <Stack.Screen name="Menu" component={Menu} /> */}
        {/* <Stack.Screen name="Menu2" component={Menu2} /> */}
        {/* <Stack.Screen name="mihaelapp" component={mihaelapp} /> */}
        <Stack.Screen name="DarylApp" component={DarylApp} />
        {/* <Stack.Screen name="rogerapp" component={rogerapp} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

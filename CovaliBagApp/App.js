import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BlackScreen from "./components/BlackScreen";
import Menu from "./components/Menu";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Bluetooth"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="BlackScreen" component={BlackScreen} />
        <Stack.Screen name="Menu" component={Menu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

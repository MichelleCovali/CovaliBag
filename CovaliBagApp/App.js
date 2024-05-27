import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BlackScreen from "./BlackScreen";
import mihaelapp from "./mihaelapp";
import Menu from "./Menu";
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
        <Stack.Screen name="Menu" component={Menu} />
        {/* <Stack.Screen name="rogerapp" component={rogerapp} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

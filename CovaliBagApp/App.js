import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BlackScreen from './BlackScreen';
import Darylap from './Darylap';  // Ensure this matches the exact casing of your file name

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BlackScreen"
        screenOptions={{
          headerShown: false  
        }}
      >
        <Stack.Screen name="BlackScreen" component={BlackScreen} />
        <Stack.Screen name="Darylap" component={Darylap} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

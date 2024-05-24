import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BlackScreen from './BlackScreen';
import Menu from './Menu';
import mihaelapp from './mihaelapp';
import darylapp from './darylap';
import rogerapp from './rogerapp';

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
        {/* <Stack.Screen name="BlackScreen" component={BlackScreen} />
        <Stack.Screen name="Menu" component={Menu} /> */}
        <Stack.Screen name="mihaelapp" component={mihaelapp} />
        {/* <Stack.Screen name="darylapp" component={darylapp} /> */}
        {/* <Stack.Screen name="rogerapp" component={rogerapp} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import DetailsModal from '../screens/DetailsModal';

const Stack = createNativeStackNavigator();

export default function MainStackNavigator() {
  console.log('MainStackNavigator is rendering');
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Personal Pokedex', headerTitleAlign: 'center' }}
        />
        <Stack.Screen 
          name="Favorites" 
          component={FavoritesScreen}
          options={{ title: 'Favorites' }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsModal}
          options={{ presentation: 'modal', title: 'Pokemon Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

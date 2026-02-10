import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
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
          options={({ navigation }) => ({
            title: 'Personal Pokedex',
            headerTitleAlign: 'center',
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Favorites')}
                style={{ marginRight: 10 }}
              >
                <MaterialIcons name="favorite" size={24} color="#ef4444" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="Favorites" 
          component={FavoritesScreen}
          options={{ title: 'Favorites', headerTitleAlign: 'center' }}
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

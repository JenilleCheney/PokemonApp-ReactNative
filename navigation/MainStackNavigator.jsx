import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import DetailsModal from '../screens/DetailsModal';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator();

function NavigatorContent() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBackground },
        headerTintColor: theme.text,
        headerTitleStyle: { color: theme.text },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Personal Pokedex',
          headerTitleAlign: 'center',
          headerLeft: () => <ThemeToggle />,
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
        options={{ 
          title: 'Favorites', 
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsModal}
        options={{ presentation: 'modal', title: 'Pokemon Details' }}
      />
    </Stack.Navigator>
  );
}

export default function MainStackNavigator() {
  const { theme, isDark } = useTheme();
  
  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.headerBackground,
          text: theme.text,
          border: theme.border,
          notification: theme.primary,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      <NavigatorContent />
    </NavigationContainer>
  );
}

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider } from './hooks/useTheme';
import MainStackNavigator from './navigation/MainStackNavigator';

export default function App() {
  console.log('App is rendering');
  return (
    <ThemeProvider>
      <MainStackNavigator />
    </ThemeProvider>
  );
}

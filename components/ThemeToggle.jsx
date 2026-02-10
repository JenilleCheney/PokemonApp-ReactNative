import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.button}>
      <MaterialIcons 
        name={isDark ? 'light-mode' : 'dark-mode'} 
        size={24} 
        color={theme.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    marginRight: 8,
  },
});

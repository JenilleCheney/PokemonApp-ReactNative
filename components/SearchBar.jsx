import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function SearchBar({ value, onChange }) {
  const { theme } = useTheme();
  return (
    <TextInput
      style={[styles.input, { backgroundColor: theme.searchBackground, color: theme.text }]}
      placeholder="Search Pokémon..."
      placeholderTextColor={theme.textSecondary}
      value={value}
      onChangeText={onChange}
    />
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 }
});

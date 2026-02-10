import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function SearchBar({ value, onChange }) {
  return (
    <TextInput
      style={styles.input}
      placeholder="Search Pokémon..."
      value={value}
      onChangeText={onChange}
    />
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 }
});

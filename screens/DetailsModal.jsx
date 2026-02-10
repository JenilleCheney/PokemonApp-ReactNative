import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { fetchPokemonDescription } from '../api/pokemonApi';
import { useTheme } from '../hooks/useTheme';

export default function DetailsModal({ visible, pokemon, onClose }) {
  const { theme } = useTheme();
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pokemon && visible) {
      loadDescription();
    }
  }, [pokemon, visible]);

  const loadDescription = async () => {
    try {
      setLoading(true);
      const desc = await fetchPokemonDescription(pokemon.id);
      setDescription(desc);
    } catch (err) {
      setDescription('Description not available.');
    } finally {
      setLoading(false);
    }
  };

  if (!pokemon) return null;

  const img = pokemon.sprites.other['official-artwork'].front_default;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.overlay, { backgroundColor: theme.modalOverlay }]}>
        <View style={[styles.modal, { backgroundColor: theme.modalBackground }]}>
          <TouchableOpacity style={[styles.closeTop, { backgroundColor: theme.border }]} onPress={onClose}>
            <Text style={[styles.closeX, { color: theme.text }]}>✕</Text>
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={{ uri: img }} style={styles.image} />
            <Text style={[styles.title, { color: theme.text }]}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
            
            {loading ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text>
            )}
            
            <Text style={[styles.label, { color: theme.text }]}>Types: <Text style={[styles.value, { color: theme.textSecondary }]}>{pokemon.types.map(t => t.type.name).join(', ')}</Text></Text>
            <Text style={[styles.label, { color: theme.text }]}>Abilities: <Text style={[styles.value, { color: theme.textSecondary }]}>{pokemon.abilities.map(a => a.ability.name).join(', ')}</Text></Text>
            <Text style={[styles.label, { color: theme.text }]}>Height: <Text style={[styles.value, { color: theme.textSecondary }]}>{pokemon.height}</Text></Text>
            <Text style={[styles.label, { color: theme.text }]}>Weight: <Text style={[styles.value, { color: theme.textSecondary }]}>{pokemon.weight}</Text></Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: 20 },
  modal: { padding: 20, borderRadius: 12, maxHeight: '80%', position: 'relative' },
  closeTop: { position: 'absolute', top: 10, right: 10, zIndex: 10, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  closeX: { fontSize: 20, fontWeight: 'bold' },
  image: { width: 180, height: 180, alignSelf: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  description: { fontSize: 14, fontStyle: 'italic', marginBottom: 15, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  value: { fontWeight: 'normal' },
});

import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { fetchPokemonDescription } from '../api/pokemonApi';

export default function DetailsModal({ visible, pokemon, onClose }) {
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
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeTop} onPress={onClose}>
            <Text style={styles.closeX}>✕</Text>
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={{ uri: img }} style={styles.image} />
            <Text style={styles.title}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
            
            {loading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text style={styles.description}>{description}</Text>
            )}
            
            <Text style={styles.label}>Types: <Text style={styles.value}>{pokemon.types.map(t => t.type.name).join(', ')}</Text></Text>
            <Text style={styles.label}>Abilities: <Text style={styles.value}>{pokemon.abilities.map(a => a.ability.name).join(', ')}</Text></Text>
            <Text style={styles.label}>Height: <Text style={styles.value}>{pokemon.height}</Text></Text>
            <Text style={styles.label}>Weight: <Text style={styles.value}>{pokemon.weight}</Text></Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modal: { backgroundColor: '#fff', padding: 20, borderRadius: 12, maxHeight: '80%', position: 'relative' },
  closeTop: { position: 'absolute', top: 10, right: 10, zIndex: 10, width: 30, height: 30, borderRadius: 15, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  closeX: { fontSize: 20, color: '#333', fontWeight: 'bold' },
  image: { width: 180, height: 180, alignSelf: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  description: { fontSize: 14, fontStyle: 'italic', marginBottom: 15, textAlign: 'center', color: '#666' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  value: { fontWeight: 'normal' },
});

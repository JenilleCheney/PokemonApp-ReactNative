import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function PokemonCard({ item, onPress, onToggleFavorite, isFavorite }) {
  const { theme } = useTheme();
  const img = item.sprites.other['official-artwork'].front_default;

  const handleFavoritePress = (e) => {
    if (e) e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.cardBackground }]} onPress={onPress}>
      <Image source={{ uri: img }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={[styles.name, { color: theme.text }]}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
        <Text style={{ color: theme.textSecondary }}>Type: {item.types.map(t => t.type.name).join(', ')}</Text>
        <Text style={{ color: theme.textSecondary }}>Height: {item.height}</Text>
        <Text style={{ color: theme.textSecondary }}>Weight: {item.weight}</Text>
      </View>
      {onToggleFavorite && (
        <TouchableOpacity onPress={handleFavoritePress} style={styles.starButton}>
          <Text style={[styles.star, { color: theme.starColor }]}>{isFavorite ? '★' : '☆'}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 10, marginVertical: 6, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center' },
  image: { width: 70, height: 70 },
  textContainer: { flex: 1, marginLeft: 12 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  starButton: { padding: 12 },
  star: { fontSize: 24 }
});
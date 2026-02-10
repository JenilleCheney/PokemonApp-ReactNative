import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PokemonCard from '../components/PokemonCard';
import DetailsModal from './DetailsModal';
import { fetchPokemonsByIds } from '../api/pokemonApi';
import { useTheme } from '../hooks/useTheme';

const FAVORITES_STORAGE_KEY = '@pokemon_favorites';

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [favoritePokemon, setFavoritePokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Reload favorites when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    await loadFavorites();
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites !== null) {
        const favoriteIds = JSON.parse(storedFavorites);
        setFavorites(favoriteIds);
        
        if (favoriteIds.length > 0) {
          // Fetch all favorited Pokemon by their IDs
          const pokemonData = await fetchPokemonsByIds(favoriteIds);
          setFavoritePokemon(pokemonData);
        } else {
          setFavoritePokemon([]);
        }
      }
    } catch (error) {
      console.log('Error loading favorites from AsyncStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (favoritesToSave) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritesToSave));
      setFavorites(favoritesToSave);
      
      // Reload Pokemon data after updating favorites
      if (favoritesToSave.length > 0) {
        const pokemonData = await fetchPokemonsByIds(favoritesToSave);
        setFavoritePokemon(pokemonData);
      } else {
        setFavoritePokemon([]);
      }
    } catch (error) {
      console.log('Error saving favorites to AsyncStorage:', error);
    }
  };

  const toggleFavorite = (pokemonId) => {
    const updatedFavorites = favorites.filter(id => id !== pokemonId);
    saveFavorites(updatedFavorites);
  };

  const handleCardPress = (item) => {
    setSelectedPokemon(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPokemon(null);
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading Favorites...</Text>
      </View>
    );
  }

  if (favoritePokemon.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.text }]}>No favorites yet!</Text>
        <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>Tap the star on any Pokemon to add them here.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={favoritePokemon}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PokemonCard 
            item={item} 
            onPress={() => handleCardPress(item)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            isFavorite={true}
          />
        )}
        contentContainerStyle={{ padding: 12 }}
      />
      <DetailsModal 
        visible={modalVisible}
        pokemon={selectedPokemon}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

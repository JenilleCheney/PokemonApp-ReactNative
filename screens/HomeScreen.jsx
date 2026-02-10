import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import DetailsModal from './DetailsModal';
import { fetchPokemonList } from '../api/pokemonApi';

const FAVORITES_STORAGE_KEY = '@pokemon_favorites';

export default function HomeScreen() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 20;

  useEffect(() => {
    loadPokemon();
    loadFavorites();
  }, []);

  // Save favorites whenever favorites state changes
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const loadPokemon = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const currentOffset = loadMore ? offset : 0;
      const data = await fetchPokemonList(LIMIT, currentOffset);
      
      if (data.length < LIMIT) {
        setHasMore(false);
      }
      
      if (loadMore) {
        setPokemon(prev => [...prev, ...data]);
        setOffset(prev => prev + LIMIT);
      } else {
        setPokemon(data);
        setOffset(LIMIT);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading pokemon:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !searchQuery) {
      loadPokemon(true);
    }
  };

  // Load favorites from AsyncStorage
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites !== null) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.log('Error loading favorites from AsyncStorage:', error);
    }
  };

  // Save favorites to AsyncStorage
  const saveFavorites = async (favoritesToSave) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritesToSave));
    } catch (error) {
      console.log('Error saving favorites to AsyncStorage:', error);
    }
  };

  // Toggle favorite status
  const toggleFavorite = (pokemonId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(pokemonId)) {
        // Remove from favorites
        return prevFavorites.filter(id => id !== pokemonId);
      } else {
        // Add to favorites
        return [...prevFavorites, pokemonId];
      }
    });
  };

  // Check if a pokemon is favorited
  const isFavorite = (pokemonId) => {
    return favorites.includes(pokemonId);
  };

  const handleCardPress = (item) => {
    setSelectedPokemon(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPokemon(null);
  };

  const filteredPokemon = pokemon.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesName = p.name.toLowerCase().includes(query);
    const matchesType = p.types.some(t => t.type.name.toLowerCase().includes(query));
    return matchesName || matchesType;
  });

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading Pokemon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <FlatList
        data={filteredPokemon}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PokemonCard 
            item={item} 
            onPress={() => handleCardPress(item)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            isFavorite={isFavorite(item.id)}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => 
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#0000ff" />
              <Text style={styles.footerText}>Loading more Pokemon...</Text>
            </View>
          ) : !hasMore && pokemon.length > 0 ? (
            <View style={styles.footerLoader}>
              <Text style={styles.footerText}>You've reached the end!</Text>
            </View>
          ) : null
        }
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
});
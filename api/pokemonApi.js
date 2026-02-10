export const fetchPokemonList = async (limit = 20, offset = 0) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await res.json();

  const detailed = await Promise.all(
    data.results.map(async (p) => {
      const detailRes = await fetch(p.url);
      return await detailRes.json();
    })
  );

  return detailed;
};

export const fetchPokemonById = async (pokemonId) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  return await res.json();
};

export const fetchPokemonsByIds = async (pokemonIds) => {
  const pokemonData = await Promise.all(
    pokemonIds.map(async (id) => {
      try {
        return await fetchPokemonById(id);
      } catch (err) {
        console.error(`Error fetching pokemon ${id}:`, err);
        return null;
      }
    })
  );
  return pokemonData.filter(p => p !== null);
};

export const fetchPokemonDescription = async (pokemonId) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
  const data = await res.json();
  
  // Get English flavor text
  const flavorText = data.flavor_text_entries.find(
    entry => entry.language.name === 'en'
  );
  
  return flavorText ? flavorText.flavor_text.replace(/\f/g, ' ') : 'No description available.';
};

export const searchPokemon = async (searchTerm) => {
  try {
    const lowerSearch = searchTerm.toLowerCase().trim();
    
    // Try to fetch by exact name first
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${lowerSearch}`);
      if (res.ok) {
        const data = await res.json();
        return [data];
      }
    } catch (err) {
      // Pokemon not found by name, continue to type search
    }
    
    // Search by type
    try {
      const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${lowerSearch}`);
      if (typeRes.ok) {
        const typeData = await typeRes.json();
        // Get first 20 Pokemon of this type
        const pokemonPromises = typeData.pokemon
          .slice(0, 20)
          .map(p => fetch(p.pokemon.url).then(r => r.json()));
        return await Promise.all(pokemonPromises);
      }
    } catch (err) {
      // Type not found
    }
    
    return [];
  } catch (error) {
    console.error('Error searching Pokemon:', error);
    return [];
  }
};


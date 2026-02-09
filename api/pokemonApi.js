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


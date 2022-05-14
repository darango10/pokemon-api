const toggleFavorite = (id: number) => {
  console.log("toggleFavorite");

  let favorites: number[] = JSON.parse(
    localStorage.getItem("favorites") || "[]"
  );

  if (favorites.includes(id)) {
    favorites = favorites.filter((pokeId) => pokeId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const existsPokemonInFavorites = (id: number): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const favorites: number[] = JSON.parse(
    localStorage.getItem("favorites") || "[]"
  );
  return favorites.includes(id);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { toggleFavorite, existsPokemonInFavorites };

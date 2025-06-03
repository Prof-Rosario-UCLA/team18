import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-localStorage";

export interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
}

export function useFavorites() {
  const [storedFavorites, setStoredFavorites] = useLocalStorage<FavoriteCity[]>(
    "favorites",
    []
  );
  const queryClient = useQueryClient();

  // Read favorites from localStorage and keep in sync with React Query
  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: () => storedFavorites,
    initialData: storedFavorites,
    staleTime: Infinity, // Local data doesn't need background refetching
  });

  // Add a city to favorites
  const addFavorite = useMutation({
    mutationFn: async (city: Omit<FavoriteCity, "id" | "addedAt">) => {
      const cityId = `${city.lat}-${city.lon}`;
      const alreadyExists = storedFavorites.some((fav) => fav.id === cityId);

      if (alreadyExists) return storedFavorites;

      const newFavorite: FavoriteCity = {
        ...city,
        id: cityId,
        addedAt: Date.now(),
      };

      const updatedFavorites = [...storedFavorites, newFavorite];
      setStoredFavorites(updatedFavorites);
      return updatedFavorites;
    },
    onSuccess: () => {
      // Refresh React Query cache
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // Remove a city from favorites
  const removeFavorite = useMutation({
    mutationFn: async (cityId: string) => {
      const updatedFavorites = storedFavorites.filter((fav) => fav.id !== cityId);
      setStoredFavorites(updatedFavorites);
      return updatedFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // Check if a city is currently a favorite
  const isFavorite = (lat: number, lon: number) =>
    storedFavorites.some((fav) => fav.lat === lat && fav.lon === lon);

  return {
    favorites: favoritesQuery.data,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
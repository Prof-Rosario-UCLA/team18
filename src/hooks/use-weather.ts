import { useQuery } from "@tanstack/react-query";
import type { Coordinates } from "@/api/types";
import { weatherAPI } from "@/api/weather";

// Unique keys for caching and refetching different weather-related data
export const WEATHER_KEYS = {
  weather: (coords: Coordinates) => ["weather", coords] as const,
  forecast: (coords: Coordinates) => ["forecast", coords] as const,
  city: (coords: Coordinates) => ["city", coords] as const,
  search: (query: string) => ["location-search", query] as const,
} as const;

/**
 * Fetches current weather data based on coordinates.
 * Uses a fallback key when coordinates are null, but disables the query.
 */
export function useWeatherQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () =>
      coordinates ? weatherAPI.getCurrentWeather(coordinates) : null,
    enabled: !!coordinates, 
  });
}

/**
 * Fetches location search results based on a query string.
 * Enables the query only when the query string is at least 3 characters long.
 * Helps reduce unnecessary API calls for short or incomplete queries.
 */
export function useSearch(query:string){
    return useQuery({
    queryKey: WEATHER_KEYS.search(query),
    queryFn: () => weatherAPI.search(query),
    enabled: query.length >= 3,
  });
}

/**
 * Fetches weather forecast data based on coordinates.
 */
export function useForecastQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => (coordinates ? weatherAPI.getForecast(coordinates) : null),
    enabled: !!coordinates,
  });
}

/**
 * Fetches human-readable location name from coordinates.
 * Useful for reverse geocoding (e.g. showing city names).
 */
export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.city(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () =>
      coordinates ? weatherAPI.reverseGeocode(coordinates) : null,
    enabled: !!coordinates,
  });
}

import { API_CONFIG } from "./config";
import type {
  WeatherData,
  ForecastData,
  GeocodingResponse,
  Coordinates,
} from "./types";

class WeatherAPI{
  private createUrl(endpoint:string,params:Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
        ...params,
    });
    return `${endpoint}?${searchParams.toString()}`;
  }

  private async fetchData<T>(url:string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.statusText}`);
    }

    return response.json();
  }

    async search(query: string): Promise<GeocodingResponse[]> {
      const url = this.createUrl(`${API_CONFIG.GEO}/direct`, {
        q: query,
        limit: "5",
      });
    return this.fetchData<GeocodingResponse[]>(url);
  }

  async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: "metric",
    });
    return this.fetchData<WeatherData>(url);
  }

  async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: "metric",
    });
    return this.fetchData<ForecastData>(url);
  }

  async reverseGeocode({
    lat,
    lon,
  }: Coordinates): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO}/reverse`, {
      lat: lat.toString(),
      lon: lon.toString(),
      limit: "1",
    });
    return this.fetchData<GeocodingResponse[]>(url);
  }

  async getUVIndex({ lat, lon }: Coordinates): Promise<number | null> {
    const url = new URL(`${API_CONFIG.UV_INDEX_BASE_URL}/uvi`);
    url.searchParams.append("latitude", lat.toString());
    url.searchParams.append("longitude", lon.toString());

    try {
      console.log("Fetching UV Index from:", url.toString());
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`UV Index API error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("UV Index API response:", data);
      return data?.now?.uvi ?? null;
    } catch (error) {
      console.error("Failed to fetch UV index", error);
      return null;
    }
  }
}

export const weatherAPI = new WeatherAPI();
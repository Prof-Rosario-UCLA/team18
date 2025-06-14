import { CurrentWeather } from "@/components/current-weather";
import { HourlyTemperature } from "@/components/hourly-temperature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import { WeatherInfo} from "../components/weather-info";
import { WeatherForecast } from "../components/weather-forecast";
import { useState, useEffect } from "react";
import { weatherAPI } from "@/api/weather";
import { FavoriteButton } from "@/components/fav-button";

const CityPage = () => {
  // Get city name from URL path param
  const { cityName } = useParams<{ cityName: string }>();

  // Get latitude and longitude from URL search params
  const [queryParams] = useSearchParams();
  const latitude = parseFloat(queryParams.get("lat") || "0");
  const longitude = parseFloat(queryParams.get("lon") || "0");

  const position = { lat: latitude, lon: longitude };

  // Weather and forecast queries
  const { data: current, error: weatherError } = useWeatherQuery(position);
  const { data: hourly, error: forecastError } = useForecastQuery(position);

  const [uvIndex, setUvIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchUv = async () => {
      if (!position) return;
      const uv = await weatherAPI.getUVIndex(position);
      setUvIndex(uv);
    };

    fetchUv();
  }, [position]);

  // Error UI
  if (weatherError || forecastError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          We couldn’t load weather data. Please refresh the page or try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Loading or missing data
  if (!current || !hourly || !cityName) {
    return <WeatherSkeleton />;
  }

  // Render weather data
  return (
    <main className="space-y-2 px-2">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight capitalize">
          {cityName}, {current.sys.country}
        </h1>
        <div className="flex gap-2">
          <FavoriteButton
            data={{ ...current, name: cityName }}
          />
        </div>
      </header>

      <section className="grid gap-5">
        {/* Current weather + hourly temps */}
        <div className="flex flex-col md:flex-row gap-6">
          <CurrentWeather data={current} />
          <HourlyTemperature data={hourly} />
        </div>
        <div className="flex flex-col lg:flex-row gap-4 overflow-hidden">
          {/* extra weather info */}
          <WeatherInfo data={current} uvi={uvIndex} />
          <WeatherForecast data={hourly} />
        </div>
      </section>
    </main>
  );
};

export default CityPage;

import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { MapPin, AlertTriangle, RefreshCw } from "lucide-react";
import { useWeatherQuery, useForecastQuery, useReverseGeocodeQuery} from "@/hooks/use-weather";
import { CurrentWeather } from "../components/current-weather";
import { HourlyTemperature } from "../components/hourly-temperature";
import { WeatherInfo} from "../components/weather-info";
import { WeatherForecast } from "../components/weather-forecast";
import { useState, useEffect } from "react";
import { weatherAPI } from "@/api/weather.ts";
import { FavoriteCities } from "@/components/favorites";

const WeatherDashboard = () => {
const { coordinates, error: locationError, getLocation, isLoading: locationLoading } = useGeolocation();

const weatherQuery = useWeatherQuery(coordinates);
const forecastQuery = useForecastQuery(coordinates);
const locationQuery = useReverseGeocodeQuery(coordinates);

const [uvIndex, setUvIndex] = useState<number | null>(null);

// Fetch uv index when coordinates change
useEffect(() => {
  const fetchUvIndex = async () => {
    if (!coordinates) return;
    const uv = await weatherAPI.getUVIndex(coordinates);
    setUvIndex(uv);
  };

  fetchUvIndex();
}, [coordinates]);

console.log(weatherQuery.data);
console.log(locationQuery);

const handleRefresh = () => {
  getLocation();
  if (coordinates) {
    weatherQuery.refetch();
    forecastQuery.refetch();
    locationQuery.refetch();
  }
};

if (locationLoading) {
  return <WeatherSkeleton />
}

if (locationError) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Location Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{locationError}</p>
        <Button variant="outline" onClick={getLocation} className="w-fit">
          <MapPin className="mr-2 h-4 w-4" />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
  );
}

if (!coordinates) {
  return (
    <Alert>
      <MapPin className="h-4 w-4" />
      <AlertTitle>Location Required</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Please allow access to your location to see your local weather.</p>
        <Button variant="outline" onClick={getLocation} className="w-fit">
          <MapPin className="mr-2 h-4 w-4" />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
  );
}

const locationName = locationQuery.data?.[0]

if (weatherQuery.error || forecastQuery.error) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        {/* if offline, display fetching message  */}
        { navigator.onLine ? (
          <p>Failed weather data fetch, please try again.</p>
        ) : (<p>You are currently offline. Attempting to fetch data...</p>) }
        <Button variant="outline" onClick={handleRefresh} className="w-fit">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}

if (!weatherQuery.data || !forecastQuery.data) {
  return <WeatherSkeleton />;
}

return (
    <div className="space-y-4 overflow-hidden">
      {/* <FavoriteCities /> */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Current Location</h1>
          <Button 
            variant={'outline'} 
            size={"icon"}
            onClick={handleRefresh}
            disabled={weatherQuery.isFetching || forecastQuery.isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`}
            />
          </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 mx-auto">
        {/* Left side: stacked two rows */}
        <div className="grid gap-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <CurrentWeather
              data={weatherQuery.data}
              locationName={locationName}
            />
            <HourlyTemperature data={forecastQuery.data} />
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <WeatherInfo data={weatherQuery.data} uvi={uvIndex} />
            <WeatherForecast data={forecastQuery.data} />
          </div>
        </div>

        {/* Right side: Favorites card spans both rows */}
        <div className="lg:row-span-2 overflow-auto">
          <FavoriteCities />
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard
import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import type { WeatherData, GeocodingResponse } from "@/api/types";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  const formatTemp = (tempC: number) => `${Math.round(tempC * 9 / 5 + 32)}°`;

  return (
    <Card className="w-full max-w-sm h-[240px] overflow-hidden">
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-1">
                <h2 className="text-xl font-bold tracking-tight">
                  {locationName?.name}
                </h2>
                {locationName?.state && (
                  <span className="text-xs text-muted-foreground">
                    , {locationName.state}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {locationName?.country}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-5xl font-bold tracking-tighter">
                {formatTemp(temp)}
              </p>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Feels like {formatTemp(feels_like)}
                </p>
                <div className="flex gap-1 text-xs">
                  <span className="flex items-center gap-0.5 text-yellow-500">
                    <ArrowDown className="h-3 w-3" />
                    {formatTemp(temp_min)}
                  </span>
                  <span className="flex items-center gap-0.5 text-pink-500">
                    <ArrowUp className="h-3 w-3" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1">
                <Droplets className="h-3 w-3 text-gray-500" />
                <div className="space-y-0.5">
                  <p className="text-xs font-medium">Humidity</p>
                  <p className="text-xs text-muted-foreground">{humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="h-3 w-3 text-gray-500" />
                <div className="space-y-0.5">
                  <p className="text-xs font-medium">Wind</p>
                  <p className="text-xs text-muted-foreground">{speed} m/s</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative aspect-square w-24">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
                alt={currentWeather.description}
                className="h-full w-full object-contain"
              />
              <div className="absolute bottom-0 w-full text-center">
                <p className="text-xs font-medium capitalize">
                  {currentWeather.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
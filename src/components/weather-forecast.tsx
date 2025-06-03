import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailySummary {
  date: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

// Helper: Convert Celsius to Fahrenheit string
const formatTemp = (tempCelsius: number) => `${Math.round(tempCelsius * 9 / 5 + 32)}°`;

export function WeatherForecast({ data }: WeatherForecastProps) {
  // Group forecasts by day and aggregate min/max temp
  const dailyByDate = data.list.reduce((acc, entry) => {
    const dateKey = format(new Date(entry.dt * 1000), "yyyy-MM-dd");

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: entry.dt,
        tempMin: entry.main.temp_min,
        tempMax: entry.main.temp_max,
        humidity: entry.main.humidity,
        wind: entry.wind.speed,
        weather: entry.weather[0],
      };
    } else {
      acc[dateKey].tempMin = Math.min(acc[dateKey].tempMin, entry.main.temp_min);
      acc[dateKey].tempMax = Math.max(acc[dateKey].tempMax, entry.main.temp_max);
    }

    return acc;
  }, {} as Record<string, DailySummary>);

  // Get first 6 unique days (today + next 5)
  const forecastDays = Object.values(dailyByDate).slice(0, 6);

  return (
    <Card className="flex-1 max-w-xl h-[300px] overflow-auto">
      <CardHeader>
        <CardTitle>Upcoming Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {forecastDays.map((day) => (
            <div
              key={day.date}
              className="grid grid-cols-3 items-center gap-2 rounded-md border p-2"
            >
              {/* Date and description */}
              <div>
                <p className="font-medium text-sm">
                  {format(new Date(day.date * 1000), "EEE, MMM d")}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {day.weather.description}
                </p>
              </div>

              {/* Temp min/max */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
                <span className="flex items-center text-yellow-500">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  {formatTemp(day.tempMin)}
                </span>
                <span className="flex items-center text-pink-500">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  {formatTemp(day.tempMax)}
                </span>
              </div>

              {/* Humidity and wind */}
              <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-xs">
                <span className="flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-gray-500" />
                  <span className="text-sm">{day.humidity}%</span>
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-3 w-3 text-gray-500" />
                  <span className="text-sm">{day.wind}m/s</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

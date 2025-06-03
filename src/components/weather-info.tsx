import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Cloud, Compass, Sunrise, Sunset, Sun } from "lucide-react";
import { format } from "date-fns";
import type { WeatherData } from "@/api/types";

interface WeatherInfoProps {
  data: WeatherData;
  uvi: number | null;
}

export function WeatherInfo({ data, uvi }: WeatherInfoProps) {
  const { sys, wind, clouds } = data;

  // Converts wind degree to compass direction
  const getDirection = (deg: number): string => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const normalized = (deg + 360) % 360;
    const index = Math.round(normalized / 45) % 8;
    return directions[index];
  };

  // Formats Unix timestamp (in seconds) to 12-hour time
  const formatTime = (timestamp: number) =>
    format(new Date(timestamp * 1000), "h:mm a");

  const details = [
    {
      title: "Sunrise",
      value: formatTime(sys?.sunrise ?? 0),
      icon: <Sunrise className="h-5 w-5 text-yellow-500" />,
    },
    {
      title: "Sunset",
      value: formatTime(sys?.sunset ?? 0),
      icon: <Sunset className="h-5 w-5 text-orange-500" />,
    },
    {
      title: "Cloudiness",
      value: `${clouds?.all ?? "N/A"}%`,
      icon: <Cloud className="h-5 w-5 text-gray-500" />,
    },
    {
      title: "UV Index",
      value: uvi !== null ? uvi.toFixed(1) : "N/A",
      icon: <Sun className="h-5 w-5 text-pink-500" />,
    },
    {
      title: "Wind Direction",
      value: `${getDirection(wind.deg)} (${wind.deg}°)`,
      icon: <Compass className="h-5 w-5 text-red-500" />,
    },
  ];

  return (
    <Card className="flex-1 w-full max-w-xl h-[300px]">
      <CardHeader>
        <CardTitle>Additional Weather Info</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y divide-muted">
          {details.map((detail) => (
            <li
              key={detail.title}
              className="flex items-center justify-between py-2.5"
            >
              <div className="flex items-center gap-2">
                {detail.icon}
                <span className="text-sm font-medium">{detail.title}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {detail.value}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

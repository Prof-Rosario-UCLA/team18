import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-fav";
import { toast } from "sonner";

interface FavoriteCityTileProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

function FavoriteCityTile({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityTileProps) {
  const navigate = useNavigate();

  // Fetch live weather data for the favorite city
  const { data: weatherData, isLoading } = useWeatherQuery({ lat, lon });

  // Navigate to city details on tile click
  const handleNavigate = () => {
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  // Prevent click bubbling when removing favorite
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(id);
    toast.error(`Removed ${name} from Favorites`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="relative flex min-w-[200px] cursor-pointer items-center gap-2 rounded-lg border bg-chart-1 p-3 pr-7 shadow-sm transition-shadow hover:shadow-md"
      role="button"
      tabIndex={0}
    >
      {/* Remove button in top-right */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-5 w-5 rounded-full p-0 hover:bg-chart-3 hover:text-destructive"
        onClick={handleRemove}
      >
        <X className="h-3.5 w-3.5" />
      </Button>

      {/* Weather loading spinner */}
      {isLoading ? (
        <div className="flex h-6 items-center justify-center">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        </div>
      ) : weatherData ? (
        <>
          {/* Weather icon + name + country */}
          <div className="flex items-center gap-1.5">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt={weatherData.weather[0].description}
              className="h-8 w-8"
            />
            <div>
              <p className="font-medium text-sm">{name}</p>
              <p className="text-[10px] text-muted-foreground">
                {weatherData.sys.country}
              </p>
            </div>
          </div>

          {/* Temperature and description */}
          <div className="ml-auto text-right">
            <p className="text-lg font-semibold leading-none">
              {Math.round(weatherData.main.temp * 9 / 5 + 32)}°
            </p>
            <p className="text-[10px] capitalize text-muted-foreground leading-tight">
              {weatherData.weather[0].description}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function FavoriteCities() {
  const { favorites, removeFavorite } = useFavorites();

  if (!favorites.length) return null;

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight mb-2 text-muted-foreground">
        Favorites
      </h1>

      {/* Scrollable vertical list of favorite cities */}
      <ScrollArea className="h-[480px] w-full pr-2">
        <div className="flex flex-col gap-4">
          {favorites.map((city) => (
            <FavoriteCityTile
              key={city.id}
              {...city}
              onRemove={() => removeFavorite.mutate(city.id)}
            />
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </>
  );
}
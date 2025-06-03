import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { WeatherData } from "@/api/types";
import { useFavorites } from "@/hooks/use-fav";

interface FavoriteButtonProps {
  data: WeatherData;
}

export function FavoriteButton({ data }: FavoriteButtonProps) {
  const { coord, name, sys } = data;
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const locationId = `${coord.lat}-${coord.lon}`;
  const isFav = isFavorite(coord.lat, coord.lon);

  const toggleFavorite = () => {
    if (isFav) {
      // Remove from favorites
      removeFavorite.mutate(locationId);
      toast.error(`Removed ${name} from Favorites`);
    } else {
      // Add to favorites
      addFavorite.mutate({
        name,
        lat: coord.lat,
        lon: coord.lon,
        country: sys.country,
      });
      toast.success(`Added ${name} to Favorites`);
    }
  };

  return (
    <Button
      variant={isFav ? "default" : "outline"}
      size="icon"
      onClick={toggleFavorite}
      className={isFav ? "bg-yellow-500 hover:bg-yellow-600" : ""}
    >
      <Star className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
    </Button>
  );
}

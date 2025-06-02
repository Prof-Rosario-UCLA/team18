import { useState } from "react";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Loader2, Search } from "lucide-react";
import { useSearch } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { data: results, isLoading } = useSearch(searchText);
  const navigate = useNavigate();

  const onCitySelect = (value: string) => {
    const [lat, lon, name] = value.split("|");
    setDialogOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setDialogOpen(true)}
      >
        <Search className="mr-3 h-5 w-5" />
        Search for a city...
      </Button>

      <CommandDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <CommandInput
          placeholder="Enter a city name..."
          value={searchText}
          onValueChange={setSearchText}
        />
        <CommandList>
          {searchText.length >= 3 && !isLoading && !results?.length && (
            <CommandEmpty>No cities found.</CommandEmpty>
          )}

          {!!results?.length && (
            <CommandGroup heading="Results">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {results.map((city) => {
                const locationKey = `${city.lat}|${city.lon}|${city.name}`;
                const displayName = `${city.name}${city.state ? `, ${city.state}` : ""}, ${city.country}`;

                return (
                  <CommandItem
                    key={locationKey}
                    value={locationKey}
                    onSelect={onCitySelect}
                  >
                    <Search className="mr-3 h-5 w-5" />
                    <span>{displayName}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;

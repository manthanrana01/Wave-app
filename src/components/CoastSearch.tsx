import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CoastLocation, searchCoasts } from '@/lib/tideData';
import { Search, MapPin, Navigation } from 'lucide-react';

interface CoastSearchProps {
  onCoastSelect: (coast: CoastLocation) => void;
  userLocation?: { latitude: number; longitude: number } | null;
}

export default function CoastSearch({ onCoastSelect, userLocation }: CoastSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CoastLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const results = searchCoasts(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const openDirections = (coast: CoastLocation) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${coast.latitude},${coast.longitude}`;
      window.open(url, '_blank');
    }
  };

  const getStateColor = (state: string) => {
    const colors = {
      'Gujarat': 'bg-orange-100 text-orange-800 border-orange-200',
      'Maharashtra': 'bg-blue-100 text-blue-800 border-blue-200',
      'Goa': 'bg-green-100 text-green-800 border-green-200',
      'Karnataka': 'bg-purple-100 text-purple-800 border-purple-200',
      'Kerala': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Tamil Nadu': 'bg-red-100 text-red-800 border-red-200',
      'Andhra Pradesh': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Odisha': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'West Bengal': 'bg-pink-100 text-pink-800 border-pink-200',
      'Andaman and Nicobar Islands': 'bg-teal-100 text-teal-800 border-teal-200',
      'Lakshadweep': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Puducherry': 'bg-violet-100 text-violet-800 border-violet-200',
      'Daman and Diu': 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return colors[state as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coasts by name, state, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {searchResults.length > 0 && (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {searchResults.map((coast) => (
                  <Card
                    key={coast.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border hover:border-blue-300"
                    onClick={() => onCoastSelect(coast)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{coast.name}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStateColor(coast.state || '')}>
                              {coast.state}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{coast.country}</span>
                          </div>
                          {coast.description && (
                            <p className="text-xs text-muted-foreground italic mb-2">
                              {coast.description}
                            </p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {coast.latitude.toFixed(4)}, {coast.longitude.toFixed(4)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 ml-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCoastSelect(coast);
                            }}
                            className="text-xs"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {userLocation && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDirections(coast);
                              }}
                              className="text-xs"
                            >
                              <Navigation className="h-3 w-3 mr-1" />
                              Route
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}

          {searchQuery && searchResults.length === 0 && !isSearching && (
            <div className="text-center py-4 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No coasts found matching "{searchQuery}"</p>
              <p className="text-xs">Try searching for state names like "Gujarat", "Goa", or "Kerala"</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
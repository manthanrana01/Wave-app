import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeToggle from '@/components/ThemeToggle';
import MapComponent from '@/components/MapComponent';
import TideDisplay from '@/components/TideDisplay';
import ChatBot from '@/components/ChatBot';
import WeatherOverlay from '@/components/WeatherOverlay';
import CoastSearch from '@/components/CoastSearch';
import { 
  CoastLocation, 
  indiaCoastlines, 
  findNearestCoast, 
  generateTidePredictions,
  TideEvent
} from '@/lib/tideData';
import { 
  UserLocation, 
  getCurrentLocation, 
  getCoordinatesFromAddress, 
  saveUserLocation, 
  loadUserLocation,
  saveFavoriteCoast,
  removeFavoriteCoast,
  getFavoriteCoasts,
  LocationError
} from '@/lib/locationService';
import { 
  MapPin, 
  Navigation, 
  Heart, 
  HeartOff, 
  Loader2, 
  Waves,
  Bot,
  Cloud,
  TrendingUp,
  Search,
  Compass,
  Star,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export default function Index() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedCoast, setSelectedCoast] = useState<CoastLocation | null>(null);
  const [tides, setTides] = useState<TideEvent[]>([]);
  const [locationInput, setLocationInput] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [favoriteCoasts, setFavoriteCoasts] = useState<string[]>([]);

  // Load saved data on component mount
  useEffect(() => {
    const savedLocation = loadUserLocation();
    if (savedLocation) {
      setUserLocation(savedLocation);
      const nearest = findNearestCoast(savedLocation.latitude, savedLocation.longitude);
      setSelectedCoast(nearest);
    }
    
    setFavoriteCoasts(getFavoriteCoasts());
  }, []);

  // Generate tides when coast is selected
  useEffect(() => {
    if (selectedCoast) {
      const tidePredictions = generateTidePredictions(selectedCoast);
      setTides(tidePredictions);
    }
  }, [selectedCoast]);

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      saveUserLocation(location);
      
      const nearest = findNearestCoast(location.latitude, location.longitude);
      setSelectedCoast(nearest);
      
      toast.success(`📍 Location detected: ${location.city || 'Unknown'}, ${location.state || 'Unknown'}`);
    } catch (error) {
      const locationError = error as LocationError;
      toast.error(locationError.message || 'Failed to get location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationSearch = async () => {
    if (!locationInput.trim()) return;
    
    setIsLoadingLocation(true);
    try {
      const location = await getCoordinatesFromAddress(locationInput);
      setUserLocation(location);
      saveUserLocation(location);
      
      const nearest = findNearestCoast(location.latitude, location.longitude);
      setSelectedCoast(nearest);
      
      toast.success(`🎯 Found: ${location.city || locationInput}`);
      setLocationInput('');
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to find location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleCoastSelect = (coast: CoastLocation) => {
    setSelectedCoast(coast);
    toast.success(`🌊 Viewing ${coast.name}, ${coast.state}`);
  };

  const toggleFavoriteCoast = (coastId: string) => {
    const isFavorite = favoriteCoasts.includes(coastId);
    
    if (isFavorite) {
      removeFavoriteCoast(coastId);
      setFavoriteCoasts(prev => prev.filter(id => id !== coastId));
      toast.success('💔 Removed from favorites');
    } else {
      saveFavoriteCoast(coastId);
      setFavoriteCoasts(prev => [...prev, coastId]);
      toast.success('❤️ Added to favorites');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLocationSearch();
    }
  };

  const getLocationSummary = () => {
    if (!userLocation) return null;
    
    return (
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 text-green-600" />
        <span className="font-medium text-green-800 dark:text-green-200">
          {userLocation.city && userLocation.state 
            ? `${userLocation.city}, ${userLocation.state}` 
            : userLocation.address || 'Location detected'
          }
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-950 dark:to-teal-950">
      {/* Enhanced Header */}
      <header className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 flex items-center justify-center shadow-lg">
                <Waves className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  Waves App
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Compass className="h-3 w-3" />
                  Professional Tide & Coast Information System
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedCoast && (
                <Badge variant="outline" className="hidden sm:flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                  <Star className="h-3 w-3" />
                  {selectedCoast.name}
                </Badge>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Enhanced Location Control Panel */}
        <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-blue-200 dark:border-blue-800 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Navigation className="h-5 w-5 text-blue-600" />
              Location & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search location (e.g., Mumbai, Gujarat, Kochi)..."
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-11"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleLocationSearch}
                    disabled={isLoadingLocation || !locationInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700 h-11 px-6"
                  >
                    {isLoadingLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleGetCurrentLocation}
                    disabled={isLoadingLocation}
                    className="border-blue-200 hover:bg-blue-50 h-11 px-6"
                  >
                    {isLoadingLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Compass className="h-4 w-4 mr-2" />
                    )}
                    GPS Location
                  </Button>
                </div>
              </div>
            </div>
            
            {userLocation && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
                {getLocationSummary()}
                {userLocation.accuracy && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Accuracy: ±{Math.round(userLocation.accuracy)}m
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Map Section */}
          <div className="xl:col-span-3">
            <Card className="h-[600px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg">
              <CardContent className="p-0 h-full">
                <MapComponent
                  userLocation={userLocation}
                  coastLocations={indiaCoastlines}
                  selectedCoast={selectedCoast}
                  onCoastSelect={handleCoastSelect}
                />
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Side Panel */}
          <div className="space-y-4">
            {/* Coast Search */}
            <CoastSearch 
              onCoastSelect={handleCoastSelect}
              userLocation={userLocation}
            />

            {/* Selected Coast Info */}
            {selectedCoast && (
              <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{selectedCoast.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedCoast.state}, {selectedCoast.country}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavoriteCoast(selectedCoast.id)}
                      className="p-2"
                    >
                      {favoriteCoasts.includes(selectedCoast.id) ? (
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      ) : (
                        <HeartOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedCoast.description && (
                    <p className="text-sm text-muted-foreground italic">
                      {selectedCoast.description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Latitude</span>
                      <p className="font-mono font-medium">{selectedCoast.latitude.toFixed(4)}</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Longitude</span>
                      <p className="font-mono font-medium">{selectedCoast.longitude.toFixed(4)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Favorite Coasts */}
            {favoriteCoasts.length > 0 && (
              <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Favorites ({favoriteCoasts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {favoriteCoasts.slice(0, 5).map(coastId => {
                      const coast = indiaCoastlines.find(c => c.id === coastId);
                      if (!coast) return null;
                      
                      return (
                        <Button
                          key={coastId}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCoastSelect(coast)}
                          className="w-full justify-start text-left h-auto p-2"
                        >
                          <div>
                            <p className="font-medium text-sm">{coast.name}</p>
                            <p className="text-xs text-muted-foreground">{coast.state}</p>
                          </div>
                        </Button>
                      );
                    })}
                    {favoriteCoasts.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{favoriteCoasts.length - 5} more favorites
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Enhanced Information Tabs */}
        {selectedCoast && (
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg">
            <Tabs defaultValue="tides" className="w-full">
              <CardHeader className="pb-3">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                  <TabsTrigger value="tides" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Tide Information
                  </TabsTrigger>
                  <TabsTrigger value="weather" className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    Weather Conditions
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    AI Assistant
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              
              <CardContent>
                <TabsContent value="tides" className="mt-0">
                  <TideDisplay coast={selectedCoast} tides={tides} />
                </TabsContent>
                
                <TabsContent value="weather" className="mt-0">
                  <WeatherOverlay coast={selectedCoast} />
                </TabsContent>
                
                <TabsContent value="chat" className="mt-0">
                  <div className="h-[600px]">
                    <ChatBot 
                      userLocation={userLocation} 
                      onCoastSelect={handleCoastSelect}
                    />
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        )}

        {/* Enhanced Welcome Section */}
        {!selectedCoast && (
          <Card className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 dark:from-blue-900 dark:via-cyan-900 dark:to-teal-900 border-blue-200 dark:border-blue-800 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="max-w-4xl mx-auto">
                <Waves className="h-20 w-20 mx-auto mb-6 text-blue-600" />
                <h2 className="text-4xl font-bold mb-4 text-blue-900 dark:text-blue-100">
                  Welcome to Waves App Professional
                </h2>
                <p className="text-xl text-blue-700 dark:text-blue-300 mb-8">
                  India's most comprehensive tide and coastal information system
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <MapPin className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Smart Location</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      GPS detection with detailed address resolution
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <TrendingUp className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Precise Tides</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Real-time predictions for all Indian coasts
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <Bot className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">AI Assistant</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Voice & text queries with smart suggestions
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <Search className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Coast Search</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Find coasts across all Indian states
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge variant="outline" className="bg-white/20 border-blue-300 text-blue-800">
                    🏖️ {indiaCoastlines.length} Coastal Locations
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 border-blue-300 text-blue-800">
                    🗺️ All Indian States Covered
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 border-blue-300 text-blue-800">
                    🛰️ Satellite & Street Maps
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 border-blue-300 text-blue-800">
                    🌤️ Weather Integration
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
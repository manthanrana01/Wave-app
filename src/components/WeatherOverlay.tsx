import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CoastLocation } from '@/lib/tideData';
import { Cloud, Wind, Thermometer, Waves, Eye, Droplets } from 'lucide-react';

interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  waveHeight: number;
  visibility: number;
  humidity: number;
  condition: string;
}

interface WeatherOverlayProps {
  coast: CoastLocation;
}

export default function WeatherOverlay({ coast }: WeatherOverlayProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate weather data fetching
    // In production, this would call a real weather API
    const fetchWeatherData = () => {
      setLoading(true);
      
      setTimeout(() => {
        // Generate realistic weather data based on location
        const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Sunny'];
        const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        
        const mockWeather: WeatherData = {
          temperature: Math.round(22 + Math.random() * 12), // 22-34°C
          windSpeed: Math.round(5 + Math.random() * 20), // 5-25 km/h
          windDirection: windDirections[Math.floor(Math.random() * windDirections.length)],
          waveHeight: Math.round((0.5 + Math.random() * 2.5) * 10) / 10, // 0.5-3.0m
          visibility: Math.round(8 + Math.random() * 7), // 8-15 km
          humidity: Math.round(60 + Math.random() * 30), // 60-90%
          condition: conditions[Math.floor(Math.random() * conditions.length)]
        };
        
        setWeather(mockWeather);
        setLoading(false);
      }, 1000);
    };

    fetchWeatherData();
  }, [coast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'partly cloudy':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cloudy':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'light rain':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWaveCondition = (height: number) => {
    if (height < 1) return { text: 'Calm', color: 'text-green-600' };
    if (height < 2) return { text: 'Moderate', color: 'text-yellow-600' };
    return { text: 'Rough', color: 'text-red-600' };
  };

  const waveCondition = getWaveCondition(weather.waveHeight);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Weather Conditions
        </CardTitle>
        <Badge className={getConditionColor(weather.condition)}>
          {weather.condition}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Temperature and Humidity */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
            <Thermometer className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-orange-700 dark:text-orange-300">Temperature</p>
              <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                {weather.temperature}°C
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <Droplets className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Humidity</p>
              <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {weather.humidity}%
              </p>
            </div>
          </div>
        </div>

        {/* Wind Conditions */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800">
          <Wind className="h-5 w-5 text-gray-600" />
          <div className="flex-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">Wind</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {weather.windSpeed} km/h {weather.windDirection}
            </p>
          </div>
        </div>

        {/* Wave Conditions */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800">
          <Waves className="h-5 w-5 text-teal-600" />
          <div className="flex-1">
            <p className="text-sm text-teal-700 dark:text-teal-300">Wave Height</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-teal-900 dark:text-teal-100">
                {weather.waveHeight}m
              </p>
              <Badge variant="outline" className={waveCondition.color}>
                {waveCondition.text}
              </Badge>
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
          <Eye className="h-5 w-5 text-purple-600" />
          <div>
            <p className="text-sm text-purple-700 dark:text-purple-300">Visibility</p>
            <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
              {weather.visibility} km
            </p>
          </div>
        </div>

        {/* Safety Notice */}
        {weather.waveHeight > 2 && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
              ⚠️ Rough sea conditions - Exercise caution near the water
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CoastLocation } from '@/lib/tideData';
import { UserLocation } from '@/lib/locationService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, MapPin, Satellite, Map as MapIcon, Route } from 'lucide-react';

// Fix for default markers in React Leaflet
delete (Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const coastIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapComponentProps {
  userLocation: UserLocation | null;
  coastLocations: CoastLocation[];
  selectedCoast: CoastLocation | null;
  onCoastSelect: (coast: CoastLocation) => void;
}

type MapType = 'street' | 'satellite' | 'terrain';

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

export default function MapComponent({ 
  userLocation, 
  coastLocations, 
  selectedCoast, 
  onCoastSelect 
}: MapComponentProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Center of India
  const [mapZoom, setMapZoom] = useState(5);
  const [mapType, setMapType] = useState<MapType>('street');

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.latitude, userLocation.longitude]);
      setMapZoom(12);
    } else if (selectedCoast) {
      setMapCenter([selectedCoast.latitude, selectedCoast.longitude]);
      setMapZoom(12);
    }
  }, [userLocation, selectedCoast]);

  const openDirections = (coast: CoastLocation) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${coast.latitude},${coast.longitude}`;
      window.open(url, '_blank');
    }
  };

  const getTileLayerUrl = () => {
    switch (mapType) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return '/images/OpenStreetMap.jpg';
    }
  };

  const getTileLayerAttribution = () => {
    switch (mapType) {
      case 'satellite':
        return '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      case 'terrain':
        return 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden border border-border">
      {/* Map Type Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border">
          <div className="flex flex-col gap-1">
            <Button
              size="sm"
              variant={mapType === 'street' ? 'default' : 'ghost'}
              onClick={() => setMapType('street')}
              className="justify-start text-xs"
            >
              <MapIcon className="h-3 w-3 mr-1" />
              Street
            </Button>
            <Button
              size="sm"
              variant={mapType === 'satellite' ? 'default' : 'ghost'}
              onClick={() => setMapType('satellite')}
              className="justify-start text-xs"
            >
              <Satellite className="h-3 w-3 mr-1" />
              Satellite
            </Button>
            <Button
              size="sm"
              variant={mapType === 'terrain' ? 'default' : 'ghost'}
              onClick={() => setMapType('terrain')}
              className="justify-start text-xs"
            >
              <MapIcon className="h-3 w-3 mr-1" />
              Terrain
            </Button>
          </div>
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="h-full w-full"
        zoomControl={true}
      >
        <MapUpdater center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          key={mapType}
          attribution={getTileLayerAttribution()}
          url={getTileLayerUrl()}
          maxZoom={18}
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userIcon}
          >
            <Popup>
              <div className="text-center min-w-[200px]">
                <MapPin className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold text-lg mb-2">Your Location</h3>
                {userLocation.address && (
                  <p className="text-sm text-muted-foreground mb-3">{userLocation.address}</p>
                )}
                <div className="text-xs text-muted-foreground">
                  <p>Lat: {userLocation.latitude.toFixed(6)}</p>
                  <p>Lng: {userLocation.longitude.toFixed(6)}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Coast location markers */}
        {coastLocations.map((coast) => (
          <Marker
            key={coast.id}
            position={[coast.latitude, coast.longitude]}
            icon={coastIcon}
            eventHandlers={{
              click: () => onCoastSelect(coast)
            }}
          >
            <Popup>
              <div className="text-center min-w-[250px]">
                <h3 className="font-semibold text-lg mb-1">{coast.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {coast.state}, {coast.country}
                </p>
                {coast.description && (
                  <p className="text-xs text-muted-foreground mb-3 italic">
                    {coast.description}
                  </p>
                )}
                
                <div className="text-xs text-muted-foreground mb-3">
                  <p>Lat: {coast.latitude.toFixed(4)}</p>
                  <p>Lng: {coast.longitude.toFixed(4)}</p>
                </div>
                
                <div className="space-y-2">
                  <Button
                    size="sm"
                    onClick={() => onCoastSelect(coast)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    View Tide Info
                  </Button>
                  {userLocation && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDirections(coast)}
                      className="w-full"
                    >
                      <Route className="h-3 w-3 mr-1" />
                      Get Directions
                    </Button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface LocationError {
  code: number;
  message: string;
}

// Get user's current location using browser geolocation
export function getCurrentLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Geolocation is not supported by this browser'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        
        // Get detailed address information
        try {
          const addressInfo = await getDetailedAddressFromCoordinates(
            position.coords.latitude, 
            position.coords.longitude
          );
          Object.assign(location, addressInfo);
        } catch (error) {
          console.warn('Failed to get detailed address:', error);
        }
        
        resolve(location);
      },
      (error) => {
        let message = 'Unknown error occurred';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        reject({
          code: error.code,
          message
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

// Enhanced reverse geocoding to get detailed address from coordinates
export async function getDetailedAddressFromCoordinates(lat: number, lng: number): Promise<Partial<UserLocation>> {
  try {
    // Using OpenStreetMap Nominatim for reverse geocoding (free alternative to Google)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1&accept-language=en`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    
    if (data.display_name) {
      const address = data.address || {};
      return {
        address: data.display_name,
        city: address.city || address.town || address.village || address.suburb,
        state: address.state || address.province,
        country: address.country
      };
    } else {
      return {
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      };
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return {
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    };
  }
}

// Reverse geocoding to get address from coordinates (backward compatibility)
export async function getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
  const result = await getDetailedAddressFromCoordinates(lat, lng);
  return result.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

// Enhanced forward geocoding to get coordinates from address
export async function getCoordinatesFromAddress(address: string): Promise<UserLocation> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1&accept-language=en`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    
    if (data.length > 0) {
      const result = data[0];
      const addressDetails = result.address || {};
      
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        address: result.display_name,
        city: addressDetails.city || addressDetails.town || addressDetails.village || addressDetails.suburb,
        state: addressDetails.state || addressDetails.province,
        country: addressDetails.country
      };
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    console.error('Forward geocoding failed:', error);
    throw new Error('Unable to find coordinates for the given address');
  }
}

// Save user location to localStorage
export function saveUserLocation(location: UserLocation): void {
  try {
    localStorage.setItem('wavesApp_userLocation', JSON.stringify(location));
  } catch (error) {
    console.error('Failed to save location to localStorage:', error);
  }
}

// Load user location from localStorage
export function loadUserLocation(): UserLocation | null {
  try {
    const saved = localStorage.getItem('wavesApp_userLocation');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load location from localStorage:', error);
    return null;
  }
}

// Save favorite coasts
export function saveFavoriteCoast(coastId: string): void {
  try {
    const favorites = getFavoriteCoasts();
    if (!favorites.includes(coastId)) {
      favorites.push(coastId);
      localStorage.setItem('wavesApp_favoriteCoasts', JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Failed to save favorite coast:', error);
  }
}

// Remove favorite coast
export function removeFavoriteCoast(coastId: string): void {
  try {
    const favorites = getFavoriteCoasts();
    const updated = favorites.filter(id => id !== coastId);
    localStorage.setItem('wavesApp_favoriteCoasts', JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to remove favorite coast:', error);
  }
}

// Get favorite coasts
export function getFavoriteCoasts(): string[] {
  try {
    const saved = localStorage.getItem('wavesApp_favoriteCoasts');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load favorite coasts:', error);
    return [];
  }
}
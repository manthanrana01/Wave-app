import { addHours, format, isAfter, isBefore } from 'date-fns';

export interface TideEvent {
  time: Date;
  height: number;
  type: 'high' | 'low';
}

export interface CoastLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  state?: string;
  timeZone: string;
  description?: string;
}

// Comprehensive India coastline data including Gujarat and all major coastal states
export const indiaCoastlines: CoastLocation[] = [
  // Gujarat Coast
  {
    id: 'ahmedabad-coast',
    name: 'Kandla Port',
    latitude: 23.0225,
    longitude: 70.2167,
    country: 'India',
    state: 'Gujarat',
    timeZone: 'Asia/Kolkata',
    description: 'Major port in Gulf of Kutch'
  },
  {
    id: 'dwarka',
    name: 'Dwarka Beach',
    latitude: 22.2394,
    longitude: 68.9678,
    country: 'India',
    state: 'Gujarat',
    timeZone: 'Asia/Kolkata',
    description: 'Sacred coastal city'
  },
  {
    id: 'porbandar',
    name: 'Porbandar Beach',
    latitude: 21.6417,
    longitude: 69.6293,
    country: 'India',
    state: 'Gujarat',
    timeZone: 'Asia/Kolkata',
    description: 'Birthplace of Mahatma Gandhi'
  },
  {
    id: 'veraval',
    name: 'Veraval Port',
    latitude: 20.9077,
    longitude: 70.3665,
    country: 'India',
    state: 'Gujarat',
    timeZone: 'Asia/Kolkata',
    description: 'Major fishing port'
  },
  {
    id: 'diu',
    name: 'Diu Beach',
    latitude: 20.7144,
    longitude: 70.9876,
    country: 'India',
    state: 'Daman and Diu',
    timeZone: 'Asia/Kolkata',
    description: 'Popular tourist destination'
  },
  
  // Maharashtra Coast
  {
    id: 'mumbai',
    name: 'Mumbai Coast (Gateway of India)',
    latitude: 18.9220,
    longitude: 72.8347,
    country: 'India',
    state: 'Maharashtra',
    timeZone: 'Asia/Kolkata',
    description: 'Financial capital coastline'
  },
  {
    id: 'alibag',
    name: 'Alibag Beach',
    latitude: 18.6414,
    longitude: 72.8722,
    country: 'India',
    state: 'Maharashtra',
    timeZone: 'Asia/Kolkata',
    description: 'Popular weekend getaway'
  },
  {
    id: 'ratnagiri',
    name: 'Ratnagiri Coast',
    latitude: 16.9902,
    longitude: 73.3120,
    country: 'India',
    state: 'Maharashtra',
    timeZone: 'Asia/Kolkata',
    description: 'Konkan coast gem'
  },
  
  // Goa Coast
  {
    id: 'goa-north',
    name: 'Calangute Beach',
    latitude: 15.5447,
    longitude: 73.7547,
    country: 'India',
    state: 'Goa',
    timeZone: 'Asia/Kolkata',
    description: 'Queen of beaches'
  },
  {
    id: 'goa-south',
    name: 'Palolem Beach',
    latitude: 15.0100,
    longitude: 74.0233,
    country: 'India',
    state: 'Goa',
    timeZone: 'Asia/Kolkata',
    description: 'Paradise beach'
  },
  {
    id: 'panaji',
    name: 'Panaji Waterfront',
    latitude: 15.4909,
    longitude: 73.8278,
    country: 'India',
    state: 'Goa',
    timeZone: 'Asia/Kolkata',
    description: 'Capital city coast'
  },
  
  // Karnataka Coast
  {
    id: 'mangalore',
    name: 'Mangalore Port',
    latitude: 12.8697,
    longitude: 74.8420,
    country: 'India',
    state: 'Karnataka',
    timeZone: 'Asia/Kolkata',
    description: 'Major port city'
  },
  {
    id: 'udupi',
    name: 'Udupi Beach',
    latitude: 13.3409,
    longitude: 74.7421,
    country: 'India',
    state: 'Karnataka',
    timeZone: 'Asia/Kolkata',
    description: 'Temple town coast'
  },
  {
    id: 'karwar',
    name: 'Karwar Beach',
    latitude: 14.8142,
    longitude: 74.1297,
    country: 'India',
    state: 'Karnataka',
    timeZone: 'Asia/Kolkata',
    description: 'Naval base coast'
  },
  
  // Kerala Coast
  {
    id: 'kochi',
    name: 'Kochi Port (Cochin)',
    latitude: 9.9312,
    longitude: 76.2673,
    country: 'India',
    state: 'Kerala',
    timeZone: 'Asia/Kolkata',
    description: 'Queen of Arabian Sea'
  },
  {
    id: 'trivandrum',
    name: 'Kovalam Beach',
    latitude: 8.4004,
    longitude: 76.9784,
    country: 'India',
    state: 'Kerala',
    timeZone: 'Asia/Kolkata',
    description: 'Lighthouse beach'
  },
  {
    id: 'alleppey',
    name: 'Alleppey Beach',
    latitude: 9.4981,
    longitude: 76.3388,
    country: 'India',
    state: 'Kerala',
    timeZone: 'Asia/Kolkata',
    description: 'Venice of the East'
  },
  {
    id: 'kozhikode',
    name: 'Kozhikode Beach',
    latitude: 11.2588,
    longitude: 75.7804,
    country: 'India',
    state: 'Kerala',
    timeZone: 'Asia/Kolkata',
    description: 'City of spices coast'
  },
  
  // Tamil Nadu Coast
  {
    id: 'chennai',
    name: 'Chennai Marina Beach',
    latitude: 13.0827,
    longitude: 80.2707,
    country: 'India',
    state: 'Tamil Nadu',
    timeZone: 'Asia/Kolkata',
    description: 'Longest urban beach in India'
  },
  {
    id: 'pondicherry',
    name: 'Pondicherry Beach',
    latitude: 11.9416,
    longitude: 79.8083,
    country: 'India',
    state: 'Puducherry',
    timeZone: 'Asia/Kolkata',
    description: 'French colonial coast'
  },
  {
    id: 'rameswaram',
    name: 'Rameswaram Beach',
    latitude: 9.2876,
    longitude: 79.3129,
    country: 'India',
    state: 'Tamil Nadu',
    timeZone: 'Asia/Kolkata',
    description: 'Sacred island'
  },
  {
    id: 'kanyakumari',
    name: 'Kanyakumari Beach',
    latitude: 8.0883,
    longitude: 77.5385,
    country: 'India',
    state: 'Tamil Nadu',
    timeZone: 'Asia/Kolkata',
    description: 'Southernmost tip of India'
  },
  
  // Andhra Pradesh Coast
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam Beach',
    latitude: 17.6868,
    longitude: 83.2185,
    country: 'India',
    state: 'Andhra Pradesh',
    timeZone: 'Asia/Kolkata',
    description: 'Jewel of the East Coast'
  },
  {
    id: 'vijayawada',
    name: 'Machilipatnam Port',
    latitude: 16.1874,
    longitude: 81.1385,
    country: 'India',
    state: 'Andhra Pradesh',
    timeZone: 'Asia/Kolkata',
    description: 'Historic port city'
  },
  
  // Odisha Coast
  {
    id: 'puri',
    name: 'Puri Beach',
    latitude: 19.8135,
    longitude: 85.8312,
    country: 'India',
    state: 'Odisha',
    timeZone: 'Asia/Kolkata',
    description: 'Jagannath temple coast'
  },
  {
    id: 'bhubaneswar-coast',
    name: 'Chandrabhaga Beach',
    latitude: 19.8762,
    longitude: 86.0965,
    country: 'India',
    state: 'Odisha',
    timeZone: 'Asia/Kolkata',
    description: 'Konark temple nearby'
  },
  
  // West Bengal Coast
  {
    id: 'kolkata',
    name: 'Kolkata Port (Hooghly)',
    latitude: 22.5726,
    longitude: 88.3639,
    country: 'India',
    state: 'West Bengal',
    timeZone: 'Asia/Kolkata',
    description: 'Cultural capital port'
  },
  {
    id: 'digha',
    name: 'Digha Beach',
    latitude: 21.6269,
    longitude: 87.5069,
    country: 'India',
    state: 'West Bengal',
    timeZone: 'Asia/Kolkata',
    description: 'Popular seaside resort'
  },
  
  // Andaman & Nicobar Islands
  {
    id: 'port-blair',
    name: 'Port Blair',
    latitude: 11.6234,
    longitude: 92.7265,
    country: 'India',
    state: 'Andaman and Nicobar Islands',
    timeZone: 'Asia/Kolkata',
    description: 'Island capital'
  },
  {
    id: 'havelock',
    name: 'Havelock Island',
    latitude: 12.0067,
    longitude: 92.9797,
    country: 'India',
    state: 'Andaman and Nicobar Islands',
    timeZone: 'Asia/Kolkata',
    description: 'Radhanagar Beach'
  },
  
  // Lakshadweep
  {
    id: 'kavaratti',
    name: 'Kavaratti Island',
    latitude: 10.5669,
    longitude: 72.6420,
    country: 'India',
    state: 'Lakshadweep',
    timeZone: 'Asia/Kolkata',
    description: 'Coral island paradise'
  }
];

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find nearest coast to given coordinates
export function findNearestCoast(latitude: number, longitude: number): CoastLocation {
  let nearest = indiaCoastlines[0];
  let minDistance = calculateDistance(latitude, longitude, nearest.latitude, nearest.longitude);
  
  indiaCoastlines.forEach(coast => {
    const distance = calculateDistance(latitude, longitude, coast.latitude, coast.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = coast;
    }
  });
  
  return nearest;
}

// Search coasts by name or state
export function searchCoasts(query: string): CoastLocation[] {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return indiaCoastlines;
  
  return indiaCoastlines.filter(coast => 
    coast.name.toLowerCase().includes(searchTerm) ||
    coast.state?.toLowerCase().includes(searchTerm) ||
    coast.description?.toLowerCase().includes(searchTerm)
  );
}

// Generate tide predictions for a location (simplified algorithm)
export function generateTidePredictions(coast: CoastLocation, date: Date = new Date()): TideEvent[] {
  const tides: TideEvent[] = [];
  const baseTime = new Date(date);
  baseTime.setHours(0, 0, 0, 0);
  
  // Simplified tide calculation - in reality this would use harmonic analysis
  // Most locations have 2 high and 2 low tides per day (semi-diurnal)
  const tidePattern = [
    { hours: 2, type: 'low' as const, height: 0.3 },
    { hours: 8, type: 'high' as const, height: 2.1 },
    { hours: 14, type: 'low' as const, height: 0.2 },
    { hours: 20, type: 'high' as const, height: 2.3 }
  ];
  
  // Generate tides for next 3 days
  for (let day = 0; day < 3; day++) {
    tidePattern.forEach(pattern => {
      const tideTime = addHours(baseTime, day * 24 + pattern.hours + (Math.random() - 0.5) * 2);
      tides.push({
        time: tideTime,
        height: pattern.height + (Math.random() - 0.5) * 0.4,
        type: pattern.type
      });
    });
  }
  
  return tides.sort((a, b) => a.time.getTime() - b.time.getTime());
}

// Get next tide event
export function getNextTide(tides: TideEvent[]): TideEvent | null {
  const now = new Date();
  return tides.find(tide => isAfter(tide.time, now)) || null;
}

// Get current tide status
export function getCurrentTideStatus(tides: TideEvent[]): { 
  current: 'rising' | 'falling' | 'unknown';
  nextTide: TideEvent | null;
  timeToNext: number;
} {
  const now = new Date();
  const nextTide = getNextTide(tides);
  const lastTide = tides.filter(tide => isBefore(tide.time, now)).pop();
  
  let current: 'rising' | 'falling' | 'unknown' = 'unknown';
  if (lastTide && nextTide) {
    current = lastTide.type === 'low' ? 'rising' : 'falling';
  }
  
  const timeToNext = nextTide ? nextTide.time.getTime() - now.getTime() : 0;
  
  return {
    current,
    nextTide,
    timeToNext
  };
}
# Waves App - MVP Development Plan

## Core Files to Create/Modify:

1. **src/pages/Index.tsx** - Main dashboard with tide information and map
2. **src/components/TideDisplay.tsx** - Tide times, countdown, and visualization
3. **src/components/MapComponent.tsx** - Interactive map with location services
4. **src/components/ChatBot.tsx** - AI assistant for tide queries
5. **src/components/WeatherOverlay.tsx** - Weather information display
6. **src/components/ThemeToggle.tsx** - Dark/light mode switcher
7. **src/lib/tideData.ts** - Tide calculation and coastline data
8. **src/lib/locationService.ts** - Location fetching and geolocation utilities

## MVP Features Priority:
1. ✅ Basic UI layout with modern design
2. ✅ Location detection and manual input
3. ✅ Interactive map with Leaflet.js
4. ✅ Tide display with countdown timers
5. ✅ Dark/light mode toggle
6. ✅ Basic chatbot interface
7. ✅ India coastline data integration
8. ✅ Responsive design with animations

## Dependencies to Add:
- leaflet, react-leaflet (maps)
- chart.js, react-chartjs-2 (charts)
- date-fns (time handling)
- lucide-react (icons)

## Implementation Strategy:
- Start with core layout and theme system
- Add location services and map integration
- Implement tide data display and calculations
- Create interactive chatbot interface
- Add weather overlay and bookmarking
- Optimize for mobile and add animations
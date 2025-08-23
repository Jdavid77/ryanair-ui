# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern React frontend application for searching Ryanair flights built with:
- React 18 + TypeScript + Vite
- Tailwind CSS for styling
- TanStack Query v5 for API state management  
- Headless UI for accessible components
- Leaflet for interactive maps
- Heroicons for consistent iconography
- Ryanair API integration

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview

# Type checking
npm run tsc

# Lint code
npm run lint
```

## API Integration

The app integrates with the Ryanair API at `https://api-ryanair.jnobrega.com` with these main endpoints:

**System:**
- `GET /health` - Health check

**Airports:**  
- `GET /api/airports/active` - Get all active airports
- `GET /api/airports/{code}` - Get airport details by IATA code
- `GET /api/airports/closest` - Get closest airport based on IP
- `GET /api/airports/nearby` - Get nearby airports based on IP
- `GET /api/airports/{code}/destinations` - Get destinations from airport
- `GET /api/airports/{code}/schedules` - Get flight schedules from airport
- `GET /api/airports/{from}/routes/{to}` - Find routes between airports

**Fares:**
- `GET /api/fares/cheapest-per-day` - Get cheapest fares per day for a route
- `GET /api/fares/daily-range` - Find daily fares in date range  
- `GET /api/fares/cheapest-round-trip` - Find cheapest round trip fares

## Architecture

### Core Directories
- `src/components/` - Reusable UI components organized by feature
  - `ui/` - Basic UI components (Button, Input, Card, etc.)
  - `airport/` - Airport search with origin/destination modes, dynamic loading, and interactive maps
  - `fare/` - Flight search form and results with proper error handling
  - `common/` - Simplified layout components (Header, Layout) - Footer removed
- `src/hooks/` - Custom React hooks for API integration with proper caching
- `src/services/` - API client with correct parameter mapping and TypeScript interfaces
- `src/pages/` - Single HomePage with integrated search and results
- `src/utils/` - Utility functions for formatting, constants, and styling
- `src/providers/` - TanStack Query provider for state management

### Key Component Structure
```
HomePage
├── FlightSearchForm (airport selection, dates, passengers)
│   ├── AirportSearch (origin mode - all airports)
│   ├── AirportSearch (destination mode - filtered by origin)
│   └── NearbyAirportsButton (map modal trigger)
└── FareSearchResults (airline-style cards, price calendar)

Airport Map Modal
├── AirportMapModal (modal container with airport list)
└── LeafletMap (geographic map with markers)
```

### State Management
- Uses TanStack Query for server state management and caching
- API responses cached with 5-minute stale time, 15-minute garbage collection
- Custom hooks provide typed API integration with proper error handling
  - `useAirports` - Airport data fetching with geolocation
  - `useClosestAirport` - Get closest airport based on user location
  - `useNearbyAirports` - Get nearby airports based on user location
  - `useFares` - Flexible fare search supporting one-way/round-trip
  - `useFareSearch` - Unified hook handling both search types

### Styling System
- Tailwind CSS v3 with authentic Ryanair color scheme:
  - Primary: Navy Blue (#073590) 
  - Secondary: Yellow (#ffd700)
  - Clean whites and grays for backgrounds
- Minimalist design focused on functionality over decorative elements
- Mobile-first responsive design with proper touch interactions
- Custom utility classes for consistent spacing and typography
- Authentic Ryanair logo component (RyanairLogo.tsx)

## Key Features

1. **Dynamic Airport Selection** - From dropdown shows all airports, To dropdown shows destinations from selected origin
2. **Flight Search Form** - One-way and round-trip flight search with date validation (defaults to one-way)
3. **Fare Results** - Airline-style flight cards displaying departure/arrival times, duration, and pricing
4. **Multiple Round-trip Options** - Shows all available round-trip combinations (up to 10 options) with calculated total prices
5. **Price Calendar** - Interactive calendar for flexible date selection (expandable)
6. **Real-time Error Handling** - Proper API error messages and loading states
7. **Responsive Design** - Clean, mobile-optimized interface focused on core functionality
8. **Authentic Ryanair Branding** - Navy blue (#073590) and yellow (#ffd700) color scheme with logo
9. **Airport Map Feature** - Interactive map modal showing closest and nearby airports with geographic visualization

## TypeScript Integration

All components are fully typed with interfaces defined in `src/services/types.ts`. The API client provides end-to-end type safety from API responses to UI components.

## Important Implementation Details

### API Parameter Mapping (Fixed)
The `/api/fares/cheapest-round-trip` endpoint requires specific parameter names:
```typescript
// ✅ Correct (current implementation)
{
  from: string,           // Origin airport code
  to: string,            // Destination airport code  
  startDate: string,     // Departure date (YYYY-MM-DD)
  endDate: string,       // Return date (YYYY-MM-DD)
  currency: string       // Currency code (EUR, USD, etc.)
}

// ❌ Wrong (previous implementation)
// outboundDate/inboundDate were incorrect parameter names
```

### Price Display Structure (Fixed)
API responses use nested pricing structure:
```typescript
// ✅ Correct access pattern for one-way
fareData.outbound.minFare.price.value
fareData.outbound.minFare.price.currencyCode

// ✅ Correct access pattern for round-trip
fareData.map(option => ({
  departure: option.departure.price.value,
  return: option.return.price.value,
  total: option.departure.price.value + option.return.price.value
}))

// ❌ Wrong (previous)
// fareData.outbound.price was incorrect structure
// option.totalPrice was not provided by API
```

### Airport Selection Flow
1. Origin dropdown loads all active airports
2. User selects origin airport  
3. Destination dropdown dynamically loads destinations for selected origin
4. Form validation ensures both airports selected and different

### Airport Map Integration
The `/api/airports/closest` and `/api/airports/nearby` endpoints provide coordinate data:
```typescript
interface ClosestAirport extends Airport {
  distance?: number;
  distanceUnit?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
```

**Map Components:**
- `AirportMapModal.tsx` - Modal container with airport list and map
- `LeafletMap.tsx` - Geographic map using OpenStreetMap tiles
- `NearbyAirportsButton.tsx` - Map pin button trigger

**Map Features:**
- Real geographic visualization with coastlines and land masses
- Custom markers: green for closest airport (animated), yellow for nearby airports
- Interactive popups with airport details and distances
- Auto-fit bounds to show all airports optimally
- Zoom controls and scroll wheel navigation

## Common Tasks

### Adding New API Endpoints
1. Update types in `src/services/types.ts`
2. Add API function in `src/services/api.ts` with correct parameter mapping
3. Create custom hook in appropriate hooks file with proper error handling
4. Implement UI components with loading/error states

### Debugging API Issues
1. Check browser Network tab for actual API calls and responses
2. Verify parameter names match API documentation exactly
3. Use React Query DevTools to inspect cache state and errors
4. Test with different airport combinations to isolate issues

### Styling Guidelines
- Use Tailwind utility classes consistently
- Follow the authentic Ryanair color scheme (navy blue #073590, yellow #ffd700)
- Prioritize functionality over decorative elements
- Ensure proper mobile responsiveness and accessibility

## Current Status (Latest Updates)

✅ **Completed Features:**
- Authentic Ryanair branding with correct colors and logo
- One-way flight search (defaults to one-way, positioned on left)
- Round-trip flight search displaying ALL available options (up to 10)
- Multiple passenger pricing calculation (price × passenger count)
- Total price calculation for round-trip flights (departure + return prices)
- Proper API integration with correct parameter mapping
- Date-specific fare lookup (shows prices for selected dates, not monthly minimums)
- Comprehensive error handling and loading states
- Mobile-responsive design with clean UI
- Airport map feature with Leaflet integration and geographic visualization

✅ **Round-trip Multiple Results Implementation:**
- Fixed JSX syntax issues in fare results mapping
- Shows all round-trip combinations returned by API
- Each option displays calculated total price in prominent header
- Individual flight details for outbound and return legs
- Best price indication for cheapest option
- Proper price formatting and currency display

🔧 **Known TypeScript Issues (Non-blocking):**
- Some null-safety warnings for searchParams properties
- Price comparison type overlaps (non-critical)
- All functionality works despite these warnings

✅ **Airport Map Modal Implementation:**
- Interactive map showing closest (green) and nearby (yellow) airports
- Real geographic visualization with OpenStreetMap tiles
- Coordinate-based positioning from API endpoints
- Modal triggered by map pin button in flight search form
- Auto-fitting bounds and responsive design
- Accessible with proper ARIA labels and keyboard navigation

💡 **Architecture Highlights:**
- Uses TanStack Query for efficient API caching
- TypeScript interfaces match actual API responses
- Modular component structure with proper separation of concerns
- Custom hooks provide clean API integration layer
- Leaflet integration for real geographic mapping with zero external API costs

## Dependencies

### Core Dependencies
```json
{
  "leaflet": "^1.9.4",
  "@types/leaflet": "^1.9.12",
  "@heroicons/react": "^2.0.18"
}
```

### External Resources
- **Leaflet CSS**: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`
- **Map Tiles**: OpenStreetMap (free, no API key required)
- **Icons**: Heroicons (not Lucide React)
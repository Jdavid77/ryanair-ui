# Ryanair Flight Search App

> 🤖 **Built entirely with [Claude Code](https://claude.ai/code)** - AI-powered development assistant

A modern, responsive React application for searching Ryanair flights with interactive airport mapping and real-time fare comparison.

![Ryanair Colors](https://img.shields.io/badge/Ryanair-Navy%20Blue-073590)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)

## ✈️ Features

- **🔍 Smart Flight Search**: One-way and round-trip flights with dynamic airport selection
- **🗺️ Interactive Airport Maps**: Visual map showing closest and nearby airports with real geographic data
- **💰 Multiple Fare Options**: Compare all available round-trip combinations with calculated totals
- **📱 Responsive Design**: Mobile-first design with authentic Ryanair branding
- **⚡ Real-time Data**: Live fare information with proper error handling and loading states
- **🎯 Dynamic Destinations**: Destination airports filter based on selected origin

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ryanair-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend framework with hooks |
| **TypeScript** | Type safety and better DX |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **TanStack Query v5** | Server state management |
| **Leaflet** | Interactive maps |
| **Heroicons** | Consistent iconography |

## 📱 Screenshots

### Flight Search Form
- Clean interface with Ryanair's navy blue and yellow branding
- Dynamic airport selection (destinations filter by origin)
- Date validation and passenger selection

### Airport Map Modal
- Real geographic visualization using OpenStreetMap
- Green markers for closest airport (animated)
- Yellow markers for nearby airports
- Interactive popups with airport details

### Flight Results
- Airline-style flight cards
- Multiple round-trip options with total pricing
- Clear departure/arrival times and duration

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run tsc      # Type checking
npm run lint     # Lint code
```

### Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── airport/      # Airport search & map components
│   ├── fare/         # Flight search & results
│   └── common/       # Layout components
├── hooks/            # Custom React hooks
├── services/         # API client & types
├── pages/            # Application pages
├── utils/            # Helper functions
└── providers/        # Context providers
```

### Key Components

| Component | Description |
|-----------|-------------|
| `FlightSearchForm` | Main search interface |
| `AirportSearch` | Smart airport selection with origin/destination modes |
| `AirportMapModal` | Interactive map popup |
| `LeafletMap` | Geographic map with custom markers |
| `FareSearchResults` | Flight results with multiple options |

## 🌐 API Integration

Connects to `https://api-ryanair.jnobrega.com` with these endpoints:

### Airports
- `GET /api/airports/active` - All active airports
- `GET /api/airports/closest` - Closest airport by IP location
- `GET /api/airports/nearby` - Nearby airports by IP location
- `GET /api/airports/{code}/destinations` - Available destinations

### Fares
- `GET /api/fares/cheapest-per-day` - Daily fare data
- `GET /api/fares/cheapest-round-trip` - Round-trip combinations

## 🎨 Design System

### Colors (Authentic Ryanair)
- **Primary**: Navy Blue `#073590`
- **Secondary**: Yellow `#ffd700` 
- **Backgrounds**: Clean whites and grays

### Typography
- Mobile-first responsive design
- Consistent spacing with Tailwind utilities
- Accessible contrast ratios

## 🗺️ Map Features

The airport map uses **Leaflet** with **OpenStreetMap** tiles (free, no API keys required):

- **Real Geography**: Coastlines, land masses, and geographic features
- **Custom Markers**: 
  - 🟢 Green (animated pulse) for closest airport
  - 🟡 Yellow for nearby airports
- **Interactive**: Click markers for airport details
- **Auto-fit**: Automatically adjusts bounds to show all airports
- **Responsive**: Works on mobile and desktop

## 🔍 Search Flow

1. **Origin Selection**: Choose departure airport from all active airports
2. **Destination Selection**: Destinations auto-filter based on origin
3. **Date & Passengers**: Select travel dates and passenger count
4. **Results**: View all available flight options with pricing
5. **Map Discovery**: Use map button to explore nearby airports

## 📊 Performance Features

- **Caching**: 5-minute stale time, 15-minute garbage collection
- **Error Handling**: Comprehensive API error messages
- **Loading States**: Smooth loading indicators
- **Type Safety**: End-to-end TypeScript coverage


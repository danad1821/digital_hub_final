// shipping-data.js

export const initialCenter = [35.0, 0]; // A center point near the Mediterranean

export const shippingLocations = [
  {
    id: 1,
    name: 'North Dock Hub',
    lat: 40.7128,
    lng: -74.0060, // New York
    address: '100 Pier St, NY, USA',
    destinations: [
      { lat: 51.5074, lng: 0.1278, name: 'London Port' }, // London
      { lat: 34.0522, lng: -118.2437, name: 'LA Logistics Center' }, // LA
    ],
  },
  {
    id: 2,
    name: 'West Coast Gateway',
    lat: 34.0522,
    lng: -118.2437, // Los Angeles
    address: '450 Terminal Way, CA, USA',
    destinations: [
      { lat: 40.7128, lng: -74.0060, name: 'North Dock Hub' }, // NY
      { lat: 35.6895, lng: 139.6917, name: 'Tokyo Depot' }, // Tokyo
    ],
  },
  {
    id: 3,
    name: 'European Central Depot',
    lat: 51.5074,
    lng: 0.1278, // London
    address: '3 Docklands Rd, UK',
    destinations: [
      { lat: 40.7128, lng: -74.0060, name: 'North Dock Hub' }, // NY
      { lat: 48.8566, lng: 2.3522, name: 'Paris Rail Hub' }, // Paris
    ],
  },
];
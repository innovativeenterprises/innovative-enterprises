
/**
 * @fileOverview A knowledge base of Omani government institution locations and a utility for distance calculation.
 */

export const OMAN_MINISTRIES = [
    "Ministry of Commerce, Industry & Investment Promotion (MOCIIP)",
    "Ministry of Labour",
    "Royal Oman Police (ROP)",
    "Ministry of Housing and Urban Planning",
    "Ministry of Health (MOH)",
    "Ministry of Transport, Communications and IT (MTCIT)",
    "Ministry of Foreign Affairs",
    "Tax Authority",
] as const;

export type Ministry = (typeof OMAN_MINISTRIES)[number];

type Location = { lat: number; lon: number };

// GPS Coordinates for key government buildings in Muscat.
// This acts as our AI's "memory" or knowledge base.
export const ministryLocations: Record<Ministry, Location> = {
    "Ministry of Commerce, Industry & Investment Promotion (MOCIIP)": { lat: 23.5880, lon: 58.3829 },
    "Ministry of Labour": { lat: 23.5855, lon: 58.3845 },
    "Royal Oman Police (ROP)": { lat: 23.5892, lon: 58.4015 }, // Assuming main Qurum location
    "Ministry of Housing and Urban Planning": { lat: 23.5866, lon: 58.3879 },
    "Ministry of Health (MOH)": { lat: 23.5898, lon: 58.3962 },
    "Ministry of Transport, Communications and IT (MTCIT)": { lat: 23.5888, lon: 58.3934 },
    "Ministry of Foreign Affairs": { lat: 23.6133, lon: 58.5447 },
    "Tax Authority": { lat: 23.5842, lon: 58.3858 },
};

// Starting point for all trips (Innovative Enterprises office)
const startPoint: Location = { lat: 23.5518, lon: 58.5024 }; // Al Amerat

// Helper function to calculate distance between two lat/lon points (Haversine formula)
function getDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
  const dLon = (loc2.lon - loc1.lon) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * (Math.PI / 180)) *
      Math.cos(loc2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Simple TSP solver (Nearest Neighbor heuristic) - sufficient for a small number of locations
export function calculateTotalDistance(locations: (Location & { name: string })[]): { distance: number, path: string[] } {
  if (locations.length === 0) return { distance: 0, path: ['Office'] };

  let unvisited = [...locations];
  let currentPoint = startPoint;
  let totalDistance = 0;
  let path: string[] = ['Office'];
  
  while (unvisited.length > 0) {
    let nearestIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const distance = getDistance(currentPoint, unvisited[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }
    
    totalDistance += minDistance;
    currentPoint = unvisited[nearestIndex];
    path.push(unvisited[nearestIndex].name);
    unvisited.splice(nearestIndex, 1);
  }

  // Add return trip to the office
  totalDistance += getDistance(currentPoint, startPoint);
  path.push('Office');

  return { distance: totalDistance, path };
}

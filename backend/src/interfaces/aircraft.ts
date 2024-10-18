export interface Aircraft {
    icao: string;
    flight: string;
    latitude: number;
    longitude: number;
    altitude: number;
    speed: number;
    heading: number;
    lastUpdate: number;
    prevLatitude?: number;
    prevLongitude?: number;
  }
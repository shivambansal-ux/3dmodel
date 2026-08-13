export type ZoneId = 
  | 'central_park' 
  | 'residential' 
  | 'education' 
  | 'healthcare' 
  | 'business_hub' 
  | 'industrial' 
  | 'public_services'
  | 'logistics'
  | 'green_recreation';

export type CameraMode = 
  | 'master_plan' 
  | 'top_view' 
  | 'isometric' 
  | 'zone_view' 
  | 'road_view' 
  | 'infrastructure_view' 
  | 'building_view';

export type TimeOfDay = 'day' | 'golden_hour' | 'night';

export interface BuildingData {
  id: string;
  name: string;
  zoneId: ZoneId;
  type: string;
  x: number; // world x coord
  z: number; // world z coord
  width: number;
  depth: number;
  height: number;
  color: string;
  roofColor?: string;
  floors: number;
  solarCapacityKw: number;
  purpose: string;
  smartFeatures: string[];
  sustainabilityRating: string;
  description: string;
  architecturalStyle: string;
  occupancy?: string;
}

export interface ZoneData {
  id: ZoneId;
  name: string;
  hindiName?: string;
  color: string;
  accentColor: string;
  description: string;
  centerPos: [number, number, number];
  areaAcres: number;
  highlights: string[];
}

export interface RoadSegment {
  id: string;
  name: string;
  start: [number, number];
  end: [number, number];
  width: number;
  type: 'ring' | 'radial' | 'inner' | 'freight';
  waypoints?: [number, number][];
}

export type AVStatus = 'CRUISING' | 'ROUNDABOUT_APPROACH' | 'PARKING' | 'CHARGING' | 'DISEMBARKING';

export interface EVChargingStation {
  id: string;
  name: string;
  x: number;
  z: number;
  capacity: number;
  occupied: number;
  powerKw: number;
  zone: string;
  roadId: string;
}

export interface BusStation {
  id: string;
  name: string;
  zoneId: ZoneId;
  x: number;
  z: number;
  routeName: string;
  connectedRoadId: string;
  capacity: number;
  color: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'ev_car' | 'ev_bus' | 'ev_shuttle' | 'ambulance' | 'ev_pod';
  color: string;
  roadId: string;
  progress: number;
  speed: number;
  baseSpeed: number;
  direction: 1 | -1;
  status: AVStatus;
  batteryLevel: number;
  targetChargingStationId?: string;
  chargingTimer?: number;
  currentLocationName?: string;
  laneOffset?: number;
  brakeLightOn?: boolean;
}

export interface UndergroundUtility {
  id: string;
  type: 'fresh_water' | 'sewage' | 'storm_water' | 'recycled_water' | 'electricity' | 'telecom';
  name: string;
  color: string;
  depth: number; // y coordinate (negative)
  radius: number;
  points: [number, number, number][];
}

export interface CityStats {
  totalAreaAcres: number;
  populationCapacity: number;
  solarCapacityMw: number;
  greenCoverPercent: number;
  zeroSignalIntersections: number;
  waterRecycledPercent: number;
  evChargingStations: number;
  undergroundNetworkKm: number;
}

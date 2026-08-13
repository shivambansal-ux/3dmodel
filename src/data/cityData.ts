import { ZoneData, BuildingData, RoadSegment, CityStats, UndergroundUtility, EVChargingStation, Vehicle, BusStation } from '../types';

export const CITY_STATS: CityStats = {
  totalAreaAcres: 300,
  populationCapacity: 55000,
  solarCapacityMw: 165.0,
  greenCoverPercent: 62,
  zeroSignalIntersections: 16,
  waterRecycledPercent: 100,
  evChargingStations: 250,
  undergroundNetworkKm: 68,
};

export const ZONES: ZoneData[] = [
  { id: 'central_park', name: 'Central Park', color: '#10b981', accentColor: '#059669', description: 'Central green lung.', centerPos: [0, 0, 0], areaAcres: 40, highlights: ['Lake'] },
  { id: 'residential', name: 'Residential', color: '#3b82f6', accentColor: '#2563eb', description: 'Housing.', centerPos: [-130, 0, -130], areaAcres: 50, highlights: ['Eco Towers'] },
  { id: 'education', name: 'Education', color: '#8b5cf6', accentColor: '#7c3aed', description: 'University.', centerPos: [0, 0, -130], areaAcres: 40, highlights: ['University'] },
  { id: 'healthcare', name: 'Healthcare', color: '#ef4444', accentColor: '#dc2626', description: 'Hospital.', centerPos: [130, 0, -130], areaAcres: 35, highlights: ['Hospital'] },
  { id: 'business_hub', name: 'Commercial & Business', color: '#f59e0b', accentColor: '#d97706', description: 'Offices.', centerPos: [-130, 0, 0], areaAcres: 40, highlights: ['Icon Tower'] },
  { id: 'public_services', name: 'Public Services', color: '#06b6d4', accentColor: '#0891b2', description: 'Admin.', centerPos: [130, 0, 0], areaAcres: 20, highlights: ['ICCC'] },
  { id: 'industrial', name: 'Industrial', color: '#64748b', accentColor: '#475569', description: 'Factory.', centerPos: [-130, 0, 130], areaAcres: 35, highlights: ['Gigafactory'] },
  { id: 'logistics', name: 'Logistics', color: '#475569', accentColor: '#334155', description: 'Warehouses.', centerPos: [130, 0, 130], areaAcres: 30, highlights: ['Warehouse'] },
  { id: 'green_recreation', name: 'Green & Recreation', color: '#84cc16', accentColor: '#65a30d', description: 'Sports.', centerPos: [0, 0, 130], areaAcres: 40, highlights: ['Sports Grounds'] },
];

export const BUILDINGS: BuildingData[] = [
  // ---------------- INDUSTRIAL ZONE (SW) ----------------
  { id: 'ind_1', name: 'Gigafactory A', zoneId: 'industrial', type: 'Manufacturing', x: -160, z: 100, width: 35, depth: 25, height: 18, color: '#94a3b8', roofColor: '#1e40af', floors: 3, solarCapacityKw: 1200, purpose: 'EV Assembly', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Factory.', architecturalStyle: 'Industrial' },
  { id: 'ind_2', name: 'Gigafactory B', zoneId: 'industrial', type: 'Manufacturing', x: -110, z: 100, width: 35, depth: 25, height: 18, color: '#94a3b8', roofColor: '#1e40af', floors: 3, solarCapacityKw: 1200, purpose: 'Battery Lab', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Factory.', architecturalStyle: 'Industrial' },
  { id: 'ind_3', name: 'Gigafactory C', zoneId: 'industrial', type: 'Manufacturing', x: -160, z: 135, width: 35, depth: 25, height: 18, color: '#94a3b8', roofColor: '#1e40af', floors: 3, solarCapacityKw: 1200, purpose: 'Solar Panels', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Factory.', architecturalStyle: 'Industrial' },
  { id: 'ind_4', name: 'Gigafactory D', zoneId: 'industrial', type: 'Manufacturing', x: -110, z: 135, width: 35, depth: 25, height: 18, color: '#94a3b8', roofColor: '#1e40af', floors: 3, solarCapacityKw: 1200, purpose: 'Recycling', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Factory.', architecturalStyle: 'Industrial' },
  { id: 'ind_5', name: 'Gigafactory E', zoneId: 'industrial', type: 'Manufacturing', x: -160, z: 170, width: 35, depth: 25, height: 18, color: '#94a3b8', roofColor: '#1e40af', floors: 3, solarCapacityKw: 1200, purpose: 'Automation', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Factory.', architecturalStyle: 'Industrial' },
  { id: 'ind_6', name: 'Gigafactory F', zoneId: 'industrial', type: 'Manufacturing', x: -110, z: 170, width: 35, depth: 25, height: 18, color: '#94a3b8', roofColor: '#1e40af', floors: 3, solarCapacityKw: 1200, purpose: 'Materials', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Factory.', architecturalStyle: 'Industrial' },

  // ---------------- LOGISTICS & WAREHOUSE (SE) ----------------
  { id: 'log_1', name: 'Smart Hub A', zoneId: 'logistics', type: 'Logistics', x: 110, z: 100, width: 35, depth: 25, height: 16, color: '#cbd5e1', roofColor: '#1e40af', floors: 2, solarCapacityKw: 800, purpose: 'Distribution', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Warehouse.', architecturalStyle: 'Industrial' },
  { id: 'log_2', name: 'Smart Hub B', zoneId: 'logistics', type: 'Logistics', x: 160, z: 100, width: 35, depth: 25, height: 16, color: '#cbd5e1', roofColor: '#1e40af', floors: 2, solarCapacityKw: 800, purpose: 'Distribution', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Warehouse.', architecturalStyle: 'Industrial' },
  { id: 'log_3', name: 'Smart Hub C', zoneId: 'logistics', type: 'Logistics', x: 110, z: 135, width: 35, depth: 25, height: 16, color: '#cbd5e1', roofColor: '#1e40af', floors: 2, solarCapacityKw: 800, purpose: 'Distribution', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Warehouse.', architecturalStyle: 'Industrial' },
  { id: 'log_4', name: 'Smart Hub D', zoneId: 'logistics', type: 'Logistics', x: 160, z: 135, width: 35, depth: 25, height: 16, color: '#cbd5e1', roofColor: '#1e40af', floors: 2, solarCapacityKw: 800, purpose: 'Distribution', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Warehouse.', architecturalStyle: 'Industrial' },
  { id: 'log_5', name: 'Smart Hub E', zoneId: 'logistics', type: 'Logistics', x: 110, z: 170, width: 35, depth: 25, height: 16, color: '#cbd5e1', roofColor: '#1e40af', floors: 2, solarCapacityKw: 800, purpose: 'Distribution', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Warehouse.', architecturalStyle: 'Industrial' },
  { id: 'log_6', name: 'Smart Hub F', zoneId: 'logistics', type: 'Logistics', x: 160, z: 170, width: 35, depth: 25, height: 16, color: '#cbd5e1', roofColor: '#1e40af', floors: 2, solarCapacityKw: 800, purpose: 'Distribution', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Warehouse.', architecturalStyle: 'Industrial' },

  // ---------------- HEALTHCARE ZONE (NE) ----------------
  { id: 'hc_1', name: 'General Hospital', zoneId: 'healthcare', type: 'Hospital', x: 110, z: -100, width: 35, depth: 25, height: 35, color: '#fecaca', roofColor: '#b91c1c', floors: 8, solarCapacityKw: 500, purpose: 'General', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Hospital wing.', architecturalStyle: 'Modern' },
  { id: 'hc_2', name: 'Specialty Care', zoneId: 'healthcare', type: 'Hospital', x: 160, z: -100, width: 35, depth: 25, height: 40, color: '#fecaca', roofColor: '#b91c1c', floors: 9, solarCapacityKw: 500, purpose: 'Specialty', smartFeatures: ['Helipad'], sustainabilityRating: 'Platinum', description: 'Hospital wing.', architecturalStyle: 'Modern' },
  { id: 'hc_3', name: 'Research Center', zoneId: 'healthcare', type: 'Hospital', x: 110, z: -135, width: 35, depth: 25, height: 25, color: '#fca5a5', roofColor: '#991b1b', floors: 6, solarCapacityKw: 300, purpose: 'Research', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Hospital wing.', architecturalStyle: 'Modern' },
  { id: 'hc_4', name: 'Outpatient Dept', zoneId: 'healthcare', type: 'Hospital', x: 160, z: -135, width: 35, depth: 25, height: 20, color: '#fca5a5', roofColor: '#991b1b', floors: 4, solarCapacityKw: 250, purpose: 'OPD', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Hospital wing.', architecturalStyle: 'Modern' },
  { id: 'hc_5', name: 'Oncology Wing', zoneId: 'healthcare', type: 'Hospital', x: 110, z: -170, width: 35, depth: 25, height: 30, color: '#f87171', roofColor: '#7f1d1d', floors: 7, solarCapacityKw: 400, purpose: 'Oncology', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Hospital wing.', architecturalStyle: 'Modern' },
  { id: 'hc_6', name: 'Pediatrics', zoneId: 'healthcare', type: 'Hospital', x: 160, z: -170, width: 35, depth: 25, height: 25, color: '#f87171', roofColor: '#7f1d1d', floors: 6, solarCapacityKw: 350, purpose: 'Pediatrics', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Hospital wing.', architecturalStyle: 'Modern' },

  // ---------------- RESIDENTIAL ZONE (NW) ----------------
  { id: 'res_1', name: 'Eco Tower Alpha', zoneId: 'residential', type: 'Apartments', x: -160, z: -100, width: 30, depth: 30, height: 60, color: '#bfdbfe', roofColor: '#2563eb', floors: 20, solarCapacityKw: 200, purpose: 'Housing', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Tower.', architecturalStyle: 'Modern' },
  { id: 'res_2', name: 'Eco Tower Beta', zoneId: 'residential', type: 'Apartments', x: -110, z: -100, width: 30, depth: 30, height: 65, color: '#bfdbfe', roofColor: '#2563eb', floors: 22, solarCapacityKw: 200, purpose: 'Housing', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Tower.', architecturalStyle: 'Modern' },
  { id: 'res_3', name: 'Eco Tower Gamma', zoneId: 'residential', type: 'Apartments', x: -160, z: -135, width: 30, depth: 30, height: 55, color: '#bfdbfe', roofColor: '#2563eb', floors: 18, solarCapacityKw: 200, purpose: 'Housing', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Tower.', architecturalStyle: 'Modern' },
  { id: 'res_4', name: 'Eco Tower Delta', zoneId: 'residential', type: 'Apartments', x: -110, z: -135, width: 30, depth: 30, height: 70, color: '#bfdbfe', roofColor: '#2563eb', floors: 24, solarCapacityKw: 200, purpose: 'Housing', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Tower.', architecturalStyle: 'Modern' },
  { id: 'res_5', name: 'Eco Tower Epsilon', zoneId: 'residential', type: 'Apartments', x: -160, z: -170, width: 30, depth: 30, height: 60, color: '#bfdbfe', roofColor: '#2563eb', floors: 20, solarCapacityKw: 200, purpose: 'Housing', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Tower.', architecturalStyle: 'Modern' },
  { id: 'res_6', name: 'Eco Tower Zeta', zoneId: 'residential', type: 'Apartments', x: -110, z: -170, width: 30, depth: 30, height: 50, color: '#bfdbfe', roofColor: '#2563eb', floors: 16, solarCapacityKw: 200, purpose: 'Housing', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Tower.', architecturalStyle: 'Modern' },

  // ---------------- BUSINESS HUB (W) ----------------
  { id: 'biz_1', name: 'Infinity Tower', zoneId: 'business_hub', type: 'Skyscraper', x: -160, z: -35, width: 35, depth: 30, height: 110, color: '#fde68a', roofColor: '#d97706', floors: 55, solarCapacityKw: 600, purpose: 'Offices', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Skyscraper.', architecturalStyle: 'Modern Glass' },
  { id: 'biz_2', name: 'Tech Incubator', zoneId: 'business_hub', type: 'Offices', x: -110, z: -35, width: 35, depth: 30, height: 75, color: '#fde047', roofColor: '#b45309', floors: 30, solarCapacityKw: 400, purpose: 'Offices', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Tech Park.', architecturalStyle: 'Modern Glass' },
  { id: 'biz_3', name: 'Financial HQ', zoneId: 'business_hub', type: 'Offices', x: -160, z: 0, width: 35, depth: 30, height: 95, color: '#fef08a', roofColor: '#b45309', floors: 45, solarCapacityKw: 500, purpose: 'Offices', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'HQ.', architecturalStyle: 'Modern Glass' },
  { id: 'biz_4', name: 'Corporate Plaza', zoneId: 'business_hub', type: 'Offices', x: -110, z: 0, width: 35, depth: 30, height: 85, color: '#fef9c3', roofColor: '#d97706', floors: 40, solarCapacityKw: 450, purpose: 'Offices', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Plaza.', architecturalStyle: 'Modern Glass' },
  { id: 'biz_5', name: 'Venture Capital', zoneId: 'business_hub', type: 'Offices', x: -160, z: 35, width: 35, depth: 30, height: 60, color: '#fde68a', roofColor: '#b45309', floors: 25, solarCapacityKw: 350, purpose: 'Offices', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Offices.', architecturalStyle: 'Modern Glass' },
  { id: 'biz_6', name: 'Smart Mall', zoneId: 'business_hub', type: 'Shopping', x: -110, z: 35, width: 35, depth: 30, height: 30, color: '#fef08a', roofColor: '#d97706', floors: 5, solarCapacityKw: 500, purpose: 'Shopping', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Mall.', architecturalStyle: 'Modern Glass' },

  // ---------------- PUBLIC SERVICES (E) ----------------
  { id: 'pub_1', name: 'City Command Center', zoneId: 'public_services', type: 'Government', x: 110, z: -35, width: 35, depth: 30, height: 25, color: '#a5f3fc', roofColor: '#0891b2', floors: 5, solarCapacityKw: 300, purpose: 'ICCC', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Command Center.', architecturalStyle: 'Modern' },
  { id: 'pub_2', name: 'Police HQ', zoneId: 'public_services', type: 'Police', x: 160, z: -35, width: 35, depth: 30, height: 20, color: '#bae6fd', roofColor: '#0284c7', floors: 4, solarCapacityKw: 250, purpose: 'Police', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'HQ.', architecturalStyle: 'Modern' },
  { id: 'pub_3', name: 'Fire Station', zoneId: 'public_services', type: 'Fire', x: 110, z: 0, width: 35, depth: 30, height: 18, color: '#fecaca', roofColor: '#dc2626', floors: 3, solarCapacityKw: 200, purpose: 'Fire', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Fire.', architecturalStyle: 'Modern' },
  { id: 'pub_4', name: 'City Court', zoneId: 'public_services', type: 'Government', x: 160, z: 0, width: 35, depth: 30, height: 28, color: '#a5f3fc', roofColor: '#0891b2', floors: 6, solarCapacityKw: 300, purpose: 'Court', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Court.', architecturalStyle: 'Modern' },
  { id: 'pub_5', name: 'Public Library', zoneId: 'public_services', type: 'Library', x: 110, z: 35, width: 35, depth: 30, height: 22, color: '#7dd3fc', roofColor: '#0369a1', floors: 4, solarCapacityKw: 250, purpose: 'Library', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Library.', architecturalStyle: 'Modern' },
  { id: 'pub_6', name: 'Post Office', zoneId: 'public_services', type: 'Government', x: 160, z: 35, width: 35, depth: 30, height: 16, color: '#bae6fd', roofColor: '#0284c7', floors: 2, solarCapacityKw: 150, purpose: 'Post', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Post.', architecturalStyle: 'Modern' },

  // ---------------- EDUCATION (N) ----------------
  { id: 'edu_1', name: 'Main Campus', zoneId: 'education', type: 'University', x: -35, z: -120, width: 30, depth: 35, height: 28, color: '#ddd6fe', roofColor: '#1d4ed8', floors: 6, solarCapacityKw: 400, purpose: 'Education', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Campus.', architecturalStyle: 'Modern' },
  { id: 'edu_2', name: 'Science Block', zoneId: 'education', type: 'University', x: 0, z: -120, width: 30, depth: 35, height: 24, color: '#c4b5fd', roofColor: '#1d4ed8', floors: 5, solarCapacityKw: 350, purpose: 'Science', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Campus.', architecturalStyle: 'Modern' },
  { id: 'edu_3', name: 'Arts Block', zoneId: 'education', type: 'University', x: 35, z: -120, width: 30, depth: 35, height: 22, color: '#a78bfa', roofColor: '#1d4ed8', floors: 4, solarCapacityKw: 300, purpose: 'Arts', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Campus.', architecturalStyle: 'Modern' },
  { id: 'edu_4', name: 'Engineering Labs', zoneId: 'education', type: 'University', x: -35, z: -165, width: 30, depth: 35, height: 32, color: '#ddd6fe', roofColor: '#1d4ed8', floors: 7, solarCapacityKw: 450, purpose: 'Labs', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Campus.', architecturalStyle: 'Modern' },
  { id: 'edu_5', name: 'Dormitory A', zoneId: 'education', type: 'Housing', x: 0, z: -165, width: 30, depth: 35, height: 40, color: '#c4b5fd', roofColor: '#1d4ed8', floors: 10, solarCapacityKw: 300, purpose: 'Dorms', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Campus.', architecturalStyle: 'Modern' },
  { id: 'edu_6', name: 'Dormitory B', zoneId: 'education', type: 'Housing', x: 35, z: -165, width: 30, depth: 35, height: 40, color: '#a78bfa', roofColor: '#1d4ed8', floors: 10, solarCapacityKw: 300, purpose: 'Dorms', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Campus.', architecturalStyle: 'Modern' },

  // ---------------- GREEN & RECREATION (S) ----------------
  { id: 'grn_1', name: 'Indoor Arena', zoneId: 'green_recreation', type: 'Sports', x: -35, z: 120, width: 35, depth: 35, height: 20, color: '#d9f99d', roofColor: '#65a30d', floors: 3, solarCapacityKw: 300, purpose: 'Sports', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Arena.', architecturalStyle: 'Modern' },
  { id: 'grn_2', name: 'Aquatics Center', zoneId: 'green_recreation', type: 'Sports', x: 0, z: 120, width: 35, depth: 35, height: 18, color: '#bef264', roofColor: '#4d7c0f', floors: 2, solarCapacityKw: 250, purpose: 'Pool', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Pool.', architecturalStyle: 'Modern' },
  { id: 'grn_3', name: 'Fitness Club', zoneId: 'green_recreation', type: 'Sports', x: 35, z: 120, width: 35, depth: 35, height: 15, color: '#a3e635', roofColor: '#3f6212', floors: 2, solarCapacityKw: 200, purpose: 'Gym', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Gym.', architecturalStyle: 'Modern' },
  { id: 'grn_4', name: 'Tennis Courts Building', zoneId: 'green_recreation', type: 'Sports', x: -35, z: 165, width: 35, depth: 35, height: 12, color: '#d9f99d', roofColor: '#65a30d', floors: 1, solarCapacityKw: 150, purpose: 'Courts', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Courts.', architecturalStyle: 'Modern' },
  { id: 'grn_5', name: 'Recreation Hub', zoneId: 'green_recreation', type: 'Recreation', x: 0, z: 165, width: 35, depth: 35, height: 25, color: '#bef264', roofColor: '#4d7c0f', floors: 4, solarCapacityKw: 300, purpose: 'Hub', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Hub.', architecturalStyle: 'Modern' },
  { id: 'grn_6', name: 'Community Hall', zoneId: 'green_recreation', type: 'Recreation', x: 35, z: 165, width: 35, depth: 35, height: 20, color: '#a3e635', roofColor: '#3f6212', floors: 3, solarCapacityKw: 200, purpose: 'Hall', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Hall.', architecturalStyle: 'Modern' },

  // ---------------- CENTRAL PARK (Center) ----------------
  { id: 'cp_1', name: 'Glass Pavilion', zoneId: 'central_park', type: 'Recreation', x: 0, z: 0, width: 25, depth: 25, height: 18, color: '#6ee7b7', roofColor: '#047857', floors: 2, solarCapacityKw: 100, purpose: 'Pavilion', smartFeatures: ['Green Roof'], sustainabilityRating: 'Platinum', description: 'Pavilion.', architecturalStyle: 'Modern Glass' }
];

export const ROAD_NETWORKS: RoadSegment[] = [
  // EXTERNAL HIGHWAYS (Connecting to the outside world)
  { id: 'ext_n', name: 'North Highway Connection', start: [0, -300], end: [0, -200], width: 16, type: 'radial' },
  { id: 'ext_s', name: 'South Highway Connection', start: [0, 200], end: [0, 300], width: 16, type: 'radial' },
  { id: 'ext_e', name: 'East Highway Connection', start: [200, 0], end: [300, 0], width: 16, type: 'radial' },
  { id: 'ext_w', name: 'West Highway Connection', start: [-300, 0], end: [-200, 0], width: 16, type: 'radial' },

  // MAIN RING ROAD (Outer boundary)
  { id: 'ring_n', name: 'North Ring Road', start: [-200, -200], end: [200, -200], width: 14, type: 'ring' },
  { id: 'ring_s', name: 'South Ring Road', start: [-200, 200], end: [200, 200], width: 14, type: 'ring' },
  { id: 'ring_e', name: 'East Ring Road', start: [200, -200], end: [200, 200], width: 14, type: 'ring' },
  { id: 'ring_w', name: 'West Ring Road', start: [-200, -200], end: [-200, 200], width: 14, type: 'ring' },

  // PRIMARY ROADS (The 3x3 Grid dividers)
  { id: 'prim_v1', name: 'Primary West Avenue', start: [-70, -200], end: [-70, 200], width: 12, type: 'radial' },
  { id: 'prim_v2', name: 'Primary East Avenue', start: [70, -200], end: [70, 200], width: 12, type: 'radial' },
  { id: 'prim_h1', name: 'Primary North Avenue', start: [-200, -70], end: [200, -70], width: 12, type: 'radial' },
  { id: 'prim_h2', name: 'Primary South Avenue', start: [-200, 70], end: [200, 70], width: 12, type: 'radial' },
];

export const UNDERGROUND_UTILITIES: UndergroundUtility[] = [
  // Fresh Water Ring
  {
    id: 'pipe_fresh_water_ring',
    type: 'fresh_water',
    name: 'Smart Fresh Water Grid',
    color: '#0284c7', // Deep Blue
    depth: 4,
    radius: 0.8,
    points: [
      [-190, -4, -190], [190, -4, -190], [190, -4, 190], [-190, -4, 190], [-190, -4, -190]
    ]
  },
  // Sewage Ring
  {
    id: 'pipe_sewage_ring',
    type: 'sewage',
    name: 'Automated Sewage & Waste Pipeline',
    color: '#78350f', // Brown
    depth: 6,
    radius: 1.2,
    points: [
      [-185, -6, -185], [185, -6, -185], [185, -6, 185], [-185, -6, 185], [-185, -6, -185]
    ]
  },
  // Electricity
  {
    id: 'pipe_power_grid',
    type: 'electricity',
    name: 'Underground Microgrid Cables',
    color: '#facc15', // Yellow
    depth: 2,
    radius: 0.5,
    points: [
      [-195, -2, -195], [195, -2, -195], [195, -2, 195], [-195, -2, 195], [-195, -2, -195]
    ]
  },
  // Cross grid lines
  {
    id: 'pipe_power_cross_1',
    type: 'electricity',
    name: 'Microgrid Cross-Link',
    color: '#facc15',
    depth: 2,
    radius: 0.4,
    points: [[-70, -2, -195], [-70, -2, 195]]
  },
  {
    id: 'pipe_power_cross_2',
    type: 'electricity',
    name: 'Microgrid Cross-Link',
    color: '#facc15',
    depth: 2,
    radius: 0.4,
    points: [[70, -2, -195], [70, -2, 195]]
  }
];

export interface RoundaboutJunction {
  id: string;
  name: string;
  x: number;
  z: number;
  radius: number;
}

export const ROUNDABOUT_JUNCTIONS: RoundaboutJunction[] = [];

export const EV_CHARGING_STATIONS: EVChargingStation[] = [
  { id: 'ev_1', name: 'Industrial Solar Dock', x: -160, z: 120, capacity: 10, occupied: 6, powerKw: 350, zone: 'Industrial', roadId: 'prim_h2' },
  { id: 'ev_2', name: 'Logistics Fleet Charger', x: 160, z: 120, capacity: 12, occupied: 8, powerKw: 350, zone: 'Logistics', roadId: 'prim_h2' },
  { id: 'ev_3', name: 'Hospital Emergency Hub', x: 160, z: -120, capacity: 8, occupied: 2, powerKw: 150, zone: 'Healthcare', roadId: 'prim_h1' },
  { id: 'ev_4', name: 'Business Plaza Fast Charge', x: -160, z: 0, capacity: 6, occupied: 4, powerKw: 200, zone: 'Business Hub', roadId: 'prim_v1' },
  { id: 'ev_5', name: 'Residential Green Dock', x: -120, z: -160, capacity: 8, occupied: 5, powerKw: 100, zone: 'Residential', roadId: 'prim_v1' },
];

// ============== BUS STATIONS (One per Zone, Moved to side of the road) ==============
export const BUS_STATIONS: BusStation[] = [
  { id: 'bs_residential', name: 'Residential Bus Terminal', zoneId: 'residential', x: -150, z: -82, routeName: 'Route R1 — Residential Loop', connectedRoadId: 'prim_h1', capacity: 20, color: '#3b82f6' },
  { id: 'bs_education', name: 'University Bus Stop', zoneId: 'education', x: 0, z: -82, routeName: 'Route E1 — Campus Express', connectedRoadId: 'prim_h1', capacity: 30, color: '#8b5cf6' },
  { id: 'bs_healthcare', name: 'Hospital Bus Station', zoneId: 'healthcare', x: 130, z: -82, routeName: 'Route H1 — Hospital Direct', connectedRoadId: 'prim_h1', capacity: 25, color: '#ef4444' },
  { id: 'bs_business', name: 'Business Plaza Stop', zoneId: 'business_hub', x: -82, z: 0, routeName: 'Route B1 — Business Corridor', connectedRoadId: 'prim_v1', capacity: 25, color: '#f59e0b' },
  { id: 'bs_public', name: 'Civic Center Stop', zoneId: 'public_services', x: 82, z: 0, routeName: 'Route P1 — Civic Line', connectedRoadId: 'prim_v2', capacity: 20, color: '#06b6d4' },
  { id: 'bs_industrial', name: 'Industrial Transit Hub', zoneId: 'industrial', x: -130, z: 82, routeName: 'Route I1 — Factory Shuttle', connectedRoadId: 'prim_h2', capacity: 30, color: '#64748b' },
  { id: 'bs_green', name: 'Park & Ride Stop', zoneId: 'green_recreation', x: 0, z: 82, routeName: 'Route G1 — Green Line', connectedRoadId: 'prim_h2', capacity: 20, color: '#84cc16' },
  { id: 'bs_logistics', name: 'Logistics Gate Stop', zoneId: 'logistics', x: 130, z: 82, routeName: 'Route L1 — Freight Workers', connectedRoadId: 'prim_h2', capacity: 15, color: '#475569' },
  { id: 'bs_central', name: 'Central Park Stop', zoneId: 'central_park', x: -82, z: -70, routeName: 'Route C1 — Central Loop', connectedRoadId: 'prim_v1', capacity: 20, color: '#10b981' },
];

// ============== VEHICLE FLEET (Cars, Buses, Pods, Ambulance) ==============
export const INITIAL_AV_FLEET: Vehicle[] = [
  // --- Original Pods & Ambulance ---
  { id: 'av_1', name: 'Smart Pod 1', type: 'ev_pod', color: '#10b981', roadId: 'prim_h1', progress: 0, speed: 0.001, baseSpeed: 0.001, direction: 1, status: 'CRUISING', batteryLevel: 80 },
  { id: 'av_2', name: 'Smart Pod 2', type: 'ev_pod', color: '#3b82f6', roadId: 'prim_h2', progress: 0.5, speed: 0.0012, baseSpeed: 0.0012, direction: -1, status: 'CRUISING', batteryLevel: 95 },
  { id: 'av_4', name: 'Ambulance 1', type: 'ambulance', color: '#ef4444', roadId: 'prim_v2', progress: 0.8, speed: 0.002, baseSpeed: 0.002, direction: 1, status: 'CRUISING', batteryLevel: 100 },

  // --- Cars (EV Cars on various roads) ---
  { id: 'car_1', name: 'City Car 1', type: 'ev_car', color: '#f43f5e', roadId: 'ring_n', progress: 0.1, speed: 0.0014, baseSpeed: 0.0014, direction: 1, status: 'CRUISING', batteryLevel: 88, laneOffset: 2.0 },
  { id: 'car_2', name: 'City Car 2', type: 'ev_car', color: '#8b5cf6', roadId: 'ring_n', progress: 0.6, speed: 0.0012, baseSpeed: 0.0012, direction: -1, status: 'CRUISING', batteryLevel: 72, laneOffset: -2.0 },
  { id: 'car_3', name: 'City Car 3', type: 'ev_car', color: '#0ea5e9', roadId: 'ring_s', progress: 0.3, speed: 0.0015, baseSpeed: 0.0015, direction: 1, status: 'CRUISING', batteryLevel: 95, laneOffset: 2.0 },
  { id: 'car_4', name: 'City Car 4', type: 'ev_car', color: '#f97316', roadId: 'ring_e', progress: 0.4, speed: 0.0011, baseSpeed: 0.0011, direction: 1, status: 'CRUISING', batteryLevel: 60, laneOffset: 2.0 },
  { id: 'car_5', name: 'City Car 5', type: 'ev_car', color: '#14b8a6', roadId: 'ring_w', progress: 0.7, speed: 0.0013, baseSpeed: 0.0013, direction: -1, status: 'CRUISING', batteryLevel: 81, laneOffset: -2.0 },
  { id: 'car_6', name: 'City Car 6', type: 'ev_car', color: '#a855f7', roadId: 'prim_v1', progress: 0.2, speed: 0.0012, baseSpeed: 0.0012, direction: 1, status: 'CRUISING', batteryLevel: 90, laneOffset: 2.0 },
  { id: 'car_7', name: 'City Car 7', type: 'ev_car', color: '#eab308', roadId: 'prim_v2', progress: 0.5, speed: 0.0014, baseSpeed: 0.0014, direction: -1, status: 'CRUISING', batteryLevel: 67, laneOffset: -2.0 },
  { id: 'car_8', name: 'City Car 8', type: 'ev_car', color: '#ec4899', roadId: 'prim_h1', progress: 0.35, speed: 0.0013, baseSpeed: 0.0013, direction: 1, status: 'CRUISING', batteryLevel: 78, laneOffset: 2.5 },
  { id: 'car_9', name: 'City Car 9', type: 'ev_car', color: '#06b6d4', roadId: 'prim_h2', progress: 0.8, speed: 0.0011, baseSpeed: 0.0011, direction: 1, status: 'CRUISING', batteryLevel: 55, laneOffset: 2.5 },
  { id: 'car_10', name: 'City Car 10', type: 'ev_car', color: '#84cc16', roadId: 'ring_e', progress: 0.15, speed: 0.0016, baseSpeed: 0.0016, direction: -1, status: 'CRUISING', batteryLevel: 92, laneOffset: -2.0 },
  { id: 'car_11', name: 'City Car 11', type: 'ev_car', color: '#d946ef', roadId: 'ring_s', progress: 0.55, speed: 0.0010, baseSpeed: 0.0010, direction: -1, status: 'CRUISING', batteryLevel: 44, laneOffset: -2.0 },
  { id: 'car_12', name: 'City Car 12', type: 'ev_car', color: '#22d3ee', roadId: 'prim_v1', progress: 0.75, speed: 0.0015, baseSpeed: 0.0015, direction: -1, status: 'CRUISING', batteryLevel: 85, laneOffset: -2.5 },

  // --- Buses (Zone-to-Zone routes on primary avenues) ---
  { id: 'bus_1', name: 'Route R1 Bus', type: 'ev_bus', color: '#3b82f6', roadId: 'prim_h1', progress: 0.15, speed: 0.0006, baseSpeed: 0.0006, direction: 1, status: 'CRUISING', batteryLevel: 82, laneOffset: 3.5 },
  { id: 'bus_2', name: 'Route B1 Bus', type: 'ev_bus', color: '#f59e0b', roadId: 'prim_v1', progress: 0.4, speed: 0.00055, baseSpeed: 0.00055, direction: -1, status: 'CRUISING', batteryLevel: 70, laneOffset: -3.5 },
  { id: 'bus_3', name: 'Route H1 Bus', type: 'ev_bus', color: '#ef4444', roadId: 'prim_h1', progress: 0.7, speed: 0.0006, baseSpeed: 0.0006, direction: -1, status: 'CRUISING', batteryLevel: 58, laneOffset: -3.5 },
  { id: 'bus_4', name: 'Route G1 Bus', type: 'ev_bus', color: '#84cc16', roadId: 'prim_h2', progress: 0.25, speed: 0.0005, baseSpeed: 0.0005, direction: 1, status: 'CRUISING', batteryLevel: 90, laneOffset: 3.5 },
  { id: 'bus_5', name: 'Route P1 Bus', type: 'ev_bus', color: '#06b6d4', roadId: 'prim_v2', progress: 0.6, speed: 0.00055, baseSpeed: 0.00055, direction: 1, status: 'CRUISING', batteryLevel: 75, laneOffset: 3.5 },
  { id: 'bus_6', name: 'Route I1 Bus', type: 'ev_bus', color: '#64748b', roadId: 'ring_s', progress: 0.3, speed: 0.0005, baseSpeed: 0.0005, direction: 1, status: 'CRUISING', batteryLevel: 65, laneOffset: 3.5 },
];

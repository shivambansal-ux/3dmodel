import re

content = open('src/data/cityData.ts', 'r').read()

buildings = """
export const BUILDINGS: BuildingData[] = [
  // ---------------- INDUSTRIAL ZONE (SW) ----------------
  { id: 'ind_1', name: 'Gigafactory 1', zoneId: 'industrial', type: 'Clean Manufacturing', x: -155, z: 110, width: 50, depth: 40, height: 18, color: '#94a3b8', roofColor: '#1e40af', floors: 3, solarCapacityKw: 1200, purpose: 'EV Assembly', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Large factory.', architecturalStyle: 'Industrial' },
  { id: 'ind_2', name: 'Gigafactory 2', zoneId: 'industrial', type: 'Clean Manufacturing', x: -105, z: 110, width: 40, depth: 40, height: 18, color: '#94a3b8', roofColor: '#1e40af', floors: 3, solarCapacityKw: 1200, purpose: 'Battery Lab', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Large factory.', architecturalStyle: 'Industrial' },
  { id: 'ind_3', name: 'Gigafactory 3', zoneId: 'industrial', type: 'Clean Manufacturing', x: -155, z: 160, width: 50, depth: 40, height: 18, color: '#94a3b8', roofColor: '#1e40af', floors: 3, solarCapacityKw: 1200, purpose: 'Solar Panels', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Large factory.', architecturalStyle: 'Industrial' },
  { id: 'ind_4', name: 'Gigafactory 4', zoneId: 'industrial', type: 'Clean Manufacturing', x: -105, z: 160, width: 40, depth: 40, height: 18, color: '#94a3b8', roofColor: '#1e40af', floors: 3, solarCapacityKw: 1200, purpose: 'Recycling', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Large factory.', architecturalStyle: 'Industrial' },
  
  // ---------------- LOGISTICS & WAREHOUSE (SE) ----------------
  { id: 'log_1', name: 'Warehouse A', zoneId: 'logistics', type: 'Logistics Hub', x: 105, z: 110, width: 40, depth: 40, height: 16, color: '#cbd5e1', roofColor: '#1e40af', floors: 2, solarCapacityKw: 800, purpose: 'Distribution', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Automated warehouse.', architecturalStyle: 'Industrial' },
  { id: 'log_2', name: 'Warehouse B', zoneId: 'logistics', type: 'Logistics Hub', x: 155, z: 110, width: 40, depth: 40, height: 16, color: '#cbd5e1', roofColor: '#1e40af', floors: 2, solarCapacityKw: 800, purpose: 'Distribution', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Automated warehouse.', architecturalStyle: 'Industrial' },
  { id: 'log_3', name: 'Warehouse C', zoneId: 'logistics', type: 'Logistics Hub', x: 105, z: 160, width: 40, depth: 40, height: 16, color: '#cbd5e1', roofColor: '#1e40af', floors: 2, solarCapacityKw: 800, purpose: 'Distribution', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Automated warehouse.', architecturalStyle: 'Industrial' },
  { id: 'log_4', name: 'Warehouse D', zoneId: 'logistics', type: 'Logistics Hub', x: 155, z: 160, width: 40, depth: 40, height: 16, color: '#cbd5e1', roofColor: '#1e40af', floors: 2, solarCapacityKw: 800, purpose: 'Distribution', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Automated warehouse.', architecturalStyle: 'Industrial' },

  // ---------------- EDUCATION ZONE (N) ----------------
  { id: 'edu_main', name: 'University Block', zoneId: 'education', type: 'University Campus', x: 0, z: -110, width: 40, depth: 40, height: 28, color: '#ddd6fe', roofColor: '#1d4ed8', floors: 6, solarCapacityKw: 400, purpose: 'Education', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'University building.', architecturalStyle: 'Modern' },
  { id: 'edu_lib', name: 'Central Library', zoneId: 'education', type: 'Library', x: -35, z: -160, width: 30, depth: 30, height: 22, color: '#c4b5fd', roofColor: '#1d4ed8', floors: 4, solarCapacityKw: 200, purpose: 'Library', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Library.', architecturalStyle: 'Modern' },
  { id: 'edu_lab', name: 'Research Lab', zoneId: 'education', type: 'Research', x: 35, z: -160, width: 30, depth: 30, height: 24, color: '#a78bfa', roofColor: '#1d4ed8', floors: 5, solarCapacityKw: 250, purpose: 'Research', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Lab.', architecturalStyle: 'Modern' },

  // ---------------- HEALTHCARE ZONE (NE) ----------------
  { id: 'hosp_main', name: 'Super Specialty Hospital', zoneId: 'healthcare', type: 'Hospital', x: 135, z: -135, width: 60, depth: 60, height: 40, color: '#fecaca', roofColor: '#b91c1c', floors: 10, solarCapacityKw: 600, purpose: 'Hospital', smartFeatures: ['Helipad'], sustainabilityRating: 'Platinum', description: 'Main hospital.', architecturalStyle: 'Modern' },
  { id: 'hosp_opd', name: 'OPD & Diagnostics', zoneId: 'healthcare', type: 'Clinic', x: 100, z: -95, width: 30, depth: 30, height: 20, color: '#fca5a5', roofColor: '#991b1b', floors: 4, solarCapacityKw: 150, purpose: 'Clinic', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Diagnostics.', architecturalStyle: 'Modern' },
  
  // ---------------- COMMERCIAL & BUSINESS HUB (W) ----------------
  { id: 'biz_icon', name: 'Infinity Icon Tower', zoneId: 'business_hub', type: 'Skyscraper', x: -135, z: -30, width: 30, depth: 30, height: 120, color: '#fde68a', roofColor: '#d97706', floors: 60, solarCapacityKw: 500, purpose: 'Offices', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Skyscraper.', architecturalStyle: 'Modern Glass' },
  { id: 'biz_mall', name: 'Smart Mall', zoneId: 'business_hub', type: 'Shopping', x: -135, z: 30, width: 40, depth: 40, height: 30, color: '#fef08a', roofColor: '#b45309', floors: 5, solarCapacityKw: 400, purpose: 'Shopping', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Mall.', architecturalStyle: 'Modern' },
  { id: 'biz_hotel', name: '5-Star Eco Hotel', zoneId: 'business_hub', type: 'Hotel', x: -95, z: -30, width: 35, depth: 35, height: 50, color: '#fef9c3', roofColor: '#d97706', floors: 15, solarCapacityKw: 300, purpose: 'Hotel', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Hotel.', architecturalStyle: 'Modern' },
  { id: 'biz_it', name: 'IT Tech Park', zoneId: 'business_hub', type: 'Offices', x: -95, z: 30, width: 35, depth: 35, height: 45, color: '#fde047', roofColor: '#b45309', floors: 12, solarCapacityKw: 350, purpose: 'Offices', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Tech Park.', architecturalStyle: 'Modern' },
  
  // ---------------- PUBLIC SERVICES (E) ----------------
  { id: 'pub_iccc', name: 'City Command Center', zoneId: 'public_services', type: 'Government', x: 135, z: -30, width: 40, depth: 40, height: 25, color: '#a5f3fc', roofColor: '#0891b2', floors: 5, solarCapacityKw: 250, purpose: 'ICCC', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Command Center.', architecturalStyle: 'Modern' },
  { id: 'pub_police', name: 'Police Headquarters', zoneId: 'public_services', type: 'Police', x: 135, z: 30, width: 30, depth: 30, height: 20, color: '#bae6fd', roofColor: '#0284c7', floors: 4, solarCapacityKw: 150, purpose: 'Police', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Police.', architecturalStyle: 'Modern' },
  { id: 'pub_fire', name: 'Fire Station', zoneId: 'public_services', type: 'Fire', x: 95, z: -30, width: 30, depth: 30, height: 18, color: '#fecaca', roofColor: '#dc2626', floors: 3, solarCapacityKw: 150, purpose: 'Fire', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Fire Station.', architecturalStyle: 'Modern' },

  // ---------------- RESIDENTIAL ZONE (NW) ----------------
  { id: 'res_1', name: 'Eco Tower A', zoneId: 'residential', type: 'Apartments', x: -150, z: -150, width: 25, depth: 25, height: 60, color: '#bfdbfe', roofColor: '#2563eb', floors: 20, solarCapacityKw: 200, purpose: 'Housing', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Tower.', architecturalStyle: 'Modern' },
  { id: 'res_2', name: 'Eco Tower B', zoneId: 'residential', type: 'Apartments', x: -110, z: -150, width: 25, depth: 25, height: 60, color: '#bfdbfe', roofColor: '#2563eb', floors: 20, solarCapacityKw: 200, purpose: 'Housing', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Tower.', architecturalStyle: 'Modern' },
  { id: 'res_3', name: 'Eco Tower C', zoneId: 'residential', type: 'Apartments', x: -150, z: -110, width: 25, depth: 25, height: 60, color: '#bfdbfe', roofColor: '#2563eb', floors: 20, solarCapacityKw: 200, purpose: 'Housing', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Tower.', architecturalStyle: 'Modern' },
  { id: 'res_4', name: 'Eco Tower D', zoneId: 'residential', type: 'Apartments', x: -110, z: -110, width: 25, depth: 25, height: 60, color: '#bfdbfe', roofColor: '#2563eb', floors: 20, solarCapacityKw: 200, purpose: 'Housing', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Platinum', description: 'Tower.', architecturalStyle: 'Modern' },
  
  // Center Clubhouse in Residential
  { id: 'res_club', name: 'Community Clubhouse', zoneId: 'residential', type: 'Recreation', x: -130, z: -130, width: 20, depth: 20, height: 12, color: '#93c5fd', roofColor: '#1d4ed8', floors: 2, solarCapacityKw: 100, purpose: 'Clubhouse', smartFeatures: ['Solar Roof'], sustainabilityRating: 'Gold', description: 'Clubhouse.', architecturalStyle: 'Modern' },
];
"""
content = re.sub(r"export const BUILDINGS:\s*BuildingData\[\]\s*=\s*\[.*?\];", buildings.strip(), content, flags=re.DOTALL)

with open('src/data/cityData.ts', 'w') as f:
    f.write(content)
print("Buildings updated safely inside quadrants.")

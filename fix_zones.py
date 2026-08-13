import re

content = open('src/data/cityData.ts', 'r').read()

new_zones = """
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
"""

content = re.sub(r"export const ZONES:\s*ZoneData\[\]\s*=\s*\[.*?\];", new_zones.strip(), content, flags=re.DOTALL)

with open('src/data/cityData.ts', 'w') as f:
    f.write(content)

print("Zones updated.")

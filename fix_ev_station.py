import re

content = open('src/data/cityData.ts', 'r').read()

# Let's add EV Charging stations back in now that we have roads
ev = """
export const EV_CHARGING_STATIONS: EVChargingStation[] = [
  { id: 'ev_1', name: 'Industrial Solar Dock', x: -160, z: 120, capacity: 10, occupied: 6, powerKw: 350, zone: 'Industrial', roadId: 'prim_h2' },
  { id: 'ev_2', name: 'Logistics Fleet Charger', x: 160, z: 120, capacity: 12, occupied: 8, powerKw: 350, zone: 'Logistics', roadId: 'prim_h2' },
  { id: 'ev_3', name: 'Hospital Emergency Hub', x: 160, z: -120, capacity: 8, occupied: 2, powerKw: 150, zone: 'Healthcare', roadId: 'prim_h1' },
  { id: 'ev_4', name: 'Business Plaza Fast Charge', x: -160, z: 0, capacity: 6, occupied: 4, powerKw: 200, zone: 'Business Hub', roadId: 'prim_v1' },
  { id: 'ev_5', name: 'Residential Green Dock', x: -120, z: -160, capacity: 8, occupied: 5, powerKw: 100, zone: 'Residential', roadId: 'prim_v1' },
];
"""

content = re.sub(r"export const EV_CHARGING_STATIONS:\s*EVChargingStation\[\]\s*=\s*\[\];", ev.strip(), content)

with open('src/data/cityData.ts', 'w') as f:
    f.write(content)

print("EV Stations updated.")

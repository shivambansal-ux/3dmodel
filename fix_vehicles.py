import re

content = open('src/data/cityData.ts', 'r').read()

vehicles = """
export const INITIAL_AV_FLEET: Vehicle[] = [
  { id: 'av_1', name: 'Smart Pod 1', type: 'ev_pod', color: '#10b981', roadId: 'prim_h1', progress: 0, speed: 0.1, baseSpeed: 0.1, direction: 1, status: 'CRUISING', batteryLevel: 80 },
  { id: 'av_2', name: 'Smart Pod 2', type: 'ev_pod', color: '#3b82f6', roadId: 'prim_h2', progress: 50, speed: 0.12, baseSpeed: 0.12, direction: -1, status: 'CRUISING', batteryLevel: 95 },
  { id: 'av_3', name: 'Logistics Truck 1', type: 'ev_bus', color: '#f59e0b', roadId: 'ring_s', progress: 20, speed: 0.08, baseSpeed: 0.08, direction: 1, status: 'CRUISING', batteryLevel: 45 },
  { id: 'av_4', name: 'Ambulance 1', type: 'ambulance', color: '#ef4444', roadId: 'prim_v2', progress: 80, speed: 0.2, baseSpeed: 0.2, direction: 1, status: 'CRUISING', batteryLevel: 100 },
];
"""

content = re.sub(r"export const INITIAL_AV_FLEET:\s*Vehicle\[\]\s*=\s*\[\];", vehicles.strip(), content)

with open('src/data/cityData.ts', 'w') as f:
    f.write(content)

print("Vehicles updated.")

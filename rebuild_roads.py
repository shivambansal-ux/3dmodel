import re

content = open('src/data/cityData.ts', 'r').read()

roads = """
export const ROAD_NETWORKS: RoadSegment[] = [
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
"""

content = re.sub(r"export const ROAD_NETWORKS:\s*RoadSegment\[\]\s*=\s*\[\];", roads.strip(), content)

with open('src/data/cityData.ts', 'w') as f:
    f.write(content)

print("Roads populated.")

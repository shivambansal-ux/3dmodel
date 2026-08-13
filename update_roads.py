import re

content = open('src/data/cityData.ts', 'r').read()

new_roads = """
export const ROAD_NETWORKS: RoadSegment[] = [
  // EXTERNAL HIGHWAYS (Connecting to the outside world)
  { id: 'ext_n', name: 'North Highway Connection', start: [0, -300], end: [0, -200], width: 16, type: 'radial' },
  { id: 'ext_s', name: 'South Highway Connection', start: [0, 200], end: [0, 300], width: 16, type: 'radial' },
  { id: 'ext_e', name: 'East Highway Connection', start: [200, 0], end: [300, 0], width: 16, type: 'radial' },
  { id: 'ext_w', name: 'West Highway Connection', start: [-300, 0], end: [-200, 0], width: 16, type: 'radial' },

  // MAIN RING ROAD (Outer boundary)
"""

content = content.replace("export const ROAD_NETWORKS: RoadSegment[] = [\n  // MAIN RING ROAD (Outer boundary)", new_roads.strip())

with open('src/data/cityData.ts', 'w') as f:
    f.write(content)

print("Added external roads.")

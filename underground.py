import re

content = open('src/data/cityData.ts', 'r').read()

pipes = """
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
"""

content = re.sub(r"export const UNDERGROUND_UTILITIES:\s*UndergroundUtility\[\]\s*=\s*\[\];", pipes.strip(), content)

with open('src/data/cityData.ts', 'w') as f:
    f.write(content)

print("Pipes updated.")

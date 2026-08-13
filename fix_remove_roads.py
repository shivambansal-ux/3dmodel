import re

# 1. Remove from cityData.ts
data = open('src/data/cityData.ts', 'r').read()
data = re.sub(r"\s*// CENTRAL AXIS ROADS.*?\n.*?center_h.*?\n", "\n", data, flags=re.DOTALL)
with open('src/data/cityData.ts', 'w') as f:
    f.write(data)

# 2. Remove from CityBuilder.ts
builder = open('src/components/CityBuilder.ts', 'r').read()

builder = re.sub(r"\s*// Central Huge Roundabout around the park lake.*?this\.roadMeshGroup\.add\(centerRing\);\n", "", builder, flags=re.DOTALL)

builder = re.sub(r"\s*// Cross pathways.*?\}\n", "\n", builder, flags=re.DOTALL)

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(builder)

print("Removed central roads and cross paths.")

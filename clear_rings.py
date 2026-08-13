import re

with open('src/components/CityBuilder.ts', 'r') as f:
    content = f.read()

# Comment out everything except terrain in buildEntireCity
def comment_out(line):
    global content
    content = content.replace(f"    {line}", f"    // {line}")

comment_out("this.buildZoneBufferBelts();")
comment_out("this.buildRoadsAndJunctions();")
comment_out("this.buildEVChargingStations3D();")
comment_out("this.buildBuildings();")
comment_out("this.buildSolarStreetLights();")
comment_out("const vehicles = this.buildVehicles();")
comment_out("this.buildUndergroundInfrastructure();")

# fix vehicles return since we commented it out
content = content.replace("return { buildingMap: this.buildingMeshMap, vehicles };", "return { buildingMap: this.buildingMeshMap, vehicles: [] };")

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Cleared everything except terrain.")

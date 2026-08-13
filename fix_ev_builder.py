import re

content = open('src/components/CityBuilder.ts', 'r').read()

content = content.replace("// this.buildEVChargingStations3D();", "this.buildEVChargingStations3D();")

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("EV Stations builder un-commented.")

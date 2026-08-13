import re

content = open('src/components/CityBuilder.ts', 'r').read()

content = content.replace("// this.buildSolarStreetLights();", "this.buildSolarStreetLights();")

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Solar street lights builder un-commented.")

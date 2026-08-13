import re

content = open('src/components/CityBuilder.ts', 'r').read()

content = content.replace("// const vehicles = this.buildVehicles();", "const vehicles = this.buildVehicles();")
content = content.replace("return { buildingMap: this.buildingMeshMap, vehicles: [] };", "return { buildingMap: this.buildingMeshMap, vehicles };")

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Vehicles builder un-commented.")

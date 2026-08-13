import re

content = open('src/components/CityBuilder.ts', 'r').read()

content = content.replace("// this.buildUndergroundInfrastructure();", "this.buildUndergroundInfrastructure();")

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Underground builder un-commented.")

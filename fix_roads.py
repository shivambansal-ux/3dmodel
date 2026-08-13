import re

content = open('src/components/CityBuilder.ts', 'r').read()

content = content.replace("// this.buildZoneBufferBelts();", "this.buildZoneBufferBelts();")

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Zone buffer belts added back.")

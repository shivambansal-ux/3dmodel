import re

content = open('src/components/CityBuilder.ts', 'r').read()

content = content.replace("this.buildFlyoverBridge(ix, iz, 0, 30);", "// this.buildFlyoverBridge(ix, iz, 0, 30);")

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Flyovers commented out for now.")

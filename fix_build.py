import re

content = open('src/components/CityBuilder.ts', 'r').read()

content = content.replace("// this.buildBuildings();", "this.buildBuildings();")
# also uncomment trees
content = content.replace("// this.buildInstancedTrees();", "this.buildInstancedTrees();")

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Uncommented buildings and trees.")

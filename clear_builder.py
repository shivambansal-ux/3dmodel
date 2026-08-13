import re

with open('src/components/CityBuilder.ts', 'r') as f:
    content = f.read()

# Comment out the calls in buildEntireCity
content = content.replace("this.buildSportsFacilitiesAndAmenities();", "// this.buildSportsFacilitiesAndAmenities();")
content = content.replace("this.buildInstancedTrees();", "// this.buildInstancedTrees();")

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Cleared amenities and trees.")

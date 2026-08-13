import re

content = open('src/components/CityBuilder.ts', 'r').read()

# Update football pitch position
content = re.sub(r"pitchMesh\.position\.set\(\s*150,\s*0\.1,\s*-40\s*\);", r"pitchMesh.position.set(0, 0.1, 140);", content)
content = re.sub(r"centerCircle\.position\.set\(\s*150,\s*0\.12,\s*-40\s*\);", r"centerCircle.position.set(0, 0.12, 140);", content)
content = re.sub(r"boundaryLine\.position\.set\(\s*150,\s*0\.11,\s*-40\s*\);", r"boundaryLine.position.set(0, 0.11, 140);", content)
content = re.sub(r"standNorth\.position\.set\(\s*150,\s*4,\s*-45\s*\);", r"standNorth.position.set(0, 4, 135);", content)
content = re.sub(r"standSouth\.position\.set\(\s*150,\s*4,\s*-35\s*\);", r"standSouth.position.set(0, 4, 145);", content)

# Update tennis courts position
content = re.sub(r"court1\.position\.set\(\s*90,\s*0\.15,\s*-60\s*\);", r"court1.position.set(-30, 0.15, 120);", content)
content = re.sub(r"court2\.position\.set\(\s*90,\s*0\.15,\s*-40\s*\);", r"court2.position.set(30, 0.15, 120);", content)

# Update swimming pool position (Let's put it at South-Central as well)
content = re.sub(r"poolMesh\.position\.set\(\s*100,\s*0\.2,\s*50\s*\);", r"poolMesh.position.set(0, 0.2, 110);", content)
content = re.sub(r"poolDeck\.position\.set\(\s*100,\s*0\.1,\s*50\s*\);", r"poolDeck.position.set(0, 0.1, 110);", content)

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Builder amenities updated.")

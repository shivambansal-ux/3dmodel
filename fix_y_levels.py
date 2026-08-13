import re

content = open('src/components/CityBuilder.ts', 'r').read()

# 1. Update roads Y position (from 0.12 to 0.10)
content = content.replace("roadMesh.position.set((x1 + x2) / 2, 0.12, (z1 + z2) / 2);", "roadMesh.position.set((x1 + x2) / 2, 0.10, (z1 + z2) / 2);")

# 2. Add central roundabout
roundabout_code = """
    // Grade-Separated Underpass / Flyover Bridges at main 4 intersections
"""
new_roundabout_code = """
    // Central Huge Roundabout around the park lake
    const centerRingGeo = new THREE.RingGeometry(16, 26, 64);
    const centerRingMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.6 });
    const centerRing = new THREE.Mesh(centerRingGeo, centerRingMat);
    centerRing.rotation.x = -Math.PI / 2;
    centerRing.position.set(0, 0.105, 0);
    this.roadMeshGroup.add(centerRing);

    // Grade-Separated Underpass / Flyover Bridges at main 4 intersections
"""
content = content.replace(roundabout_code.strip(), new_roundabout_code.strip())

# 3. Y positions globally for park elements
content = content.replace("baseMesh.position.y = 0.13;", "baseMesh.position.y = 0.09;")
content = content.replace("pathMesh.position.y = 0.14;", "pathMesh.position.y = 0.11;")
content = content.replace("crossPath.position.y = 0.14;", "crossPath.position.y = 0.11;")

# Carefully replace lake mesh since there are two instances
# First, the central park lake which was at 0.15
content = content.replace("lakeMesh.position.y = 0.15;", "lakeMesh.position.y = 0.12;")
content = content.replace("fountain.position.y = 3.15;", "fountain.position.y = 3.12;")

# Second, the recreation zone lake which was at (-10, 0.15, 0)
content = content.replace("lakeMesh.position.set(-10, 0.15, 0);", "lakeMesh.position.set(-10, 0.12, 0);")
content = content.replace("court1.position.set(45, 0.14, 0);", "court1.position.set(45, 0.11, 0);")
content = content.replace("court2.position.set(45, 0.14, 25);", "court2.position.set(45, 0.11, 25);")

# 4. Update the path radii in buildCentralPark so it doesn't overlap the new road roundabout
content = content.replace("[20, 35, 50, 65].forEach(radius => {", "[32, 48, 64].forEach(radius => {")

# Write back
with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Y levels and central roundabout updated.")

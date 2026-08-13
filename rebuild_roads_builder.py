import re

content = open('src/components/CityBuilder.ts', 'r').read()

new_func = """
  private buildRoadsAndJunctions() {
    const roadTex = createRoadTexture();

    ROAD_NETWORKS.forEach((road) => {
      const [x1, z1] = road.start;
      const [x2, z2] = road.end;
      const dx = x2 - x1;
      const dz = z2 - z1;
      const length = Math.hypot(dx, dz);
      const angle = Math.atan2(dx, dz);

      const roadGeo = new THREE.PlaneGeometry(road.width, length);
      roadTex.repeat.set(1, Math.max(1, Math.floor(length / 20)));
      const roadMat = new THREE.MeshStandardMaterial({
        map: roadTex,
        roughness: 0.5,
        metalness: 0.1,
      });

      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      roadMesh.rotation.x = -Math.PI / 2;
      roadMesh.rotation.z = -angle;
      roadMesh.position.set((x1 + x2) / 2, 0.12, (z1 + z2) / 2);
      roadMesh.receiveShadow = true;
      roadMesh.name = `road_${road.id}`;

      this.roadMeshGroup.add(roadMesh);
    });

    // Grade-Separated Underpass / Flyover Bridges at main 4 intersections
    const intersections = [
      [-70, -70], [70, -70], [-70, 70], [70, 70]
    ];
    
    intersections.forEach(([ix, iz]) => {
        // Build a flyover bridge for the N-S road over the E-W road (or vice-versa)
        this.buildFlyoverBridge(ix, iz, 0, 30);
    });

    this.scene.add(this.roadMeshGroup);
  }
"""

content = re.sub(r"private buildRoadsAndJunctions\(\) \{.*?this\.scene\.add\(this\.roadMeshGroup\);\n  \}", new_func.strip(), content, flags=re.DOTALL)
content = content.replace("// this.buildRoadsAndJunctions();", "this.buildRoadsAndJunctions();")

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Road builder updated.")

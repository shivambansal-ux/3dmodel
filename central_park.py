import re

content = open('src/components/CityBuilder.ts', 'r').read()

new_func = """
  private buildCentralPark() {
    const parkGroup = new THREE.Group();
    parkGroup.position.set(0, 0, 0);

    // Green base for the park (130x130)
    const baseGeo = new THREE.PlaneGeometry(136, 136);
    const baseMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.8 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.y = 0.13;
    parkGroup.add(baseMesh);

    // Concentric Circular Walking Paths
    const pathMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.9 });
    
    [20, 35, 50, 65].forEach(radius => {
      const pathGeo = new THREE.RingGeometry(radius - 1, radius + 1, 64);
      const pathMesh = new THREE.Mesh(pathGeo, pathMat);
      pathMesh.rotation.x = -Math.PI / 2;
      pathMesh.position.y = 0.14;
      parkGroup.add(pathMesh);
    });

    // Cross pathways
    for (let i = 0; i < 4; i++) {
      const crossPath = new THREE.Mesh(new THREE.PlaneGeometry(4, 130), pathMat);
      crossPath.rotation.x = -Math.PI / 2;
      crossPath.rotation.z = (Math.PI / 4) * i;
      crossPath.position.y = 0.14;
      parkGroup.add(crossPath);
    }

    // Central Fountain Lake
    const lakeGeo = new THREE.CircleGeometry(15, 32);
    const lakeMat = new THREE.MeshStandardMaterial({ color: '#0ea5e9', roughness: 0.1, metalness: 0.8 });
    const lakeMesh = new THREE.Mesh(lakeGeo, lakeMat);
    lakeMesh.rotation.x = -Math.PI / 2;
    lakeMesh.position.y = 0.15;
    parkGroup.add(lakeMesh);

    // Fountain Centerpiece
    const fountainGeo = new THREE.CylinderGeometry(0, 2, 6, 16);
    const fountainMat = new THREE.MeshStandardMaterial({ color: '#38bdf8', metalness: 0.5 });
    const fountain = new THREE.Mesh(fountainGeo, fountainMat);
    fountain.position.y = 3.15;
    parkGroup.add(fountain);

    this.scene.add(parkGroup);
  }
"""

content = content.replace("this.buildRoadsAndJunctions();", "this.buildRoadsAndJunctions();\n    this.buildCentralPark();")
content = content + new_func

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Central park builder added.")

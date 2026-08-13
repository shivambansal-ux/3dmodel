import re

content = open('src/components/CityBuilder.ts', 'r').read()

# Make the outer ground plane slightly larger and central township fit the 400x400 area
new_ground = """
  private buildTerrainAndGround() {
    // Large Outer Ground Plane (800m x 800m)
    const grassTex = createGrassTexture();
    const groundGeo = new THREE.PlaneGeometry(800, 800, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      roughness: 0.8,
      metalness: 0.1,
      color: '#15803d',
    });

    this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.receiveShadow = true;
    this.groundMesh.name = 'city_ground';
    this.scene.add(this.groundMesh);

    // 300-Acre Master Township Base Boundary (Square 420m x 420m)
    const townshipGeo = new THREE.PlaneGeometry(420, 420);
    const sidewalkTex = createSidewalkTexture();
    sidewalkTex.repeat.set(10, 10);
    const townshipMat = new THREE.MeshStandardMaterial({
      map: sidewalkTex,
      color: '#e2e8f0',
      roughness: 0.6,
    });
    const townshipMesh = new THREE.Mesh(townshipGeo, townshipMat);
    townshipMesh.rotation.x = -Math.PI / 2;
    townshipMesh.position.y = 0.05; // slightly above ground
    townshipMesh.receiveShadow = true;
    this.scene.add(townshipMesh);

    // Outer Gate Entrance Monuments at 4 Sides
    this.buildEntranceGate(0, -210, 0, 'NORTH GATEWAY - INFINITY CITY');
    this.buildEntranceGate(0, 210, Math.PI, 'SOUTH GATEWAY - INFINITY CITY');
    this.buildEntranceGate(210, 0, Math.PI / 2, 'EAST GATEWAY - TECH EXPRESS');
    this.buildEntranceGate(-210, 0, -Math.PI / 2, 'WEST GATEWAY - ECO EXPRESS');
  }
"""

content = re.sub(r"private buildTerrainAndGround\(\) \{.*?\}\s*\n\s*private buildEntranceGate", new_ground.strip() + "\n\n  private buildEntranceGate", content, flags=re.DOTALL)

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Ground updated.")

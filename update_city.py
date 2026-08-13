import re

content = open('src/components/CityBuilder.ts', 'r').read()

# 1. Update Entrance Gate Logic
new_gate = """
    // Outer Gate Entrance Monuments at 4 Sides
    this.buildEntranceGate(0, -290, 0, 'NORTH GATEWAY');
    this.buildEntranceGate(0, 290, Math.PI, 'SOUTH GATEWAY');
    this.buildEntranceGate(290, 0, Math.PI / 2, 'EAST GATEWAY');
    this.buildEntranceGate(-290, 0, -Math.PI / 2, 'WEST GATEWAY');
  }

  private buildEntranceGate(x: number, z: number, rotationY: number, title: string) {
    const gateGroup = new THREE.Group();
    gateGroup.position.set(x, 0, z);
    gateGroup.rotation.y = rotationY;

    // Twin Modern Arch Pillars
    const pillarGeo = new THREE.BoxGeometry(8, 25, 8);
    const pillarMat = new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.8, roughness: 0.2 });

    const pillarL = new THREE.Mesh(pillarGeo, pillarMat);
    pillarL.position.set(-18, 12.5, 0);
    pillarL.castShadow = true;

    const pillarR = new THREE.Mesh(pillarGeo, pillarMat);
    pillarR.position.set(18, 12.5, 0);
    pillarR.castShadow = true;

    // Overhead Arch Span
    const archGeo = new THREE.BoxGeometry(44, 6, 10);
    const archMat = new THREE.MeshStandardMaterial({ color: '#0284c7', metalness: 0.6, roughness: 0.3 });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 24, 0);
    arch.castShadow = true;

    // Solar Canopy Top
    const solarGeo = new THREE.BoxGeometry(42, 0.5, 9);
    const solarTex = createSolarPanelTexture();
    const solarMat = new THREE.MeshStandardMaterial({ map: solarTex, roughness: 0.2 });
    const solarPanel = new THREE.Mesh(solarGeo, solarMat);
    solarPanel.position.set(0, 27.3, 0);

    // Text Sign Board
    const signGeo = new THREE.PlaneGeometry(36, 6);
    
    // Create canvas texture for INFINITY CITY
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 170;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1024, 170);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 1014, 160);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 90px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#0ea5e9';
    ctx.shadowBlur = 20;
    ctx.fillText('INFINITY CITY', 512, 85);
    
    const signTex = new THREE.CanvasTexture(canvas);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex });
    
    // Front sign
    const signFront = new THREE.Mesh(signGeo, signMat);
    signFront.position.set(0, 24, 5.1);
    
    // Back sign
    const signBack = new THREE.Mesh(signGeo, signMat);
    signBack.position.set(0, 24, -5.1);
    signBack.rotation.y = Math.PI;

    gateGroup.add(pillarL, pillarR, arch, solarPanel, signFront, signBack);
    this.scene.add(gateGroup);
  }
"""
content = re.sub(r"\s*// Outer Gate Entrance Monuments at 4 Sides.*?this\.scene\.add\(gateGroup\);\n\s*\}", new_gate.strip(), content, flags=re.DOTALL)


# 2. Update Lights spacing logic
new_lights = """
    ROAD_NETWORKS.forEach((road) => {
      const [x1, z1] = road.start;
      const [x2, z2] = road.end;
      const length = Math.hypot(x2 - x1, z2 - z1);
      const steps = Math.max(3, Math.floor(length / 20)); // Place a light every 20m
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const px = x1 + (x2 - x1) * t;
        const pz = z1 + (z2 - z1) * t;

        const pole1 = new THREE.Group();
        pole1.position.set(px + (road.type === 'ring' ? 0 : 8), 0, pz + (road.type === 'ring' ? 8 : 0));
        
        const pole2 = new THREE.Group();
        pole2.position.set(px - (road.type === 'ring' ? 0 : 8), 0, pz - (road.type === 'ring' ? 8 : 0));
        pole2.rotation.y = Math.PI;

        [pole1, pole2].forEach(pole => {
            const pMesh = new THREE.Mesh(lightGeo, lightMat);
            pMesh.position.y = 2.5;
            pMesh.castShadow = true;
            
            const cap = new THREE.Mesh(solarCapGeo, solarCapMat);
            cap.position.set(0, 5, 0);
            
            const bulb = new THREE.Mesh(bulbGeo, bulbMat);
            bulb.position.set(0.3, 4.8, 0);
            
            pole.add(pMesh, cap, bulb);
            this.scene.add(pole);
        });
      }
    });
"""
content = re.sub(r"ROAD_NETWORKS\.forEach\(\(road\) => \{.*?\pole\.add\(pMesh, cap, bulb\);\n\s*this\.scene\.add\(pole\);\n\s*\}\n\s*\}\);", new_lights.strip(), content, flags=re.DOTALL)


# 3. Update Trees
new_trees = """
  private buildInstancedTrees() {
    const treeCount = 2000;

    // Tree Trunk Geometry
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9 });

    // Tree Canopy Geometry (Lush Indian Neem / Gulmohar Foliage)
    const foliageGeo = new THREE.DodecahedronGeometry(2.5, 1);
    const foliageMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.7 });

    const trunkInst = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);
    const foliageInst = new THREE.InstancedMesh(foliageGeo, foliageMat, treeCount);

    const dummy = new THREE.Object3D();
    let idx = 0;

    // Distribute trees naturally along park, zone buffer gaps, roadsides, and residential zones
    while (idx < treeCount) {
      const x = (Math.random() - 0.5) * 650;
      const z = (Math.random() - 0.5) * 650;

      // Keep trees away from building footprints
      const nearBuilding = BUILDINGS.some(b => Math.hypot(b.x - x, b.z - z) < 22);
      if (nearBuilding) continue;
      
      // Keep trees off the main roads
      const nearRoad = ROAD_NETWORKS.some(r => {
        // basic AABB distance approximation
        const dx = Math.abs(x - (r.start[0] + r.end[0])/2);
        const dz = Math.abs(z - (r.start[1] + r.end[1])/2);
        const isHorizontal = Math.abs(r.start[1] - r.end[1]) < 1;
        if (isHorizontal) {
           return dx < Math.abs(r.start[0] - r.end[0])/2 && dz < 10;
        } else {
           return dz < Math.abs(r.start[1] - r.end[1])/2 && dx < 10;
        }
      });
      if (nearRoad) continue;

      const scale = 0.8 + Math.random() * 0.6;
"""
content = re.sub(r"private buildInstancedTrees\(\) \{.*?const scale = 0\.8 \+ Math\.random\(\) \* 0\.6;", new_trees.strip(), content, flags=re.DOTALL)


with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Updated gate, lights, and trees.")

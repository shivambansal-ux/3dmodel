import re

content = open('src/components/CityBuilder.ts', 'r').read()

roads_and_lights = """
  // 3. Roads, Roundabouts, Flyovers & Underpasses (Zero Traffic Signals)
  private buildRoadsAndJunctions() {
    const roadTex = createRoadTexture();
    const roadMat = new THREE.MeshStandardMaterial({
      map: roadTex,
      roughness: 0.9,
    });
    
    ROAD_NETWORKS.forEach((road) => {
      const [x1, z1] = road.start;
      const [x2, z2] = road.end;
      
      const length = Math.hypot(x2 - x1, z2 - z1);
      const roadGeo = new THREE.PlaneGeometry(road.width, length);
      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      
      roadMesh.rotation.x = -Math.PI / 2;
      
      const angle = Math.atan2(x2 - x1, z2 - z1);
      roadMesh.rotation.z = -angle;
      
      roadMesh.position.set((x1 + x2) / 2, 0.10, (z1 + z2) / 2);
      roadMesh.receiveShadow = true;
      this.scene.add(roadMesh);
    });

    // Grade-Separated Underpass / Flyover Bridges at main 4 intersections
    const intersections = [
      [-70, -70], [70, -70], [-70, 70], [70, 70]
    ];
    
    intersections.forEach(([ix, iz]) => {
       const bridgeGeo = new THREE.BoxGeometry(20, 4, 12);
       const bridgeMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.8 });
       const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
       bridge.position.set(ix, 2, iz);
       
       const rampGeo = new THREE.BoxGeometry(24, 4, 12);
       // Simple ramps
       const ramp1 = new THREE.Mesh(rampGeo, bridgeMat);
       ramp1.position.set(ix - 22, 0, iz);
       ramp1.rotation.z = Math.PI / 16;
       
       const ramp2 = new THREE.Mesh(rampGeo, bridgeMat);
       ramp2.position.set(ix + 22, 0, iz);
       ramp2.rotation.z = -Math.PI / 16;
       
       this.scene.add(bridge, ramp1, ramp2);
    });
  }
  
  private buildSolarStreetLights() {
    const lightGeo = new THREE.CylinderGeometry(0.15, 0.2, 5, 8);
    const lightMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.8 });

    const solarCapGeo = new THREE.BoxGeometry(1.2, 0.1, 0.8);
    const solarCapMat = new THREE.MeshStandardMaterial({ color: '#0369a1', roughness: 0.2 });

    const bulbGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: '#fef08a' });

    ROAD_NETWORKS.forEach((road) => {
      const [x1, z1] = road.start;
      const [x2, z2] = road.end;
      const length = Math.hypot(x2 - x1, z2 - z1);
      const steps = Math.max(3, Math.floor(length / 20)); // Place a light every 20m
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const px = x1 + (x2 - x1) * t;
        const pz = z1 + (z2 - z1) * t;

        const isHorizontal = Math.abs(z1 - z2) < 1;

        const pole1 = new THREE.Group();
        pole1.position.set(px + (isHorizontal ? 0 : 8), 0, pz + (isHorizontal ? 8 : 0));
        
        const pole2 = new THREE.Group();
        pole2.position.set(px - (isHorizontal ? 0 : 8), 0, pz - (isHorizontal ? 8 : 0));
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
  }

  private buildBuildings() {
    const solarTex = createSolarPanelTexture();
    
    BUILDINGS.forEach((bld) => {
      const bldGroup = new THREE.Group();
      bldGroup.position.set(bld.x, 0, bld.z);
      bldGroup.name = `bld_${bld.id}`;
      bldGroup.userData = { buildingData: bld }; // For raycasting

      const glassTex = createGlassFacadeTexture(bld.color);
      glassTex.repeat.set(1, Math.max(1, Math.floor(bld.height / 10)));

      const mainMat = new THREE.MeshStandardMaterial({
        map: glassTex,
        color: bld.color,
        roughness: 0.1,
        metalness: 0.8
      });
      
      const roofMat = new THREE.MeshStandardMaterial({
         color: bld.roofColor,
         roughness: 0.8
      });

      const materials = [
        mainMat, // Right
        mainMat, // Left
        roofMat, // Top
        mainMat, // Bottom
        mainMat, // Front
        mainMat, // Back
      ];

      const geo = new THREE.BoxGeometry(bld.width, bld.height, bld.depth);
      const mesh = new THREE.Mesh(geo, materials);
      mesh.position.y = bld.height / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { buildingData: bld }; 
      
      if (bld.smartFeatures.includes('Solar Roof')) {
         const sGeo = new THREE.PlaneGeometry(bld.width * 0.8, bld.depth * 0.8);
         const sMat = new THREE.MeshStandardMaterial({ map: solarTex, roughness: 0.2 });
         const sMesh = new THREE.Mesh(sGeo, sMat);
         sMesh.rotation.x = -Math.PI / 2;
         sMesh.position.y = bld.height + 0.1;
         bldGroup.add(sMesh);
      }
      
      bldGroup.add(mesh);
      this.scene.add(bldGroup);
      this.buildingMeshMap.set(bld.id, bldGroup);
    });
  }

  private buildEVChargingStations3D() {
    const stationGeo = new THREE.BoxGeometry(4, 3, 2);
    const stationMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.3 }); // Green charging box
    
    EV_CHARGING_STATIONS.forEach(station => {
      const mesh = new THREE.Mesh(stationGeo, stationMat);
      mesh.position.set(station.x, 1.5, station.z);
      mesh.castShadow = true;
      this.scene.add(mesh);
    });
  }
"""

content = re.sub(r"// 3\. Roads, Roundabouts, Flyovers & Underpasses \(Zero Traffic Signals\).*?private buildInstancedTrees\(\) \{", roads_and_lights.strip() + "\n\n  private buildInstancedTrees() {", content, flags=re.DOTALL)

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Restored lost methods")

import * as THREE from 'three';
import { ZONES, BUILDINGS, ROAD_NETWORKS, UNDERGROUND_UTILITIES, EV_CHARGING_STATIONS, ROUNDABOUT_JUNCTIONS, INITIAL_AV_FLEET, BUS_STATIONS } from '../data/cityData';
import { 
  createRoadTexture, 
  createSolarPanelTexture, 
  createGrassTexture, 
  createGlassFacadeTexture, 
  createSidewalkTexture 
} from '../utils/textureGenerator';
import { BuildingData, Vehicle, BusStation } from '../types';

export class CityBuilder {
  private scene: THREE.Scene;
  private buildingMeshMap: Map<string, THREE.Group> = new Map();
  private vehicleGroup: THREE.Group = new THREE.Group();
  private undergroundGroup: THREE.Group = new THREE.Group();
  private groundMesh!: THREE.Mesh;
  private roadMeshGroup: THREE.Group = new THREE.Group();
  private treeInstances!: THREE.InstancedMesh;
  private solarLightGroup: THREE.Group = new THREE.Group();
  private busStationGroup: THREE.Group = new THREE.Group();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public buildEntireCity(): { buildingMap: Map<string, THREE.Group>; vehicles: Vehicle[] } {
    this.buildTerrainAndGround();
    this.buildZoneBufferBelts();
    this.buildRoadsAndJunctions();
    this.buildCentralPark();
    this.buildGreenRecreationZone();
    // this.buildSportsFacilitiesAndAmenities();
    this.buildEVChargingStations3D();
    this.buildBusStations();
    this.buildBuildings();
    this.buildSolarStreetLights();
    this.buildInstancedTrees();
    const vehicles = this.buildVehicles();
    this.buildUndergroundInfrastructure();

    return { buildingMap: this.buildingMeshMap, vehicles };
  }

  // 1b. Sports Grounds, Football Stadium Pitch, Tennis Courts, Parking Lots & Amenities
  private buildSportsFacilitiesAndAmenities() {
    const amenitiesGroup = new THREE.Group();

    // OLYMPIC FOOTBALL STADIUM PITCH (in Education Zone)
    const pitchGeo = new THREE.PlaneGeometry(64, 42);
    const pitchMat = new THREE.MeshStandardMaterial({
      color: '#15803d',
      roughness: 0.7,
    });
    const pitchMesh = new THREE.Mesh(pitchGeo, pitchMat);
    pitchMesh.rotation.x = -Math.PI / 2;
    pitchMesh.position.set(150, 0.15, -60);

    // Pitch White Lines Border
    const lineBorderGeo = new THREE.RingGeometry(0, 0.5, 4);
    const lineMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });

    // Center Circle
    const centerCircleGeo = new THREE.RingGeometry(6, 6.4, 32);
    const centerCircle = new THREE.Mesh(centerCircleGeo, lineMat);
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.set(150, 0.16, -60);

    // Pitch Outer Boundary Line
    const boundaryGeo = new THREE.BoxGeometry(64, 0.1, 42);
    const boundaryEdges = new THREE.EdgesGeometry(boundaryGeo);
    const boundaryLine = new THREE.LineSegments(boundaryEdges, new THREE.LineBasicMaterial({ color: '#ffffff', linewidth: 2 }));
    boundaryLine.position.set(150, 0.17, -60);
    boundaryLine.rotation.x = Math.PI / 2;

    // Stadium Seating Stands around pitch
    const standGeo = new THREE.BoxGeometry(70, 8, 10);
    const standMat = new THREE.MeshStandardMaterial({ color: '#7c3aed', roughness: 0.4 });
    const standNorth = new THREE.Mesh(standGeo, standMat);
    standNorth.position.set(150, 4, -85);

    const standSouth = new THREE.Mesh(standGeo, standMat);
    standSouth.position.set(0, 4, 145);

    amenitiesGroup.add(pitchMesh, centerCircle, boundaryLine, standNorth, standSouth);

    // TENNIS & BASKETBALL HARDCOURTS (Education & Residential)
    const courtGeo = new THREE.PlaneGeometry(28, 16);
    const courtMat = new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.3 });
    const court1 = new THREE.Mesh(courtGeo, courtMat);
    court1.rotation.x = -Math.PI / 2;
    court1.position.set(-30, 0.15, 120);

    const court2 = new THREE.Mesh(courtGeo, new THREE.MeshStandardMaterial({ color: '#ea580c', roughness: 0.3 }));
    court2.rotation.x = -Math.PI / 2;
    court2.position.set(30, 0.15, 120);

    amenitiesGroup.add(court1, court2);

    // COMMUNITY RESIDENTIAL SWIMMING POOL (Residential Zone near Clubhouse)
    const poolGeo = new THREE.BoxGeometry(22, 1.5, 14);
    const poolWaterMat = new THREE.MeshStandardMaterial({
      color: '#06b6d4',
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });
    const poolMesh = new THREE.Mesh(poolGeo, poolWaterMat);
    poolMesh.position.set(0, 0.2, 110);

    // Pool Deck Border
    const poolDeckGeo = new THREE.BoxGeometry(26, 0.2, 18);
    const poolDeckMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.5 });
    const poolDeck = new THREE.Mesh(poolDeckGeo, poolDeckMat);
    poolDeck.position.set(0, 0.1, 110);

    amenitiesGroup.add(poolMesh, poolDeck);

    // PARKING LOT & EV CHARGING PLAZA (Commercial & Public Services)
    const lotGeo = new THREE.PlaneGeometry(40, 24);
    const lotMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.6 });
    const lotMesh = new THREE.Mesh(lotGeo, lotMat);
    lotMesh.rotation.x = -Math.PI / 2;
    lotMesh.position.set(0, 0.14, 70);

    // Parking Bay Lines
    for (let i = -16; i <= 16; i += 4) {
      const lineGeo = new THREE.PlaneGeometry(0.3, 8);
      const bayLine = new THREE.Mesh(lineGeo, lineMat);
      bayLine.rotation.x = -Math.PI / 2;
      bayLine.position.set(i, 0.15, 66);
      amenitiesGroup.add(bayLine);

      const bayLine2 = new THREE.Mesh(lineGeo, lineMat);
      bayLine2.rotation.x = -Math.PI / 2;
      bayLine2.position.set(i, 0.15, 74);
      amenitiesGroup.add(bayLine2);
    }

    amenitiesGroup.add(lotMesh);
    this.scene.add(amenitiesGroup);
  }

  // 1. Terrain, Ground & Outer Boundary
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

    // 300-Acre Master Township Base Boundary (Square 400m x 400m)
    const townshipGeo = new THREE.PlaneGeometry(400, 400);
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
    this.scene.add(townshipMesh);// Outer Gate Entrance Monuments at 4 Sides
    this.buildEntranceGate(0, -280, 0, 'NORTH GATEWAY');
    this.buildEntranceGate(0, 280, Math.PI, 'SOUTH GATEWAY');
    this.buildEntranceGate(280, 0, Math.PI / 2, 'EAST GATEWAY');
    this.buildEntranceGate(-280, 0, -Math.PI / 2, 'WEST GATEWAY');
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
    
    // Create canvas texture for RAGA INFRA
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
    ctx.fillText('RAGA INFRA', 512, 85);
    
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

  // 2. Zone Buffer Belts (Green Gap corridors between zones)
  private buildZoneBufferBelts() {
    const bufferGroup = new THREE.Group();

    // Cross Buffer Corridors (N-S and E-W green buffer belts, 16m wide)
    const matBuffer = new THREE.MeshStandardMaterial({
      color: '#16a34a',
      roughness: 0.7,
    });

    // N-S Buffer Belts (at x = -70, 70)
    const nsBuffer1 = new THREE.Mesh(new THREE.PlaneGeometry(16, 420), matBuffer);
    nsBuffer1.rotation.x = -Math.PI / 2;
    nsBuffer1.position.set(-70, 0.08, 0);

    const nsBuffer2 = new THREE.Mesh(new THREE.PlaneGeometry(16, 420), matBuffer);
    nsBuffer2.rotation.x = -Math.PI / 2;
    nsBuffer2.position.set(70, 0.08, 0);

    // E-W Buffer Belts (at z = -70, 70)
    const ewBuffer1 = new THREE.Mesh(new THREE.PlaneGeometry(420, 16), matBuffer);
    ewBuffer1.rotation.x = -Math.PI / 2;
    ewBuffer1.position.set(0, 0.08, -70);

    const ewBuffer2 = new THREE.Mesh(new THREE.PlaneGeometry(420, 16), matBuffer);
    ewBuffer2.rotation.x = -Math.PI / 2;
    ewBuffer2.position.set(0, 0.08, 70);

    bufferGroup.add(nsBuffer1, nsBuffer2, ewBuffer1, ewBuffer2);

    this.scene.add(bufferGroup);
  }

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
      const x = (Math.random() - 0.5) * 750;
      const z = (Math.random() - 0.5) * 750;

      // Keep trees away from building footprints
      const nearBuilding = BUILDINGS.some(b => Math.hypot(b.x - x, b.z - z) < 22);
      if (nearBuilding) continue;
      
      // Keep trees off the main roads
      const nearRoad = ROAD_NETWORKS.some(r => {
        const dx = Math.abs(x - (r.start[0] + r.end[0])/2);
        const dz = Math.abs(z - (r.start[1] + r.end[1])/2);
        const isHorizontal = Math.abs(r.start[1] - r.end[1]) < 1;
        if (isHorizontal) {
           return dx < (Math.abs(r.start[0] - r.end[0])/2 + 10) && dz < 12;
        } else {
           return dz < (Math.abs(r.start[1] - r.end[1])/2 + 10) && dx < 12;
        }
      });
      if (nearRoad) continue;

      const scale = 0.8 + Math.random() * 0.6;

      // Trunk matrix
      dummy.position.set(x, 2 * scale, z);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      trunkInst.setMatrixAt(idx, dummy.matrix);

      // Foliage matrix
      dummy.position.set(x, (4 + 1.2) * scale, z);
      dummy.scale.set(scale * 1.2, scale * 1.2, scale * 1.2);
      dummy.updateMatrix();
      foliageInst.setMatrixAt(idx, dummy.matrix);

      idx++;
    }

    trunkInst.instanceMatrix.needsUpdate = true;
    foliageInst.instanceMatrix.needsUpdate = true;
    trunkInst.castShadow = true;
    foliageInst.castShadow = true;

    this.scene.add(trunkInst, foliageInst);
  }

  // 1c. 3D EV Charging Stations & Solar Canopy Pavilions
  private buildEVChargingStations3D() {
    const evGroup = new THREE.Group();

    EV_CHARGING_STATIONS.forEach((station) => {
      const stGroup = new THREE.Group();
      stGroup.position.set(station.x, 0, station.z);

      // Station Ground Pad
      const padGeo = new THREE.BoxGeometry(18, 0.3, 14);
      const padMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.5 });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.y = 0.15;
      pad.receiveShadow = true;

      // Green Charging Bay Lines
      const lineMat = new THREE.MeshBasicMaterial({ color: '#10b981' });
      for (let i = -6; i <= 6; i += 4) {
        const slotGeo = new THREE.PlaneGeometry(3, 5);
        const slotMesh = new THREE.Mesh(slotGeo, lineMat);
        slotMesh.rotation.x = -Math.PI / 2;
        slotMesh.position.set(i, 0.32, 0);
        stGroup.add(slotMesh);
      }

      // Solar Canopy Roof
      const canopyGeo = new THREE.BoxGeometry(20, 0.4, 16);
      const canopyMat = new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.2, metalness: 0.8 });
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.position.set(0, 5.5, 0);
      canopy.castShadow = true;

      // Canopy Support Pillars
      const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 5.2);
      const pillarMat = new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.9 });

      const p1 = new THREE.Mesh(pillarGeo, pillarMat); p1.position.set(-8, 2.7, -6);
      const p2 = new THREE.Mesh(pillarGeo, pillarMat); p2.position.set(8, 2.7, -6);
      const p3 = new THREE.Mesh(pillarGeo, pillarMat); p3.position.set(-8, 2.7, 6);
      const p4 = new THREE.Mesh(pillarGeo, pillarMat); p4.position.set(8, 2.7, 6);

      // Green Glowing Charging Pillars
      const chargerGeo = new THREE.BoxGeometry(0.8, 2.2, 0.8);
      const chargerMat = new THREE.MeshStandardMaterial({ color: '#10b981', emissive: '#059669', emissiveIntensity: 0.8 });

      for (let i = -6; i <= 6; i += 4) {
        const charger = new THREE.Mesh(chargerGeo, chargerMat);
        charger.position.set(i, 1.4, -5);
        stGroup.add(charger);
      }

      stGroup.add(pad, canopy, p1, p2, p3, p4);
      evGroup.add(stGroup);
    });

    this.scene.add(evGroup);
  }

  // ========== BUS STATIONS (3D Glass Shelters per Zone) ==========
  private buildBusStations() {
    BUS_STATIONS.forEach((station) => {
      const stGroup = new THREE.Group();
      stGroup.name = `bus_station_${station.id}`;
      stGroup.position.set(station.x, 0, station.z);

      // Determine orientation: vertical road => shelter faces X, horizontal road => shelter faces Z
      const road = ROAD_NETWORKS.find(r => r.id === station.connectedRoadId);
      const isVerticalRoad = road ? Math.abs(road.start[0] - road.end[0]) < 1 : false;
      if (isVerticalRoad) stGroup.rotation.y = Math.PI / 2;

      // --- Platform Base ---
      const platformGeo = new THREE.BoxGeometry(12, 0.3, 5);
      const platformMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4 });
      const platform = new THREE.Mesh(platformGeo, platformMat);
      platform.position.y = 0.15;
      platform.receiveShadow = true;

      // --- Yellow Curb Edge ---
      const curbGeo = new THREE.BoxGeometry(12, 0.35, 0.3);
      const curbMat = new THREE.MeshStandardMaterial({ color: '#fbbf24' });
      const curb = new THREE.Mesh(curbGeo, curbMat);
      curb.position.set(0, 0.17, 2.6);

      // --- Glass Shelter Canopy Roof ---
      const canopyGeo = new THREE.BoxGeometry(10, 0.15, 4);
      const canopyMat = new THREE.MeshStandardMaterial({
        color: station.color,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.7,
      });
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.position.set(0, 3.8, 0);
      canopy.castShadow = true;

      // --- Glass Back Panel ---
      const backPanelGeo = new THREE.BoxGeometry(10, 3.5, 0.1);
      const glassMat = new THREE.MeshStandardMaterial({
        color: '#e0f2fe',
        roughness: 0.05,
        metalness: 0.3,
        transparent: true,
        opacity: 0.4,
      });
      const backPanel = new THREE.Mesh(backPanelGeo, glassMat);
      backPanel.position.set(0, 2.05, -1.9);

      // --- Glass Side Panels ---
      const sidePanelGeo = new THREE.BoxGeometry(0.1, 3.5, 3.8);
      const sideL = new THREE.Mesh(sidePanelGeo, glassMat);
      sideL.position.set(-4.95, 2.05, 0);
      const sideR = new THREE.Mesh(sidePanelGeo, glassMat);
      sideR.position.set(4.95, 2.05, 0);

      // --- Support Pillars (4 corners) ---
      const pillarGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.8, 8);
      const pillarMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.9, roughness: 0.2 });
      const positions = [[-4.8, -1.8], [4.8, -1.8], [-4.8, 1.8], [4.8, 1.8]];
      positions.forEach(([px, pz]) => {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(px, 1.9, pz);
        stGroup.add(pillar);
      });

      // --- Bench Seats (2 benches inside shelter) ---
      const benchGeo = new THREE.BoxGeometry(3.5, 0.2, 0.8);
      const benchMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.6 });
      const bench1 = new THREE.Mesh(benchGeo, benchMat);
      bench1.position.set(-2.2, 0.8, -1.2);
      const bench2 = new THREE.Mesh(benchGeo, benchMat);
      bench2.position.set(2.2, 0.8, -1.2);

      // --- Bench Legs ---
      const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 6);
      const legMat = new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.8 });
      [bench1, bench2].forEach(bench => {
        const bx = bench.position.x;
        [[-1.4, -1.2], [1.4, -1.2]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(bx + lx, 0.45, lz);
          stGroup.add(leg);
        });
      });

      // --- Route Sign Board ---
      const signCanvas = document.createElement('canvas');
      signCanvas.width = 512;
      signCanvas.height = 128;
      const ctx = signCanvas.getContext('2d')!;
      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 128);
      // Accent bar
      ctx.fillStyle = station.color;
      ctx.fillRect(0, 0, 512, 8);
      ctx.fillRect(0, 120, 512, 8);
      // Station name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(station.name, 256, 42);
      // Route
      ctx.fillStyle = station.color;
      ctx.font = '20px sans-serif';
      ctx.fillText(station.routeName, 256, 82);

      const signTex = new THREE.CanvasTexture(signCanvas);
      const signGeo = new THREE.PlaneGeometry(5, 1.2);
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const signFront = new THREE.Mesh(signGeo, signMat);
      signFront.position.set(0, 4.5, 0.1);
      const signBack = new THREE.Mesh(signGeo, signMat);
      signBack.position.set(0, 4.5, -0.1);
      signBack.rotation.y = Math.PI;

      // --- Bus Stop Pole with Icon ---
      const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 5, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: station.color, metalness: 0.7 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(5.5, 2.5, 2.2);

      // Bus icon sign on top of pole
      const iconCanvas = document.createElement('canvas');
      iconCanvas.width = 128;
      iconCanvas.height = 128;
      const ictx = iconCanvas.getContext('2d')!;
      ictx.fillStyle = station.color;
      ictx.beginPath();
      ictx.roundRect(8, 8, 112, 112, 16);
      ictx.fill();
      ictx.fillStyle = '#ffffff';
      ictx.font = 'bold 56px sans-serif';
      ictx.textAlign = 'center';
      ictx.textBaseline = 'middle';
      ictx.fillText('BUS', 64, 64);

      const iconTex = new THREE.CanvasTexture(iconCanvas);
      const iconGeo = new THREE.PlaneGeometry(1.2, 1.2);
      const iconMat = new THREE.MeshBasicMaterial({ map: iconTex });
      const icon1 = new THREE.Mesh(iconGeo, iconMat);
      icon1.position.set(5.5, 5.2, 2.3);
      const icon2 = new THREE.Mesh(iconGeo, iconMat);
      icon2.position.set(5.5, 5.2, 2.1);
      icon2.rotation.y = Math.PI;

      // --- Glowing Ground Strip (bus bay marking) ---
      const stripGeo = new THREE.PlaneGeometry(12, 0.4);
      const stripMat = new THREE.MeshBasicMaterial({ color: station.color });
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.rotation.x = -Math.PI / 2;
      strip.position.set(0, 0.32, 2.8);

      stGroup.add(
        platform, curb, canopy, backPanel, sideL, sideR,
        bench1, bench2, signFront, signBack,
        pole, icon1, icon2, strip
      );
      this.busStationGroup.add(stGroup);
    });

    this.scene.add(this.busStationGroup);
  }

  // ========== VEHICLES (Enhanced 3D Cars, Buses, Pods, Ambulance) ==========
  private buildVehicles(): Vehicle[] {
    const vehicles: Vehicle[] = [...INITIAL_AV_FLEET];

    vehicles.forEach((v) => {
      const vGroup = new THREE.Group();
      vGroup.name = `vehicle_${v.id}`;

      if (v.type === 'ev_car') {
        this.buildCarMesh(vGroup, v);
      } else if (v.type === 'ev_bus') {
        this.buildBusMesh(vGroup, v);
      } else if (v.type === 'ambulance') {
        this.buildAmbulanceMesh(vGroup, v);
      } else {
        // ev_pod, ev_shuttle — default pod style
        this.buildPodMesh(vGroup, v);
      }

      // Green Charging Pulse Beam (visible when charging)
      const beamGeo = new THREE.CylinderGeometry(0.1, 0.8, 6, 16);
      const beamMat = new THREE.MeshBasicMaterial({ color: '#10b981', transparent: true, opacity: 0.7 });
      const chargingBeam = new THREE.Mesh(beamGeo, beamMat);
      chargingBeam.name = 'charging_beam';
      chargingBeam.position.y = 3.5;
      chargingBeam.visible = false;
      vGroup.add(chargingBeam);

      this.vehicleGroup.add(vGroup);
    });

    this.scene.add(this.vehicleGroup);
    return vehicles;
  }

  // --- Car Model ---
  private buildCarMesh(group: THREE.Group, v: Vehicle) {
    const bodyMat = new THREE.MeshStandardMaterial({ color: v.color, roughness: 0.15, metalness: 0.85 });

    // Lower body
    const bodyGeo = new THREE.BoxGeometry(2.0, 0.8, 4.2);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.8;
    body.castShadow = true;

    // Cabin (slightly narrower, on top)
    const cabinGeo = new THREE.BoxGeometry(1.8, 0.7, 2.4);
    const cabinMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.6 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 1.55, -0.3);
    cabin.castShadow = true;

    // Wheels (4)
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.15, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: '#1e1e1e', roughness: 0.9 });
    const wheelPositions: [number, number, number][] = [
      [-1.0, 0.3, 1.4], [1.0, 0.3, 1.4],
      [-1.0, 0.3, -1.4], [1.0, 0.3, -1.4]
    ];
    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      wheel.name = 'wheel';
      group.add(wheel);
    });

    // Headlights
    const hlGeo = new THREE.BoxGeometry(0.35, 0.15, 0.08);
    const hlMat = new THREE.MeshBasicMaterial({ color: '#fef9c3' });
    const hl1 = new THREE.Mesh(hlGeo, hlMat);
    hl1.position.set(-0.7, 0.85, 2.14);
    const hl2 = new THREE.Mesh(hlGeo, hlMat);
    hl2.position.set(0.7, 0.85, 2.14);

    // Brake lights
    const blMat = new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.2 });
    const bl1 = new THREE.Mesh(hlGeo, blMat);
    bl1.name = 'brake_light';
    bl1.position.set(-0.7, 0.85, -2.14);
    const bl2 = new THREE.Mesh(hlGeo, blMat);
    bl2.name = 'brake_light';
    bl2.position.set(0.7, 0.85, -2.14);

    // LiDAR dome
    const lidarGeo = new THREE.CylinderGeometry(0.2, 0.28, 0.2, 12);
    const lidarMat = new THREE.MeshStandardMaterial({ color: '#0284c7', emissive: '#38bdf8', emissiveIntensity: 0.8, metalness: 0.9 });
    const lidar = new THREE.Mesh(lidarGeo, lidarMat);
    lidar.name = 'lidar_pod';
    lidar.position.set(0, 2.0, -0.3);

    // Roof glow strip
    const glowGeo = new THREE.BoxGeometry(1.2, 0.06, 1.8);
    const glowMat = new THREE.MeshBasicMaterial({ color: '#38bdf8' });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.y = 1.92;

    group.add(body, cabin, hl1, hl2, bl1, bl2, lidar, glow);
  }

  // --- Bus Model ---
  private buildBusMesh(group: THREE.Group, v: Vehicle) {
    const bodyMat = new THREE.MeshStandardMaterial({ color: v.color, roughness: 0.2, metalness: 0.7 });

    // Main body
    const bodyGeo = new THREE.BoxGeometry(3.0, 2.8, 10.0);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.8;
    body.castShadow = true;

    // Window strip (both sides)
    const winGeo = new THREE.BoxGeometry(0.05, 1.0, 8.0);
    const winMat = new THREE.MeshStandardMaterial({ color: '#bfdbfe', roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.5 });
    const winL = new THREE.Mesh(winGeo, winMat);
    winL.position.set(-1.53, 2.3, 0);
    const winR = new THREE.Mesh(winGeo, winMat);
    winR.position.set(1.53, 2.3, 0);

    // Windshield (front)
    const wsGeo = new THREE.BoxGeometry(2.6, 1.4, 0.08);
    const wsMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.5 });
    const ws = new THREE.Mesh(wsGeo, wsMat);
    ws.position.set(0, 2.3, 5.04);

    // Wheels (6 — dual rear axle)
    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.2, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: '#1e1e1e', roughness: 0.9 });
    const busWheelPos: [number, number, number][] = [
      [-1.5, 0.45, 3.8], [1.5, 0.45, 3.8],
      [-1.5, 0.45, -2.5], [1.5, 0.45, -2.5],
      [-1.5, 0.45, -3.8], [1.5, 0.45, -3.8]
    ];
    busWheelPos.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      wheel.name = 'wheel';
      group.add(wheel);
    });

    // Destination sign board (front top)
    const destCanvas = document.createElement('canvas');
    destCanvas.width = 256;
    destCanvas.height = 64;
    const dctx = destCanvas.getContext('2d')!;
    dctx.fillStyle = '#000000';
    dctx.fillRect(0, 0, 256, 64);
    dctx.fillStyle = '#fbbf24';
    dctx.font = 'bold 28px sans-serif';
    dctx.textAlign = 'center';
    dctx.textBaseline = 'middle';
    dctx.fillText(v.name.replace('Route ', ''), 128, 32);
    const destTex = new THREE.CanvasTexture(destCanvas);
    const destGeo = new THREE.PlaneGeometry(2.4, 0.6);
    const destMat = new THREE.MeshBasicMaterial({ map: destTex });
    const destSign = new THREE.Mesh(destGeo, destMat);
    destSign.position.set(0, 3.0, 5.05);

    // Headlights
    const hlGeo = new THREE.BoxGeometry(0.5, 0.25, 0.1);
    const hlMat = new THREE.MeshBasicMaterial({ color: '#fef9c3' });
    const hl1 = new THREE.Mesh(hlGeo, hlMat);
    hl1.position.set(-1.1, 1.2, 5.05);
    const hl2 = new THREE.Mesh(hlGeo, hlMat);
    hl2.position.set(1.1, 1.2, 5.05);

    // Brake lights
    const blMat = new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.2 });
    const bl1 = new THREE.Mesh(hlGeo, blMat);
    bl1.name = 'brake_light';
    bl1.position.set(-1.1, 1.2, -5.05);
    const bl2 = new THREE.Mesh(hlGeo, blMat);
    bl2.name = 'brake_light';
    bl2.position.set(1.1, 1.2, -5.05);

    // Door indicators (colored strips on sides)
    const doorGeo = new THREE.BoxGeometry(0.06, 2.0, 1.0);
    const doorMat = new THREE.MeshBasicMaterial({ color: '#fbbf24' });
    const doorL = new THREE.Mesh(doorGeo, doorMat);
    doorL.position.set(-1.54, 1.4, 2.5);
    const doorR = new THREE.Mesh(doorGeo, doorMat);
    doorR.position.set(1.54, 1.4, 2.5);

    // LiDAR dome
    const lidarGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.3, 16);
    const lidarMat = new THREE.MeshStandardMaterial({ color: '#0284c7', emissive: '#38bdf8', emissiveIntensity: 0.9, metalness: 0.9 });
    const lidar = new THREE.Mesh(lidarGeo, lidarMat);
    lidar.name = 'lidar_pod';
    lidar.position.set(0, 3.4, 0);

    // Roof glow strip
    const glowGeo = new THREE.BoxGeometry(2.4, 0.08, 8.0);
    const glowMat = new THREE.MeshBasicMaterial({ color: '#38bdf8' });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.y = 3.25;

    group.add(body, winL, winR, ws, destSign, hl1, hl2, bl1, bl2, doorL, doorR, lidar, glow);
  }

  // --- Ambulance Model ---
  private buildAmbulanceMesh(group: THREE.Group, v: Vehicle) {
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.2, metalness: 0.7 });

    // Body
    const bodyGeo = new THREE.BoxGeometry(2.4, 2.0, 5.5);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.4;
    body.castShadow = true;

    // Red cross stripe
    const stripeGeo = new THREE.BoxGeometry(2.42, 0.5, 0.08);
    const stripeMat = new THREE.MeshBasicMaterial({ color: '#ef4444' });
    const stripe1 = new THREE.Mesh(stripeGeo, stripeMat);
    stripe1.position.set(0, 1.4, 2.78);
    const stripe2 = new THREE.Mesh(stripeGeo, stripeMat);
    stripe2.position.set(0, 1.4, -2.78);

    // Cabin glass
    const cabGeo = new THREE.BoxGeometry(2.2, 1.0, 2.0);
    const cabMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.05, transparent: true, opacity: 0.5 });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 2.1, 1.5);

    // Emergency lights (rotating red/blue bar)
    const lightBarGeo = new THREE.BoxGeometry(1.6, 0.25, 0.4);
    const lightBarMat = new THREE.MeshBasicMaterial({ color: '#ef4444' });
    const lightBar = new THREE.Mesh(lightBarGeo, lightBarMat);
    lightBar.name = 'emergency_light';
    lightBar.position.set(0, 2.55, 1.5);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.18, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: '#1e1e1e', roughness: 0.9 });
    const aWheelPos: [number, number, number][] = [
      [-1.2, 0.35, 1.8], [1.2, 0.35, 1.8],
      [-1.2, 0.35, -1.8], [1.2, 0.35, -1.8]
    ];
    aWheelPos.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      wheel.name = 'wheel';
      group.add(wheel);
    });

    // Brake lights
    const blGeo = new THREE.BoxGeometry(0.4, 0.2, 0.08);
    const blMat = new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.2 });
    const bl1 = new THREE.Mesh(blGeo, blMat);
    bl1.name = 'brake_light';
    bl1.position.set(-0.8, 1.0, -2.78);
    const bl2 = new THREE.Mesh(blGeo, blMat);
    bl2.name = 'brake_light';
    bl2.position.set(0.8, 1.0, -2.78);

    // LiDAR
    const lidarGeo = new THREE.CylinderGeometry(0.25, 0.35, 0.25, 12);
    const lidarMat = new THREE.MeshStandardMaterial({ color: '#0284c7', emissive: '#38bdf8', emissiveIntensity: 0.9, metalness: 0.9 });
    const lidar = new THREE.Mesh(lidarGeo, lidarMat);
    lidar.name = 'lidar_pod';
    lidar.position.set(0, 2.75, -0.5);

    group.add(body, stripe1, stripe2, cab, lightBar, bl1, bl2, lidar);
  }

  // --- Pod/Shuttle Model ---
  private buildPodMesh(group: THREE.Group, v: Vehicle) {
    const mat = new THREE.MeshStandardMaterial({ color: v.color, roughness: 0.2, metalness: 0.8 });
    const chassisGeo = new THREE.BoxGeometry(2.0, 1.6, 3.8);
    const chassis = new THREE.Mesh(chassisGeo, mat);
    chassis.position.y = 1.2;
    chassis.castShadow = true;

    // Glass dome
    const domeGeo = new THREE.SphereGeometry(0.9, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({ color: '#e0f2fe', transparent: true, opacity: 0.4, metalness: 0.2 });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 2.0, 0);

    // LiDAR
    const lidarGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.3, 16);
    const lidarMat = new THREE.MeshStandardMaterial({ color: '#0284c7', emissive: '#38bdf8', emissiveIntensity: 0.9, metalness: 0.9 });
    const lidar = new THREE.Mesh(lidarGeo, lidarMat);
    lidar.name = 'lidar_pod';
    lidar.position.set(0, 2.3, 0);

    // Headlights
    const hlGeo = new THREE.BoxGeometry(0.4, 0.15, 0.08);
    const hlMat = new THREE.MeshBasicMaterial({ color: '#fef9c3' });
    const hl1 = new THREE.Mesh(hlGeo, hlMat);
    hl1.position.set(-0.6, 1.2, 1.94);
    const hl2 = new THREE.Mesh(hlGeo, hlMat);
    hl2.position.set(0.6, 1.2, 1.94);

    // Brake lights
    const blMat2 = new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.2 });
    const bl1 = new THREE.Mesh(hlGeo, blMat2);
    bl1.name = 'brake_light';
    bl1.position.set(-0.6, 1.2, -1.94);
    const bl2 = new THREE.Mesh(hlGeo, blMat2);
    bl2.name = 'brake_light';
    bl2.position.set(0.6, 1.2, -1.94);

    // EV glow strip
    const glowGeo = new THREE.BoxGeometry(1.4, 0.08, 2.6);
    const glowMat = new THREE.MeshBasicMaterial({ color: '#38bdf8' });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.y = 2.05;

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.12, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: '#1e1e1e', roughness: 0.9 });
    const podWheelPos: [number, number, number][] = [
      [-1.0, 0.25, 1.2], [1.0, 0.25, 1.2],
      [-1.0, 0.25, -1.2], [1.0, 0.25, -1.2]
    ];
    podWheelPos.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      wheel.name = 'wheel';
      group.add(wheel);
    });

    group.add(chassis, dome, lidar, hl1, hl2, bl1, bl2, glow);
  }

  // 8. Underground Utility Infrastructure (Infrastructure Cutaway Mode)
  private buildUndergroundInfrastructure() {
    UNDERGROUND_UTILITIES.forEach((utility) => {
      const points = utility.points.map(p => new THREE.Vector3(p[0], utility.depth, p[2]));
      const curve = new THREE.CatmullRomCurve3(points, true);

      const tubeGeo = new THREE.TubeGeometry(curve, 100, utility.radius, 12, true);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: utility.color,
        roughness: 0.2,
        metalness: 0.8,
        emissive: utility.color,
        emissiveIntensity: 0.4,
      });

      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      tubeMesh.name = `pipe_${utility.id}`;
      this.undergroundGroup.add(tubeMesh);
    });

    this.undergroundGroup.visible = false; // hidden in normal view
    this.scene.add(this.undergroundGroup);
  }

  // Set Infrastructure Cutaway Mode Visibility
  public setInfrastructureView(active: boolean) {
    this.undergroundGroup.visible = active;

    // Make ground semi-transparent wireframe when infrastructure view is active
    if (this.groundMesh) {
      const mat = this.groundMesh.material as THREE.MeshStandardMaterial;
      if (active) {
        mat.transparent = true;
        mat.opacity = 0.35;
        mat.wireframe = true;
      } else {
        mat.transparent = false;
        mat.opacity = 1.0;
        mat.wireframe = false;
      }
    }
  }

  // Update vehicle positions, roundabout detection, and EV charging simulation
  public updateVehicles(vehicles: Vehicle[], speedMultiplier: number = 1.0) {
    vehicles.forEach((v) => {
      const vMesh = this.vehicleGroup.getObjectByName(`vehicle_${v.id}`);
      if (!vMesh) return;

      const lidarMesh = vMesh.getObjectByName('lidar_pod');
      if (lidarMesh) {
        lidarMesh.rotation.y += 0.15; // spin roof LiDAR pod
      }

      const chargingBeamMesh = vMesh.getObjectByName('charging_beam');

      // CHARGING STATE SIMULATION
      if (v.status === 'CHARGING') {
        const station = EV_CHARGING_STATIONS.find(s => s.id === v.targetChargingStationId) || EV_CHARGING_STATIONS[0];
        vMesh.position.set(station.x, 0, station.z);
        if (chargingBeamMesh) chargingBeamMesh.visible = true;

        v.batteryLevel = Math.min(100, v.batteryLevel + 0.18 * speedMultiplier);
        v.currentLocationName = `Charging at ${station.name} (${Math.round(v.batteryLevel)}%)`;

        if (v.batteryLevel >= 100) {
          v.status = 'DISEMBARKING';
          if (chargingBeamMesh) chargingBeamMesh.visible = false;
        }
        return;
      }

      if (v.status === 'DISEMBARKING') {
        v.status = 'CRUISING';
        if (chargingBeamMesh) chargingBeamMesh.visible = false;
      }

      // ROAD NAVIGATION & PROGRESS
      const road = ROAD_NETWORKS.find(r => r.id === v.roadId);
      if (!road) return;

      v.progress += v.speed * v.direction * speedMultiplier;
      if (v.progress > 1) v.progress = 0;
      if (v.progress < 0) v.progress = 1;

      const [x1, z1] = road.start;
      const [x2, z2] = road.end;

      const dx = x2 - x1;
      const dz = z2 - z1;
      const len = Math.hypot(dx, dz) || 1;

      // Perpendicular offset for driving on right side of road
      const perpX = (-dz / len) * (v.laneOffset || 1.8);
      const perpZ = (dx / len) * (v.laneOffset || 1.8);

      const curX = x1 + dx * v.progress + perpX;
      const curZ = z1 + dz * v.progress + perpZ;

      vMesh.position.set(curX, 0, curZ);

      // Facing orientation along road direction
      const angle = Math.atan2(dx * v.direction, dz * v.direction);
      vMesh.rotation.y = angle;

      // ROUNDABOUT / INTERSECTION DETECTION & SPEED ADJUSTMENT
      let nearRoundabout = false;
      let nearestRoundaboutName = '';

      for (const rb of ROUNDABOUT_JUNCTIONS) {
        const dist = Math.hypot(curX - rb.x, curZ - rb.z);
        if (dist < rb.radius + 10) {
          nearRoundabout = true;
          nearestRoundaboutName = rb.name;
          break;
        }
      }

      // Brake lights mesh
      const brakeLights: THREE.Mesh[] = [];
      vMesh.traverse((child) => {
        if (child.name === 'brake_light' && child instanceof THREE.Mesh) {
          brakeLights.push(child);
        }
      });

      if (nearRoundabout) {
        v.status = 'ROUNDABOUT_APPROACH';
        v.speed = v.baseSpeed * 0.35; // Slow down at roundabout
        v.brakeLightOn = true;
        v.currentLocationName = `Slowing at ${nearestRoundaboutName}`;

        brakeLights.forEach((bl) => {
          const mat = bl.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = 2.8; // Bright brake light glow
        });
      } else {
        v.status = 'CRUISING';
        v.speed = v.baseSpeed;
        v.brakeLightOn = false;
        v.currentLocationName = road.name;

        brakeLights.forEach((bl) => {
          const mat = bl.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = 0.2;
        });
      }

      // BATTERY CONSUMPTION & DOCKING AT CHARGING STATIONS
      v.batteryLevel = Math.max(0, v.batteryLevel - 0.008 * speedMultiplier);

      // Auto-dock if battery < 25% or targeted
      if (v.batteryLevel < 25 && !v.targetChargingStationId) {
        const nearestStation = EV_CHARGING_STATIONS[0];
        v.targetChargingStationId = nearestStation.id;
      }

      if (v.targetChargingStationId && v.batteryLevel < 40) {
        const targetStation = EV_CHARGING_STATIONS.find(s => s.id === v.targetChargingStationId);
        if (targetStation) {
          const distToStation = Math.hypot(curX - targetStation.x, curZ - targetStation.z);
          if (distToStation < 22) {
            v.status = 'CHARGING';
          }
        }
      }
    });
  }
  private buildCentralPark() {
    const parkGroup = new THREE.Group();
    parkGroup.position.set(0, 0, 0);

    // Green base for the park (130x130)
    const baseGeo = new THREE.PlaneGeometry(136, 136);
    const baseMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.8 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.y = 0.09;
    parkGroup.add(baseMesh);

    // Concentric Circular Walking Paths
    const pathMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.9 });
    
    [32, 48, 64].forEach(radius => {
      const pathGeo = new THREE.RingGeometry(radius - 1, radius + 1, 64);
      const pathMesh = new THREE.Mesh(pathGeo, pathMat);
      pathMesh.rotation.x = -Math.PI / 2;
      pathMesh.position.y = 0.11;
      parkGroup.add(pathMesh);
    });

    // Central Fountain Lake
    const lakeGeo = new THREE.CircleGeometry(15, 32);
    const lakeMat = new THREE.MeshStandardMaterial({ color: '#0ea5e9', roughness: 0.1, metalness: 0.8 });
    const lakeMesh = new THREE.Mesh(lakeGeo, lakeMat);
    lakeMesh.rotation.x = -Math.PI / 2;
    lakeMesh.position.y = 0.12;
    parkGroup.add(lakeMesh);

    // Fountain Centerpiece
    const fountainGeo = new THREE.CylinderGeometry(0, 2, 6, 16);
    const fountainMat = new THREE.MeshStandardMaterial({ color: '#38bdf8', metalness: 0.5 });
    const fountain = new THREE.Mesh(fountainGeo, fountainMat);
    fountain.position.y = 3.12;
    parkGroup.add(fountain);

    this.scene.add(parkGroup);
  }

  private buildGreenRecreationZone() {
    const parkGroup = new THREE.Group();
    parkGroup.position.set(0, 0, 135);

    // Green base for the park (130x130)
    const baseGeo = new THREE.PlaneGeometry(136, 136);
    const baseMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.8 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.y = 0.09;
    parkGroup.add(baseMesh);

    // Lake (large rounded shape)
    const lakeShape = new THREE.Shape();
    lakeShape.moveTo(0, -30);
    lakeShape.bezierCurveTo(40, -30, 60, -10, 40, 30);
    lakeShape.bezierCurveTo(20, 50, -20, 40, -40, 20);
    lakeShape.bezierCurveTo(-60, 0, -40, -30, 0, -30);

    const lakeGeo = new THREE.ShapeGeometry(lakeShape);
    const lakeMat = new THREE.MeshStandardMaterial({ color: '#0ea5e9', roughness: 0.1, metalness: 0.8 });
    const lakeMesh = new THREE.Mesh(lakeGeo, lakeMat);
    lakeMesh.rotation.x = -Math.PI / 2;
    lakeMesh.position.set(-10, 0.12, 0);
    parkGroup.add(lakeMesh);

    // Add some sports courts on the side
    const courtGeo = new THREE.PlaneGeometry(28, 16);
    const courtMat = new THREE.MeshStandardMaterial({ color: '#ea580c', roughness: 0.3 }); // Orange basketball/tennis courts
    const court1 = new THREE.Mesh(courtGeo, courtMat);
    court1.rotation.x = -Math.PI / 2;
    court1.position.set(45, 0.11, 0);
    parkGroup.add(court1);

    const court2 = new THREE.Mesh(courtGeo, courtMat);
    court2.rotation.x = -Math.PI / 2;
    court2.position.set(45, 0.11, 25);
    parkGroup.add(court2);

    this.scene.add(parkGroup);
  }

}

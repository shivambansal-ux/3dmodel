import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CityBuilder } from './CityBuilder';
import { ZONES, BUILDINGS, ROAD_NETWORKS } from '../data/cityData';
import { BuildingData, ZoneId, CameraMode, TimeOfDay, Vehicle } from '../types';

interface CityCanvasProps {
  cameraMode: CameraMode;
  selectedZoneId: ZoneId | null;
  selectedBuilding: BuildingData | null;
  timeOfDay: TimeOfDay;
  infrastructureViewActive: boolean;
  activeRoadId: string;
  onSelectBuilding: (bld: BuildingData | null) => void;
  onSelectZone: (zoneId: ZoneId) => void;
  onSelectRoad: (roadId: string) => void;
  roadDrivingProgress: number;
  simSpeedMultiplier?: number;
  selectedVehicleId?: string | null;
  onUpdateFleet?: (vehicles: Vehicle[]) => void;
}

export const CityCanvas: React.FC<CityCanvasProps> = ({
  cameraMode,
  selectedZoneId,
  selectedBuilding,
  timeOfDay,
  infrastructureViewActive,
  activeRoadId,
  onSelectBuilding,
  onSelectZone,
  onSelectRoad,
  roadDrivingProgress,
  simSpeedMultiplier = 1.0,
  selectedVehicleId,
  onUpdateFleet,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const zoneLabelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const controlsRef = useRef<OrbitControls | null>(null);
  const builderRef = useRef<CityBuilder | null>(null);
  const vehiclesRef = useRef<Vehicle[]>([]);
  const buildingMeshMapRef = useRef<Map<string, THREE.Group>>(new Map());
  const frameCountRef = useRef(0);

  // Lights refs
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Animation target states for camera transitions
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 280, 260));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isCameraAnimating = useRef(false);

  // Mouse Raycasting
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // 1. Setup Three.js Scene, Camera, Controls & Renderer
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#38bdf8');
    scene.fog = new THREE.FogExp2('#38bdf8', 0.0012);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 2000);
    camera.position.set(0, 280, 260);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // don't go below ground
    controls.minDistance = 2;
    controls.maxDistance = 600;
    
    // Allow free 360 rotation by interrupting camera animations when user interacts
    controls.addEventListener('start', () => {
      isCameraAnimating.current = false;
    });
    
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.8);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight('#ffffff', 1.6);
    sunLight.position.set(150, 250, 150);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 800;
    const d = 250;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Build Entire City
    const builder = new CityBuilder(scene);
    const { buildingMap, vehicles } = builder.buildEntireCity();
    builderRef.current = builder;
    buildingMeshMapRef.current = buildingMap;
    vehiclesRef.current = vehicles;

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(containerRef.current);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth camera interpolation
      if (cameraRef.current && controlsRef.current) {
        if (isCameraAnimating.current) {
          cameraRef.current.position.lerp(targetCamPos.current, 0.05);
          controlsRef.current.target.lerp(targetLookAt.current, 0.05);
          
          if (cameraRef.current.position.distanceTo(targetCamPos.current) < 0.5 &&
              controlsRef.current.target.distanceTo(targetLookAt.current) < 0.5) {
            isCameraAnimating.current = false;
          }
        }
        controlsRef.current.update();
      }

      // Update vehicles motion with speed multiplier
      if (builderRef.current) {
        builderRef.current.updateVehicles(vehiclesRef.current, simSpeedMultiplier);
      }

      // Track selected AV vehicle with chase camera if selected
      if (selectedVehicleId && sceneRef.current) {
        const targetMesh = sceneRef.current.getObjectByName(`vehicle_${selectedVehicleId}`);
        if (targetMesh) {
          const vPos = targetMesh.position;
          targetCamPos.current.set(vPos.x + 12, 10, vPos.z + 18);
          targetLookAt.current.set(vPos.x, 2, vPos.z);
        }
      }

      // Periodically inform parent of fleet state updates (every 20 frames)
      frameCountRef.current++;
      if (frameCountRef.current % 20 === 0 && onUpdateFleet) {
        onUpdateFleet([...vehiclesRef.current]);
      }

      // Update Tooltip 3D to 2D projection
      if (selectedBuilding && tooltipRef.current && cameraRef.current && rendererRef.current) {
        // Find the actual mesh bounding box to get accurate top center
        let heightOffset = selectedBuilding.height + 15; // Hover above building
        const bPos = new THREE.Vector3(selectedBuilding.x, heightOffset, selectedBuilding.z);
        bPos.project(cameraRef.current);
        
        // Convert to screen coordinates
        const x = (bPos.x * 0.5 + 0.5) * rendererRef.current.domElement.clientWidth;
        const y = (-(bPos.y * 0.5) + 0.5) * rendererRef.current.domElement.clientHeight;
        
        // Only show if the building is in front of the camera
        if (bPos.z < 1 && bPos.z > -1) {
          tooltipRef.current.style.transform = `translate(${x}px, ${y}px) translateY(-10px)`;
          tooltipRef.current.style.opacity = '1';
        } else {
          tooltipRef.current.style.opacity = '0';
        }
      } else if (tooltipRef.current) {
        tooltipRef.current.style.opacity = '0';
      }

      // Update Zone Labels 3D to 2D projection
      if (cameraRef.current && rendererRef.current) {
        ZONES.forEach((zone, i) => {
          const labelEl = zoneLabelsRef.current[i];
          if (!labelEl) return;
          
          const pos = new THREE.Vector3(zone.centerPos[0], 25, zone.centerPos[2]);
          pos.project(cameraRef.current);
          
          if (pos.z < 1 && pos.z > -1) {
            const x = (pos.x * 0.5 + 0.5) * rendererRef.current.domElement.clientWidth;
            const y = (-(pos.y * 0.5) + 0.5) * rendererRef.current.domElement.clientHeight;
            
            labelEl.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
            
            // Only show full opacity when not in building/road view
            if (cameraMode === 'master_plan' || cameraMode === 'top_view' || cameraMode === 'isometric') {
                labelEl.style.opacity = '1';
                labelEl.style.pointerEvents = 'auto';
            } else {
                labelEl.style.opacity = '0.3';
                labelEl.style.pointerEvents = 'none';
            }
          } else {
            labelEl.style.opacity = '0';
          }
        });
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.remove();
      }
      rendererRef.current?.dispose();
    };
  }, []);

  // 2. Handle Camera Modes & Position Targets
  
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    isCameraAnimating.current = true;

    if (cameraMode === 'master_plan') {

      targetCamPos.current.set(0, 280, 260);
      targetLookAt.current.set(0, 0, 0);
      controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.02;
    } else if (cameraMode === 'top_view') {
      targetCamPos.current.set(0, 380, 0.1);
      targetLookAt.current.set(0, 0, 0);
    } else if (cameraMode === 'isometric') {
      targetCamPos.current.set(220, 220, 220);
      targetLookAt.current.set(0, 0, 0);
      controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.02;
    } else if (cameraMode === 'zone_view' && selectedZoneId) {
      const zone = ZONES.find(z => z.id === selectedZoneId);
      if (zone) {
        targetCamPos.current.set(zone.centerPos[0], 80, zone.centerPos[2] + 90);
        targetLookAt.current.set(zone.centerPos[0], 0, zone.centerPos[2]);
      }
    } else if (cameraMode === 'building_view' && selectedBuilding) {
      targetCamPos.current.set(
        selectedBuilding.x + 30,
        selectedBuilding.height + 20,
        selectedBuilding.z + 35
      );
      targetLookAt.current.set(selectedBuilding.x, selectedBuilding.height / 2, selectedBuilding.z);
    } else if (cameraMode === 'infrastructure_view') {
      targetCamPos.current.set(0, 160, 200);
      targetLookAt.current.set(0, -5, 0);
      controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.02;
    }
  }, [cameraMode, selectedZoneId, selectedBuilding]);

  // 3. Handle Road View Driving Camera
  
  useEffect(() => {
    if (cameraMode !== 'road_view') return;

    isCameraAnimating.current = true;

    const road = ROAD_NETWORKS.find(r => r.id === activeRoadId) || ROAD_NETWORKS[0];
    const [x1, z1] = road.start;
    const [x2, z2] = road.end;

    // Position camera along road segment at ground level (~1.8m height)
    const curX = x1 + (x2 - x1) * roadDrivingProgress;
    const curZ = z1 + (z2 - z1) * roadDrivingProgress;

    // Look vector along road
    const lookAheadX = curX + (x2 - x1) * 0.1;
    const lookAheadZ = curZ + (z2 - z1) * 0.1;

    targetCamPos.current.set(curX, 2.2, curZ);
    targetLookAt.current.set(lookAheadX, 2.2, lookAheadZ);

    if (controlsRef.current) {
      controlsRef.current.maxPolarAngle = Math.PI / 2 + 0.1; // allow looking slightly up at buildings
      controlsRef.current.minDistance = 0.5;
    }
  }, [cameraMode, activeRoadId, roadDrivingProgress]);

  // 4. Handle Infrastructure Cutaway View Toggle
  useEffect(() => {
    if (builderRef.current) {
      builderRef.current.setInfrastructureView(infrastructureViewActive || cameraMode === 'infrastructure_view');
    }
  }, [infrastructureViewActive, cameraMode]);

  // 5. Handle Time of Day Lighting & Sky
  useEffect(() => {
    if (!sceneRef.current || !sunLightRef.current || !ambientLightRef.current) return;

    if (timeOfDay === 'day') {
      sceneRef.current.background = new THREE.Color('#38bdf8');
      sceneRef.current.fog = new THREE.FogExp2('#38bdf8', 0.0012);
      sunLightRef.current.color.set('#ffffff');
      sunLightRef.current.intensity = 1.6;
      sunLightRef.current.position.set(150, 250, 150);
      ambientLightRef.current.color.set('#ffffff');
      ambientLightRef.current.intensity = 0.8;
    } else if (timeOfDay === 'golden_hour') {
      sceneRef.current.background = new THREE.Color('#fdba74');
      sceneRef.current.fog = new THREE.FogExp2('#fdba74', 0.0015);
      sunLightRef.current.color.set('#f97316');
      sunLightRef.current.intensity = 2.0;
      sunLightRef.current.position.set(220, 60, 200);
      ambientLightRef.current.color.set('#fed7aa');
      ambientLightRef.current.intensity = 0.9;
    } else if (timeOfDay === 'night') {
      sceneRef.current.background = new THREE.Color('#030712');
      sceneRef.current.fog = new THREE.FogExp2('#030712', 0.002);
      sunLightRef.current.color.set('#38bdf8');
      sunLightRef.current.intensity = 0.3;
      sunLightRef.current.position.set(-100, 200, -100);
      ambientLightRef.current.color.set('#1e1b4b');
      ambientLightRef.current.intensity = 0.4;
    }
  }, [timeOfDay]);

  // 6. Raycast Building Selection
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !sceneRef.current || !cameraRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    const intersects = raycaster.current.intersectObjects(sceneRef.current.children, true);

    for (const hit of intersects) {
      if (hit.object.userData && hit.object.userData.buildingData) {
        const bld: BuildingData = hit.object.userData.buildingData;
        onSelectBuilding(bld);
        onSelectZone(bld.zoneId);
        return;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden select-none"
    >
      {/* Zone Labels Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
        {ZONES.map((zone, i) => (
          <div
            key={zone.id}
            ref={el => zoneLabelsRef.current[i] = el}
            className="absolute top-0 left-0 opacity-0 transition-opacity duration-300 pointer-events-none"
            onClick={(e) => {
                e.stopPropagation();
                onSelectZone(zone.id);
            }}
          >
            <div 
              className="px-3 py-1 rounded-md backdrop-blur-sm bg-slate-900/50 border shadow-lg hover:bg-slate-800/80 cursor-pointer transition-colors"
              style={{ borderColor: zone.color }}
            >
              <p className="text-white font-bold text-[10px] tracking-widest uppercase whitespace-nowrap" style={{ color: zone.color }}>
                {zone.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Building Tooltip Overlay */}
      <div 
        ref={tooltipRef} 
        className="absolute top-0 left-0 pointer-events-none opacity-0 transition-opacity duration-200 z-50 transform -translate-x-1/2 -translate-y-full mb-4"
      >
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-slate-700/50 shadow-2xl shadow-black/50 text-center relative">
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-slate-900/90 border-r-[8px] border-r-transparent"></div>
          {selectedBuilding && (() => {
            const zoneName = ZONES.find(z => z.id === selectedBuilding.zoneId)?.name || 'Zone';
            return (
              <>
                <div className="text-xs font-bold text-sky-400 mb-1 uppercase tracking-wider">{zoneName}</div>
                <div className="text-sm font-semibold whitespace-nowrap">{selectedBuilding.name}</div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

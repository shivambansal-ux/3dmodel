import React, { useState } from 'react';
import { CityCanvas } from './components/CityCanvas';
import { UIOverlay } from './components/UIOverlay';
import { BuildingModal } from './components/BuildingModal';
import { ZoneId, CameraMode, TimeOfDay, BuildingData, Vehicle } from './types';
import { ROAD_NETWORKS, INITIAL_AV_FLEET } from './data/cityData';

export default function App() {
  const [cameraMode, setCameraMode] = useState<CameraMode>('master_plan');
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [infrastructureViewActive, setInfrastructureViewActive] = useState<boolean>(false);
  const [activeRoadId, setActiveRoadId] = useState<string>('road_outer_north');
  const [roadDrivingProgress, setRoadDrivingProgress] = useState<number>(0.2);

  // AV Simulation States
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState<number>(1.0);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [avFleet, setAvFleet] = useState<Vehicle[]>(INITIAL_AV_FLEET);

  // Handle Driving along road in Street View
  const handleDriveRoad = (delta: number) => {
    setRoadDrivingProgress((prev) => {
      let next = prev + delta;
      if (next > 0.95) next = 0.05;
      if (next < 0.05) next = 0.95;
      return next;
    });
  };

  // Handle Street View entry for specific zone
  const handleEnterRoadView = (zoneId: string) => {
    let targetRoad = 'road_outer_north';
    if (zoneId === 'residential') targetRoad = 'road_inner_west';
    else if (zoneId === 'education') targetRoad = 'road_inner_east';
    else if (zoneId === 'healthcare') targetRoad = 'road_emergency_hosp';
    else if (zoneId === 'business_hub') targetRoad = 'road_axis_ns_south';
    else if (zoneId === 'industrial') targetRoad = 'road_freight_east';
    else if (zoneId === 'public_services') targetRoad = 'road_axis_ns_north';

    setActiveRoadId(targetRoad);
    setCameraMode('road_view');
  };

  // Force send a vehicle to EV charging plaza
  const handleSendVehicleToCharge = (vehicleId: string) => {
    setAvFleet((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            batteryLevel: 15, // trigger auto-docking sequence
            status: 'CRUISING',
          };
        }
        return v;
      })
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 3D City Viewport */}
      <CityCanvas
        cameraMode={cameraMode}
        selectedZoneId={selectedZoneId}
        selectedBuilding={selectedBuilding}
        timeOfDay={timeOfDay}
        infrastructureViewActive={infrastructureViewActive}
        activeRoadId={activeRoadId}
        onSelectBuilding={(bld) => setSelectedBuilding(bld)}
        onSelectZone={(zoneId) => setSelectedZoneId(zoneId)}
        onSelectRoad={(roadId) => setActiveRoadId(roadId)}
        roadDrivingProgress={roadDrivingProgress}
        simSpeedMultiplier={simSpeedMultiplier}
        selectedVehicleId={selectedVehicleId}
        onUpdateFleet={(updatedFleet) => setAvFleet(updatedFleet)}
      />

      {/* UI Navigation & Overlays */}
      <UIOverlay
        cameraMode={cameraMode}
        selectedZoneId={selectedZoneId}
        selectedBuilding={selectedBuilding}
        timeOfDay={timeOfDay}
        infrastructureViewActive={infrastructureViewActive}
        activeRoadId={activeRoadId}
        roadDrivingProgress={roadDrivingProgress}
        simSpeedMultiplier={simSpeedMultiplier}
        selectedVehicleId={selectedVehicleId}
        avFleet={avFleet}
        onSetCameraMode={(mode) => setCameraMode(mode)}
        onSetSelectedZone={(zoneId) => setSelectedZoneId(zoneId)}
        onSetTimeOfDay={(time) => setTimeOfDay(time)}
        onToggleInfrastructureView={() => setInfrastructureViewActive(!infrastructureViewActive)}
        onSelectRoad={(roadId) => setActiveRoadId(roadId)}
        onDriveRoad={handleDriveRoad}
        onSelectBuilding={(bld) => setSelectedBuilding(bld)}
        onSetSimSpeedMultiplier={(multiplier) => setSimSpeedMultiplier(multiplier)}
        onSelectVehicle={(vehicleId) => setSelectedVehicleId(vehicleId)}
        onSendVehicleToCharge={handleSendVehicleToCharge}
      />

      {/* Selected Building Details Modal */}
      <BuildingModal
        building={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        onEnterRoadView={handleEnterRoadView}
      />
    </div>
  );
}

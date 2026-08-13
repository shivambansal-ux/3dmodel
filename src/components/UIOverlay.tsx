import React, { useState } from 'react';
import { ZONES, BUILDINGS, ROAD_NETWORKS, CITY_STATS, EV_CHARGING_STATIONS, BUS_STATIONS } from '../data/cityData';
import { ZoneId, CameraMode, TimeOfDay, BuildingData, Vehicle } from '../types';
import { 
  Compass, 
  Sun, 
  Moon, 
  Sunset, 
  Eye, 
  Layers, 
  Navigation, 
  Search, 
  BarChart3, 
  RotateCcw, 
  Building2, 
  X, 
  ChevronRight,
  ShieldCheck,
  Droplets,
  Zap,
  Activity,
  ArrowUp,
  ArrowDown,
  Car,
  BatteryCharging,
  Gauge,
  Radio,
  Cpu,
  Bus
} from 'lucide-react';

interface UIOverlayProps {
  cameraMode: CameraMode;
  selectedZoneId: ZoneId | null;
  selectedBuilding: BuildingData | null;
  timeOfDay: TimeOfDay;
  infrastructureViewActive: boolean;
  activeRoadId: string;
  roadDrivingProgress: number;
  simSpeedMultiplier: number;
  selectedVehicleId: string | null;
  avFleet: Vehicle[];
  onSetCameraMode: (mode: CameraMode) => void;
  onSetSelectedZone: (zoneId: ZoneId) => void;
  onSetTimeOfDay: (time: TimeOfDay) => void;
  onToggleInfrastructureView: () => void;
  onSelectRoad: (roadId: string) => void;
  onDriveRoad: (delta: number) => void;
  onSelectBuilding: (bld: BuildingData | null) => void;
  onSetSimSpeedMultiplier: (multiplier: number) => void;
  onSelectVehicle: (vehicleId: string | null) => void;
  onSendVehicleToCharge: (vehicleId: string) => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({
  cameraMode,
  selectedZoneId,
  selectedBuilding,
  timeOfDay,
  infrastructureViewActive,
  activeRoadId,
  roadDrivingProgress,
  simSpeedMultiplier,
  selectedVehicleId,
  avFleet,
  onSetCameraMode,
  onSetSelectedZone,
  onSetTimeOfDay,
  onToggleInfrastructureView,
  onSelectRoad,
  onDriveRoad,
  onSelectBuilding,
  onSetSimSpeedMultiplier,
  onSelectVehicle,
  onSendVehicleToCharge,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAVPanel, setShowAVPanel] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Filter buildings by search
  const filteredBuildings = searchQuery.trim()
    ? BUILDINGS.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.zoneId.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const currentRoad = ROAD_NETWORKS.find(r => r.id === activeRoadId) || ROAD_NETWORKS[0];

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5 z-30 font-sans select-none">
      
      {/* 1. TOP HEADER & NAVIGATION BAR */}
      <div className="pointer-events-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-3 sm:px-5 shadow-2xl">
        
        {/* City Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                RAGA <span className="text-sky-400">INFRA</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                300 ACRES
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Raga Infrastructure & Smart Township Master Plan</p>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-xs">
          <div className="flex items-center bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 focus-within:border-sky-500 transition">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search buildings or zones..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchDropdown && filteredBuildings.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-slate-700 rounded-xl max-h-56 overflow-y-auto shadow-2xl p-1 z-50 pointer-events-auto">
              {filteredBuildings.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    onSelectBuilding(b);
                    onSetSelectedZone(b.zoneId);
                    onSetCameraMode('building_view');
                    setShowSearchDropdown(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 transition"
                >
                  <div>
                    <div className="font-semibold text-white">{b.name}</div>
                    <div className="text-[10px] text-slate-400">{b.type}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls: Time of Day, Stats, Infrastructure */}
        <div className="flex items-center space-x-2">
          
          {/* Time of Day Toggles */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/60 rounded-xl p-1">
            <button
              onClick={() => onSetTimeOfDay('day')}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${timeOfDay === 'day' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              title="Day Mode"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSetTimeOfDay('golden_hour')}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${timeOfDay === 'golden_hour' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              title="Golden Hour Sunset"
            >
              <Sunset className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSetTimeOfDay('night')}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${timeOfDay === 'night' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              title="Night Mode"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* AV Traffic Simulation Modal Toggle */}
          <button
            onClick={() => setShowAVPanel(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition ${
              showAVPanel || selectedVehicleId
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-emerald-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
            }`}
            title="Autonomous Vehicle Fleet Telemetry & Simulation"
          >
            <Car className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">AV SIMULATION</span>
          </button>

          {/* Infrastructure View Cutaway Toggle */}
          <button
            onClick={onToggleInfrastructureView}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition ${
              infrastructureViewActive
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">INFRASTRUCTURE</span>
          </button>

          {/* City Stats Modal Toggle */}
          <button
            onClick={() => setShowStatsModal(true)}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="City Analytics & Stats"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. ROAD VIEW STREET LEVEL HUD (ACTIVE WHEN IN ROAD VIEW) */}
      {cameraMode === 'road_view' && (
        <div className="pointer-events-auto self-center bg-slate-900/90 backdrop-blur-xl border border-sky-500/40 rounded-2xl p-4 shadow-2xl max-w-lg w-full mb-3 text-white animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-sky-400 animate-pulse" />
              <div>
                <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Street View Navigation</div>
                <div className="text-sm font-bold text-white">{currentRoad.name}</div>
              </div>
            </div>
            <button
              onClick={() => onSetCameraMode('master_plan')}
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-sky-500/20"
            >
              BACK TO MASTER PLAN
            </button>
          </div>

          {/* Road Switcher & Driving Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-auto">
              <label className="text-[10px] text-slate-400 block mb-1">Select Road Corridor:</label>
              <select
                value={activeRoadId}
                onChange={(e) => onSelectRoad(e.target.value)}
                className="bg-slate-800 text-xs text-white border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500 w-full"
              >
                {ROAD_NETWORKS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Drive Forward & Backward Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onDriveRoad(-0.05)}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center space-x-1 text-xs font-semibold transition active:scale-95"
              >
                <ArrowDown className="w-4 h-4 text-sky-400" />
                <span>Drive Back</span>
              </button>
              <button
                onClick={() => onDriveRoad(0.05)}
                className="p-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl font-bold flex items-center space-x-1 text-xs transition active:scale-95 shadow-md shadow-sky-500/20"
              >
                <span>Drive Ahead</span>
                <ArrowUp className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. UNDERGROUND UTILITIES LEGEND (ACTIVE IN INFRASTRUCTURE VIEW) */}
      {infrastructureViewActive && (
        <div className="pointer-events-auto self-start bg-slate-900/90 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-3 shadow-2xl max-w-xs text-white mb-2">
          <div className="text-xs font-bold text-amber-400 mb-2 flex items-center space-x-1.5">
            <Layers className="w-4 h-4" />
            <span>Underground Utility Cutaway Legend</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block shadow-sm"></span>
              <span className="text-slate-200">Fresh Potable Water Pipeline (-4m)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm"></span>
              <span className="text-slate-200">Central Sewage Drain Line (-7m)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm"></span>
              <span className="text-slate-200">Stormwater & Rain Harvesting (-5m)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block shadow-sm"></span>
              <span className="text-slate-200">STP Recycled Irrigation Drains (-3m)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-yellow-300 inline-block shadow-sm"></span>
              <span className="text-slate-200">HV Electrical & Fiber Tunnels (-2.5m)</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. BOTTOM QUICK NAVIGATION TOOLBAR & ZONE SELECTOR */}
      <div className="pointer-events-auto overflow-x-auto bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-2 sm:p-3 shadow-2xl flex items-center justify-start sm:justify-center space-x-2 no-scrollbar">
        
        {/* CAMERA MODE SWITCHERS */}
        <button
          onClick={() => onSetCameraMode('master_plan')}
          className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5 ${
            cameraMode === 'master_plan'
              ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>MASTER PLAN</span>
        </button>

        <button
          onClick={() => onSetCameraMode('top_view')}
          className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            cameraMode === 'top_view'
              ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <span>TOP VIEW</span>
        </button>

        <button
          onClick={() => onSetCameraMode('master_plan')} // Isometric essentially Master Plan
          className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            cameraMode === 'master_plan'
              ? 'bg-fuchsia-500 text-slate-950 shadow-lg shadow-fuchsia-500/20'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <span>ISOMETRIC VIEW</span>
        </button>

        <div className="w-px h-6 bg-slate-700/60 mx-1"></div>

        {/* ROAD VIEW BUTTON (Moved from end) */}
        <button
          onClick={() => onSetCameraMode('road_view')}
          className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition ${
            cameraMode === 'road_view'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-slate-800 text-slate-300 hover:bg-amber-400/10 hover:text-amber-400'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>ROAD VIEW</span>
        </button>
        
        <div className="w-px h-6 bg-slate-700/60 mx-1"></div>
        
        {/* INFRASTRUCTURE VIEW */}
        <button
          onClick={onToggleInfrastructureView}
          className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition ${
            infrastructureViewActive
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-800 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>INFRASTRUCTURE VIEW</span>
        </button>

        <div className="w-px h-6 bg-slate-700/60 mx-1"></div>

        {/* ZONE SELECTION BUTTONS */}
        {ZONES.map((zone) => (
          <button
            key={zone.id}
            onClick={() => {
              onSetSelectedZone(zone.id);
              onSetCameraMode('zone_view');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              selectedZoneId === zone.id && cameraMode === 'zone_view'
                ? 'bg-slate-100 text-slate-950 border-white shadow-lg'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
            }`}
            style={{
              borderColor: selectedZoneId === zone.id ? zone.color : 'transparent',
            }}
          >
            {zone.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 5. CITY ANALYTICS & METRICS MODAL */}
      {showStatsModal && (
        <div className="pointer-events-auto fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowStatsModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Raga Infra Metrics</h2>
                <p className="text-xs text-slate-400">300-Acre Master Township Sustainability Index</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Township Area</div>
                <div className="text-xl font-bold text-sky-400">{CITY_STATS.totalAreaAcres} Acres</div>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Residential Capacity</div>
                <div className="text-xl font-bold text-emerald-400">{CITY_STATS.populationCapacity.toLocaleString()} People</div>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Solar Generation</div>
                <div className="text-xl font-bold text-amber-400">{CITY_STATS.solarCapacityMw} MW Peak</div>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Green Canopy Cover</div>
                <div className="text-xl font-bold text-green-400">{CITY_STATS.greenCoverPercent}% Total Area</div>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Traffic Lights</div>
                <div className="text-xl font-bold text-blue-400">0 (100% Roundabouts & Grade-Separated)</div>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Water Recycled (ZLD)</div>
                <div className="text-xl font-bold text-cyan-400">{CITY_STATS.waterRecycledPercent}% STP Efficiency</div>
              </div>
            </div>

            <button
              onClick={() => setShowStatsModal(false)}
              className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-2.5 rounded-xl transition"
            >
              Close Analytics Panel
            </button>
          </div>
        </div>
      )}

      {/* 6. AUTONOMOUS VEHICLE TRAFFIC & EV SIMULATION CONTROL MODAL */}
      {showAVPanel && (
        <div className="pointer-events-auto fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-4 sm:p-6 text-white shadow-2xl relative max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Car className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-white">Autonomous Vehicle Network Telemetry</h2>
                    <span className="flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>LIVE SIMULATION</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Zero-Signal Traffic Management & Automatic EV Station Docking</p>
                </div>
              </div>
              <button
                onClick={() => setShowAVPanel(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Telemetry KPIs & Speed Multiplier */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Active AV Fleet</div>
                <div className="text-lg font-black text-emerald-400">{avFleet.length} Vehicles</div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Cruising Corridor Speed</div>
                <div className="text-lg font-black text-sky-400">
                  {avFleet.filter(v => v.status === 'CRUISING').length} Cruising
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Roundabout Speed Control</div>
                <div className="text-lg font-black text-amber-400">
                  {avFleet.filter(v => v.status === 'ROUNDABOUT_APPROACH').length} Decelerating
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-bold">EV Plaza Docked</div>
                <div className="text-lg font-black text-emerald-300">
                  {avFleet.filter(v => v.status === 'CHARGING').length} Charging
                </div>
              </div>
              
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Transit Network</div>
                <div className="text-lg font-black text-purple-400">
                  <Bus className="w-4 h-4 inline-block mr-1 -mt-1" />
                  {BUS_STATIONS.length} Stations
                </div>
              </div>
            </div>

            {/* Simulation Speed Controls */}
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">Traffic Simulation Speed:</span>
              </div>
              <div className="flex items-center space-x-1.5">
                {[1.0, 2.0, 5.0].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => onSetSimSpeedMultiplier(speed)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      simSpeedMultiplier === speed
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {speed}x {speed === 1.0 ? 'Normal' : speed === 2.0 ? 'Fast' : 'Hyper'}
                  </button>
                ))}
              </div>
            </div>

            {/* AV Fleet Table */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-4">
              {avFleet.map((v) => (
                <div
                  key={v.id}
                  className={`p-3 rounded-xl border transition flex items-center justify-between ${
                    selectedVehicleId === v.id
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-lg'
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-8 rounded-full shadow-md"
                      style={{ backgroundColor: v.color }}
                    ></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{v.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 uppercase font-mono">
                          {v.type.replace('ev_', '')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center space-x-2 mt-0.5">
                        <span className="font-medium text-emerald-300">{v.currentLocationName || 'Corridor'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Battery & Status */}
                  <div className="flex items-center space-x-4">
                    <div className="w-24">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                        <span>Battery</span>
                        <span className="font-mono font-bold text-slate-200">{Math.round(v.batteryLevel)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            v.batteryLevel > 50
                              ? 'bg-emerald-400'
                              : v.batteryLevel > 20
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${v.batteryLevel}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          onSelectVehicle(selectedVehicleId === v.id ? null : v.id);
                          setShowAVPanel(false);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                          selectedVehicleId === v.id
                            ? 'bg-emerald-500 text-slate-950 shadow'
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{selectedVehicleId === v.id ? 'Following' : 'Chase Cam'}</span>
                      </button>

                      {v.status !== 'CHARGING' && (
                        <button
                          onClick={() => onSendVehicleToCharge(v.id)}
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
                          title="Force send to nearest EV charging station"
                        >
                          <BatteryCharging className="w-3.5 h-3.5" />
                          <span>Dock</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAVPanel(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl transition"
            >
              Resume Live Simulation
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
